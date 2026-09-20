import { jsPDF } from 'jspdf';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { buildGridSummary, type GridCriterion } from '../../content/simulatorGrid';
import type { PieceDto } from '../simulatorApi';
import { createSimulationClassementPdf } from '../simulationClassementPdf';
import type { SimulationClassementPdfInput } from '../simulationClassementPdf.types';
import * as simulatorPdfShared from '../simulatorPdfShared';

interface TextDraw {
  text: string;
  page: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function criterion(
  number: number,
  label: string,
  status: GridCriterion['categories'][number]['statut'] = 'OBLIGATOIRE'
): GridCriterion {
  return {
    num_critere: number,
    libelle: label,
    points: number === 5 ? 0 : number,
    peut_etre_non_applicable: true,
    categories: [{ nom: '3*', statut: status }],
  };
}

function fixture(): SimulationClassementPdfInput {
  const criteria = [
    criterion(1, 'CRITERE_OBLIGATOIRE_REFUSE'),
    criterion(2, 'CRITERE_OVERRIDE_ONC', 'OPTIONNEL'),
    criterion(3, 'CRITERE_METIER_NON_APPLICABLE'),
    criterion(4, 'CRITERE_SANS_REPONSE'),
    criterion(5, 'CRITERE_REPONSE_NA', 'OPTIONNEL'),
    criterion(6, 'CRITERE_VALIDE'),
  ];
  return {
    grid: buildGridSummary({
      chapitres: [
        {
          libelle: 'CHAPITRE_LOGEMENT',
          sous_chapitres: [
            {
              libelle: 'SOUS_CHAPITRE_INTERIEUR',
              rubriques: [{ libelle: 'RUBRIQUE_EQUIPEMENTS', criteres: criteria.slice(0, 3) }],
            },
          ],
        },
        {
          libelle: 'CHAPITRE_SERVICES',
          sous_chapitres: [
            {
              libelle: 'SOUS_CHAPITRE_ACCUEIL',
              rubriques: [{ libelle: 'RUBRIQUE_CONFORT', criteres: criteria.slice(3) }],
            },
          ],
        },
      ],
    }),
    rapport: {
      resultat: true,
      points_totaux_obligatoires: 171,
      points_minimaux_obligatoires: 167,
      points_obligatoires_obtenus: 161,
      points_obligatoires_atteints: false,
      points_obligatoires_a_compenser: 6,
      points_optionnels_disponibles: 71,
      points_optionnels_necessaires: 16,
      points_optionnels_a_atteindre: 33,
      points_optionnels_obtenus: 34,
      points_optionnels_atteints: true,
      criteres_obligatoires_non_valides: [1, 900],
    },
    grille: {
      categorie_demandee: '3*',
      capacite_accueil: 4,
      etage: 0,
      type_habitation: 'INDIVIDUEL',
      reponses: [
        { num_critere: 1, statut_validation: 'NON_VALIDE', points_obtenus: 0 },
        { num_critere: 2, statut_critere: 'ONC', statut_validation: 'VALIDE', points_obtenus: 2 },
        { num_critere: 3, statut_critere: 'NON_APPLICABLE' },
        { num_critere: 5, statut_validation: 'NON_APPLICABLE', points_obtenus: 0 },
        { num_critere: 6, statut_validation: 'VALIDE', points_obtenus: 6 },
      ],
    },
    logement: {
      surface_totale: 43.75,
      nb_pieces_habitation: 2,
      pieces: [
        {
          id: 'room-1',
          nom: 'CHAMBRE_TEST',
          type_piece: 'CHAMBRE',
          surface: 14.5,
          ouvrant: true,
          type_literie: 'DOUBLE_FIXE',
          nombre_lits: 2,
        },
        {
          id: 'room-2',
          nom: 'TERRASSE_TEST',
          type_piece: 'TERRASSE_OU_JARDIN_PRIVE',
          surface: 0,
          ouvrant: false,
          nombre_lits: 0,
        },
      ],
    },
    totalSleepingCapacity: 4,
    generatedAt: new Date('2026-09-19T12:00:00Z'),
    simulationId: 'simulation / # test',
  };
}

async function captureReport(input: SimulationClassementPdfInput) {
  const draws: TextDraw[] = [];
  const captureText = function (
    this: jsPDF,
    payload: {
      text: string | string[];
      x: number;
      y: number;
      options: { lineHeightFactor?: number; align?: string };
    }
  ) {
    const lines = typeof payload.text === 'string' ? [payload.text] : payload.text;
    const size = this.getFontSize() / this.internal.scaleFactor;
    const leading = size * (payload.options.lineHeightFactor ?? this.getLineHeightFactor());
    const width = Math.max(0, ...lines.map((line) => this.getTextWidth(line)));
    const left =
      payload.x -
      (payload.options.align === 'right'
        ? width
        : payload.options.align === 'center'
          ? width / 2
          : 0);
    draws.push({
      text: lines.join(' '),
      page: this.getCurrentPageInfo().pageNumber,
      left,
      right: left + width,
      top: payload.y - size * 0.8,
      bottom: payload.y + (lines.length - 1) * leading + size * 0.2,
    });
  };
  const event: [string, typeof captureText] = ['preProcessText', captureText];
  jsPDF.API.events.push(event);
  try {
    return { doc: await createSimulationClassementPdf(input), draws };
  } finally {
    jsPDF.API.events.splice(jsPDF.API.events.indexOf(event), 1);
  }
}

function rowText(draws: TextDraw[], marker: string): string {
  const label = [...draws].reverse().find((draw) => draw.text.includes(marker));
  if (!label) throw new Error(`Missing row ${marker}`);
  return draws
    .filter((draw) => draw.page === label.page && Math.abs(draw.top - label.top) < 3)
    .sort((a, b) => a.left - b.left)
    .map((draw) => draw.text)
    .join(' ');
}

beforeEach(() => {
  vi.spyOn(simulatorPdfShared, 'getEtoilysLogoPngAsset').mockResolvedValue(null);
});

afterEach(() => vi.restoreAllMocks());

it('preserves backend verdicts, scores and required criteria even on a favorable report, with working CTAs', async () => {
  for (const verdict of [true, false]) {
    const input = fixture();
    input.rapport.resultat = verdict;
    const { doc, draws } = await captureReport(input);
    const rendered = draws.map(({ text }) => text).join(' ');
    const summary = draws
      .filter(({ page }) => page === 1)
      .map(({ text }) => text)
      .join(' ');
    expect(doc.output()).toMatch(/^%PDF-/);
    expect(rendered).not.toMatch(/\b(?:NaN|Infinity|undefined)\b/);
    expect(summary).toMatch(verdict ? /(?:^|\s)favorable(?:\s|$)/i : /défavorable/i);
    for (const action of ['Demander un classement', 'Reprendre ma simulation']) {
      expect(draws.find(({ text }) => text === action)?.page).toBe(1);
    }
    for (const value of ['171', '167', '161', '71', '16', '33', '34']) {
      expect(rendered).toMatch(new RegExp(`\\b${value}\\b`));
    }
    expect(
      draws.filter(({ text }) => text.includes('CRITERE_OBLIGATOIRE_REFUSE')).length
    ).toBeGreaterThanOrEqual(2);
    expect(rendered).toContain('900');
    for (const marker of [
      'CHAPITRE_LOGEMENT',
      'CHAPITRE_SERVICES',
      'CHAMBRE_TEST',
      'TERRASSE_TEST',
    ]) {
      expect(rendered).toContain(marker);
    }
    const urls = Array.from(doc.output().matchAll(/\/URI \(([^)]+)\)/g), (match) => match[1]);
    expect(urls).toEqual(
      expect.arrayContaining([
        'https://www.etoilys.fr/demande-classement',
        `https://www.etoilys.fr/simulateur/${encodeURIComponent(input.simulationId)}`,
        'https://www.etoilys.fr/simulateur',
      ])
    );
  }
});

it('uses effective backend criterion status and distinguishes real zeroes from missing answers and scores', async () => {
  const input = fixture();
  const { draws } = await captureReport(input);
  expect(rowText(draws, 'CRITERE_OVERRIDE_ONC')).toMatch(/ONC|Obligatoire non compensable/i);
  expect(rowText(draws, 'CRITERE_OVERRIDE_ONC')).not.toMatch(/Optionnel/i);
  expect(rowText(draws, 'CRITERE_METIER_NON_APPLICABLE')).toMatch(/Non applicable/i);
  expect(rowText(draws, 'CRITERE_SANS_REPONSE')).toMatch(
    /Non renseign|Sans réponse|À renseigner|[-—]/i
  );
  expect(rowText(draws, 'CRITERE_REPONSE_NA')).toMatch(/Non applicable/i);
  expect(rowText(draws, 'CRITERE_OBLIGATOIRE_REFUSE')).toMatch(/Non validé/i);
  expect(rowText(draws, 'CRITERE_REPONSE_NA')).toMatch(/\b0\b/);
  expect(rowText(draws, 'TERRASSE_TEST')).toMatch(/\b0\b/);

  const zeroes = await captureReport({
    ...input,
    rapport: {
      resultat: false,
      points_obligatoires_obtenus: 0,
      points_minimaux_obligatoires: 0,
      points_obligatoires_atteints: false,
      points_optionnels_obtenus: 0,
      points_optionnels_a_atteindre: 0,
      points_optionnels_atteints: false,
    },
  });
  const zeroSummary = zeroes.draws.filter(({ page }) => page === 1);
  expect(zeroSummary.filter(({ text }) => text === '0').length).toBe(2);
  expect(zeroSummary.map(({ text }) => text).join(' ')).not.toMatch(/Non renseign/i);

  const missing = await captureReport({
    ...input,
    rapport: {},
    grille: undefined,
    logement: null,
    totalSleepingCapacity: 0,
  });
  const missingSummary = missing.draws
    .filter(({ page }) => page === 1)
    .map(({ text }) => text)
    .join(' ');
  expect(missingSummary).toMatch(/Non renseign|[-—]/i);
  expect(missingSummary).not.toMatch(/0\s*\/\s*0/);
  expect(missing.draws.map(({ text }) => text).join(' ')).not.toMatch(
    /\b(?:NaN|Infinity|undefined)\b/
  );
});

it('paginates long room names and every grid chapter without losing content or colliding with page footers', async () => {
  const input = fixture();
  const tokens: string[] = [];
  const name = (prefix: string, number: number) => {
    const start = `${prefix}_${String(number).padStart(3, '0')}`;
    const end = `${start}_END`;
    tokens.push(start, end);
    return `${start} ${'description détaillée '.repeat(12)}${end}`;
  };
  const pieces: PieceDto[] = Array.from({ length: 24 }, (_, index) => ({
    id: `room-${index}`,
    nom: name('ROOM', index),
    type_piece: 'CHAMBRE',
    surface: 12.5,
    ouvrant: index % 2 === 0,
    type_literie: 'DOUBLE_FIXE',
    nombre_lits: 2,
  }));
  const criteria = Array.from({ length: 100 }, (_, index) =>
    criterion(index + 1, name('CRITERION', index))
  );
  input.grid = buildGridSummary({
    chapitres: [0, 1].map((chapter) => ({
      libelle: `CHAPTER_${chapter}`,
      sous_chapitres: [
        {
          libelle: `SUBCHAPTER_${chapter}`,
          rubriques: [
            {
              libelle: `RUBRIC_${chapter}`,
              // 51 rows leave room for a chapter title alone, but not its first subchapter.
              criteres: chapter === 0 ? criteria.slice(0, 51) : criteria.slice(51),
            },
          ],
        },
      ],
    })),
  });
  input.logement = { pieces };
  input.grille = {
    ...input.grille,
    reponses: criteria.map(({ num_critere }) => ({
      num_critere,
      statut_validation: 'VALIDE',
      points_obtenus: num_critere,
    })),
  };
  input.rapport.criteres_obligatoires_non_valides = [];
  const { doc, draws } = await captureReport(input);
  const rendered = draws.map(({ text }) => text).join(' ');
  expect(doc.getNumberOfPages()).toBeGreaterThan(3);
  for (const token of tokens) expect(rendered).toContain(token);
  for (const chapter of ['CHAPTER_0', 'CHAPTER_1']) expect(rendered).toContain(chapter);
  for (const chapter of [0, 1]) {
    const title = draws.find(({ text }) => text === `CHAPTER_${chapter}`);
    const subchapter = draws.find(({ text }) => text === `SUBCHAPTER_${chapter}`);
    expect(title?.page).toBe(subchapter?.page);
  }
  const height = doc.internal.pageSize.getHeight();
  const width = doc.internal.pageSize.getWidth();
  for (const draw of draws.filter(({ text }) => text.trim())) {
    expect(draw.left, draw.text).toBeGreaterThanOrEqual(0);
    expect(draw.right, draw.text).toBeLessThanOrEqual(width + 0.5);
    expect(draw.top, draw.text).toBeGreaterThanOrEqual(0);
    expect(draw.bottom, draw.text).toBeLessThan(height);
  }
  const rows = draws.filter(({ text }) => /ROOM_|CRITERION_/.test(text));
  expect(new Set(rows.map(({ page }) => page)).size).toBeGreaterThan(2);
  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    const pageDraws = draws.filter((draw) => draw.page === page);
    const footer = pageDraws.filter((draw) => draw.top >= height - 48);
    expect(footer.length, `Footer page ${page}`).toBeGreaterThan(0);
    const footerTop = Math.min(...footer.map(({ top }) => top));
    for (const content of pageDraws.filter((draw) => draw.top < height - 48)) {
      expect(content.bottom, `Footer overlap page ${page}: ${content.text}`).toBeLessThan(
        footerTop
      );
    }
    for (const row of rows.filter((draw) => draw.page === page)) {
      expect(row.bottom, `Footer overlap page ${page}: ${row.text}`).toBeLessThan(footerTop);
    }
  }
});
