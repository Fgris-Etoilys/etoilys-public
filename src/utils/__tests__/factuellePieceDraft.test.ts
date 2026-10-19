import { describe, expect, it } from 'vitest';
import {
  buildFactuellePieceInput,
  createFactuellePieceDraft,
  sanitaryDimensionsUnconfirmed,
  withCouchageType,
  type FactuellePieceDraft,
} from '../factuellePieceDraft';
import {
  parseCatalogueFaits,
  parseFaitsGrille,
  type PieceFactuelle,
} from '../simulatorFactuelle.types';
import {
  catalogueResponse,
  faitsResponse,
  petiteChambre,
  piece,
} from '../../test/factuelleFixtures';

const catalogue = parseCatalogueFaits(catalogueResponse);

function parsedPiece(raw: Record<string, unknown>): PieceFactuelle {
  const parsed = parseFaitsGrille(faitsResponse([raw])).logement.pieces[0];
  if (!parsed) throw new Error('Pièce de test invalide');
  return parsed;
}

function buildPayload(draft: FactuellePieceDraft) {
  const built = buildFactuellePieceInput(draft, catalogue);
  if (!built.ok) throw new Error(JSON.stringify(built.errors));
  return built.payload;
}

function draftWithBed(type: Parameters<typeof withCouchageType>[1], overrides = {}) {
  const draft = createFactuellePieceDraft('CHAMBRE');
  draft.surface = '12';
  draft.couchages = [
    { ...withCouchageType('33333333-3333-4333-8333-333333333333', type, catalogue), ...overrides },
  ];
  return draft;
}

describe('factuellePieceDraft', () => {
  it('préserve inconnu, Non et Oui, et distingue zéro d’une valeur vide', () => {
    const draft = createFactuellePieceDraft(
      'CHAMBRE',
      parsedPiece(
        piece({
          id: 'p',
          type_piece: 'CHAMBRE',
          prise: false,
          inspection: { rangements: true, eclairages_fonctionnent: null },
          nombre_oreillers: 0,
        })
      )
    );
    const payload = buildPayload(draft);

    expect(payload.prise).toBe(false);
    expect(payload.ouvrant).toBe(true);
    expect(payload.ventilation).toBeNull();
    expect(payload.inspection?.rangements).toBe(true);
    expect(payload.inspection?.eclairages_fonctionnent).toBeNull();
    expect(payload.nombre_oreillers).toBe(0);
    expect(payload.tous_lits_couette).toBeNull();
    expect(payload.inspection?.couchage).toBe(false);
  });

  it('transmet les couchages d’une pièce hors pièce d’habitation sans les retirer', () => {
    const draft = createFactuellePieceDraft('CHAMBRE', parsedPiece(petiteChambre));
    const payload = buildPayload(draft);

    expect(payload.surface).toBe(6);
    expect(payload.ouvrant).toBeNull();
    expect(payload.couchages).toHaveLength(1);
    expect(payload.couchages[0]?.id).toBe('22222222-2222-4222-8222-222222222222');
    expect(payload.inspection?.couchage).toBe(true);
  });

  it('applique valeurs initiales, minima et pas du catalogue', () => {
    expect(withCouchageType('a', 'TWINS', catalogue)).toMatchObject({
      profil: 'UNE_PLACE',
      nombre_places: '2',
    });
    expect(withCouchageType('a', 'GIGOGNE', catalogue)).toMatchObject({ nombre_places: '1' });
    expect(withCouchageType('a', 'SUPERPOSEE', catalogue)).toMatchObject({
      profil: null,
      nombre_places: '',
    });

    const twinsImpair = buildFactuellePieceInput(
      draftWithBed('TWINS', { nombre_places: '3', largeur_cm: '90', longueur_cm: '190' }),
      catalogue
    );
    expect(twinsImpair.ok).toBe(false);

    expect(
      buildFactuellePieceInput(
        draftWithBed('DOUBLE_FIXE', { nombre_places: '4', largeur_cm: '160', longueur_cm: '200' }),
        catalogue
      ).ok
    ).toBe(true);
    expect(
      buildFactuellePieceInput(
        draftWithBed('SUPERPOSEE', {
          profil: 'UNE_PLACE',
          nombre_places: '1',
          largeur_cm: '90',
          longueur_cm: '190',
        }),
        catalogue
      ).ok
    ).toBe(true);
  });

  it('exige une ligne de couchage complète et accepte des dimensions libres non conformes', () => {
    const incomplete = buildFactuellePieceInput(draftWithBed('SIMPLE_FIXE'), catalogue);
    expect(incomplete.ok).toBe(false);

    const free = buildPayload(
      draftWithBed('SIMPLE_FIXE', { format: 'libre', largeur_cm: '70', longueur_cm: '180' })
    );
    expect(free.couchages[0]).toMatchObject({ largeur_cm: 70, longueur_cm: 180, nombre_places: 1 });
  });

  it('refuse deux lignes de même configuration et un type sans couchages', () => {
    const draft = draftWithBed('SIMPLE_FIXE', { largeur_cm: '90', longueur_cm: '190' });
    const [line] = draft.couchages;
    if (!line) throw new Error('Ligne manquante');
    draft.couchages = [line, { ...line, id: '44444444-4444-4444-8444-444444444444' }];
    expect(buildFactuellePieceInput(draft, catalogue).ok).toBe(false);

    const kitchen = {
      ...draftWithBed('SIMPLE_FIXE', { largeur_cm: '90', longueur_cm: '190' }),
      type_piece: 'CUISINE' as const,
    };
    const built = buildFactuellePieceInput(kitchen, catalogue);
    expect(built.ok).toBe(false);
    if (!built.ok) expect(built.errors.couchages).toBeDefined();
  });

  it('exige les détails d’une douche présente mais pas ceux d’un équipement absent', () => {
    const draft = createFactuellePieceDraft('SALLE_DE_BAIN');
    expect(draft.inspection.seche_cheveux).toBe('0');
    expect(draft.sanitaires.baignoire_sabot).toBe(false);
    draft.sanitaires.presence_douche = true;
    const missing = buildFactuellePieceInput(draft, catalogue);
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(Object.keys(missing.errors)).toEqual(
        expect.arrayContaining([
          'sanitaires.douche.protection',
          'sanitaires.douche.dimensions_superieures',
        ])
      );
    }

    draft.sanitaires.douche = {
      protection: 'RIDEAU_SEUL',
      dimensions_superieures: false,
      largeur_cm: '',
      longueur_cm: '',
    };
    draft.sanitaires.presence_baignoire_avec_douchette = false;
    const payload = buildPayload(draft);
    expect(payload.surface).toBe(0);
    expect(payload.sanitaires?.douche?.protection).toBe('RIDEAU_SEUL');
    expect(payload.inspection?.seche_cheveux).toBe(0);
  });

  it('signale des dimensions supérieures non confirmées seulement à seuil atteint ou en dessous', () => {
    const equipment = (largeur: string, longueur: string) => ({
      protection: null,
      dimensions_superieures: true,
      largeur_cm: largeur,
      longueur_cm: longueur,
    });

    expect(sanitaryDimensionsUnconfirmed(equipment('80', '80'), 'douche')).toBe(true);
    expect(sanitaryDimensionsUnconfirmed(equipment('81', '80'), 'douche')).toBe(false);
    expect(sanitaryDimensionsUnconfirmed(equipment('75', '170'), 'baignoire')).toBe(true);
    expect(sanitaryDimensionsUnconfirmed(equipment('75', '171'), 'baignoire')).toBe(false);
    expect(sanitaryDimensionsUnconfirmed(equipment('80', ''), 'douche')).toBe(false);
  });
});
