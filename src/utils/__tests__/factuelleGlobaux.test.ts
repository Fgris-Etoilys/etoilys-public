import { describe, expect, it } from 'vitest';
import { catalogueResponse } from '../../test/factuelleFixtures';
import {
  buildGlobalPayload,
  communChoice,
  communFromChoice,
  createGlobalDraft,
  inventaireGroups,
  inventaireLabel,
  isGlobalSaveNoop,
  type GlobalDraft,
} from '../factuelleGlobaux';
import { parseCatalogueFaits, parseFaitsGlobaux } from '../simulatorFactuelle.types';

const catalogue = parseCatalogueFaits(catalogueResponse);

function build(draft: GlobalDraft) {
  const result = buildGlobalPayload(draft, catalogue);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result;
}

describe('faits globaux FACTUELLE — brouillons et corps de PUT', () => {
  it('distingue Non, Oui privatif, Oui commun et inconnu pour C18/C19', () => {
    expect(communFromChoice('non')).toEqual({ appreciation_commune: false, commun: null });
    expect(communFromChoice('privatif')).toEqual({ appreciation_commune: true, commun: false });
    expect(communFromChoice('commun')).toEqual({ appreciation_commune: true, commun: true });
    expect(communFromChoice(null)).toEqual({ appreciation_commune: null, commun: null });
    expect(communChoice({ appreciation_commune: true, commun: null })).toBeNull();
  });

  it('retire la précision C25 quand l’appréciation commune est négative', () => {
    expect(
      build({
        bloc: 'c25',
        value: { appreciation_commune: false, besoin_assises_sans_dossier: true },
      }).payload
    ).toEqual({ appreciation_commune: false, besoin_assises_sans_dossier: null });
  });

  it('envoie une absence connue de plaques, et refuse une ligne de plaque incomplète', () => {
    expect(build({ bloc: 'cuisson', value: { presence: false, lignes: [] } }).payload).toEqual({
      presence_plaques: false,
      lignes: [],
    });
    expect(build({ bloc: 'cuisson', value: { presence: null, lignes: [] } }).payload).toEqual({
      presence_plaques: null,
      lignes: [],
    });
    const incomplete = buildGlobalPayload(
      {
        bloc: 'cuisson',
        value: { presence: true, lignes: [{ id: 'l1', technologie: null, nombre: '' }] },
      },
      catalogue
    );
    expect(incomplete).toEqual({
      ok: false,
      errors: {
        'cuisson.l1.technologie': 'Sélectionnez un type de plaque.',
        'cuisson.l1.nombre_foyers': 'Indiquez un nombre de foyers entier.',
      },
    });
    expect(
      build({
        bloc: 'cuisson',
        value: { presence: true, lignes: [{ id: 'l1', technologie: 'GAZ', nombre: '0' }] },
      }).payload
    ).toEqual({
      presence_plaques: true,
      lignes: [{ id: 'l1', technologie: 'GAZ', nombre_foyers: 0 }],
    });
  });

  it('n’envoie le choix du combiné que pour un combiné seul, sans champ déprécié', () => {
    expect(
      build({
        bloc: 'four_micro_ondes',
        value: { configuration: 'APPAREILS_DISTINCTS', choix_combine: 'FOUR' },
      }).payload
    ).toEqual({ configuration: 'APPAREILS_DISTINCTS', choix_combine: null });
    expect(
      build({
        bloc: 'four_micro_ondes',
        value: { configuration: 'COMBINE_SEUL', choix_combine: null },
      }).payload
    ).toEqual({ configuration: 'COMBINE_SEUL', choix_combine: null });
  });

  it('ordonne le chauffage selon le catalogue et n’envoie ni motif ni appréciation commune', () => {
    const payload = build({
      bloc: 'chauffage',
      value: {
        etat: 'INSTALLATIONS',
        types: ['AUTRE', 'ELECTRIQUE_FIXE'],
        autre: '  Poêle à granulés ',
      },
    }).payload;
    expect(payload).toEqual({
      etat: 'INSTALLATIONS',
      types: ['ELECTRIQUE_FIXE', 'AUTRE'],
      autre: 'Poêle à granulés',
    });
    expect(
      build({ bloc: 'chauffage', value: { etat: 'AUCUN', types: ['ELECTRIQUE_FIXE'], autre: 'x' } })
        .payload
    ).toEqual({ etat: 'AUCUN', types: [], autre: null });
  });

  it('distingue mesures inconnues, aucune mesure et mesures ordonnées par le backend', () => {
    const empty = { aucune: false, mesures: [], autresOuvert: false, autres: [] };
    expect(build({ bloc: 'mesures_energie', value: empty }).payload).toEqual({
      aucune_mesure: null,
      mesures: [],
      autres: [],
    });
    expect(
      build({ bloc: 'mesures_energie', value: { ...empty, aucune: true, mesures: ['VITRAGE'] } })
        .payload
    ).toEqual({ aucune_mesure: true, mesures: [], autres: [] });
    expect(
      build({
        bloc: 'mesures_energie',
        value: {
          aucune: false,
          mesures: ['ISOLATION', 'VITRAGE'],
          autresOuvert: true,
          autres: ['Ventilation'],
        },
      }).payload
    ).toEqual({ aucune_mesure: false, mesures: ['VITRAGE', 'ISOLATION'], autres: ['Ventilation'] });
  });

  it('envoie toutes les cases d’un inventaire, décochées comprises', () => {
    expect(build({ bloc: 'c63', value: { VERRES_EAU: true } }).payload).toEqual({
      items: { ASSIETTES_PLATES: false, VERRES_EAU: true },
    });
    const inventaire = catalogue.inventaires[0];
    expect(inventaire && inventaireLabel(inventaire.items[1]!)).toBe('4 verres à eau');
    expect(inventaire && inventaireGroups(inventaire.items)).toHaveLength(1);
  });
});

describe('faits globaux FACTUELLE — sauvegarde sans effet', () => {
  const capacity = 4;

  function noop(globauxJson: Record<string, unknown>, draft: GlobalDraft, capacite = capacity) {
    const globaux = parseFaitsGlobaux(globauxJson);
    const initial = buildGlobalPayload(createGlobalDraft(draft.bloc, globaux), catalogue);
    return isGlobalSaveNoop(build(draft), initial, globaux, capacite);
  }

  it('n’envoie rien pour un bloc inchangé, mais envoie une modification', () => {
    const globaux = { c18: { appreciation_commune: true, commun: false } };
    expect(
      noop(globaux, { bloc: 'c18', value: { appreciation_commune: true, commun: false } })
    ).toBe(true);
    expect(
      noop(globaux, { bloc: 'c18', value: { appreciation_commune: false, commun: null } })
    ).toBe(false);
  });

  it('envoie toujours un inventaire jamais enregistré, même entièrement décoché', () => {
    expect(noop({ c63: null }, { bloc: 'c63', value: {} })).toBe(false);
  });

  it('envoie C63/C64 inchangés quand la capacité actuelle diffère du dernier constat', () => {
    const saved = {
      c63: { items: { ASSIETTES_PLATES: true, VERRES_EAU: true }, capacite_constatee: 2 },
    };
    const draft: GlobalDraft = { bloc: 'c63', value: { ASSIETTES_PLATES: true, VERRES_EAU: true } };
    expect(noop(saved, draft, 4)).toBe(false);
    expect(noop(saved, draft, 2)).toBe(true);
  });
});
