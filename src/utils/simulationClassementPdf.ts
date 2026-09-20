import { jsPDF } from 'jspdf';
import autoTable, { type UserOptions } from 'jspdf-autotable';
import { getCriterionByNumber, getCriterionStatusForCategory } from '../content/simulatorGrid';
import type { SimulationClassementPdfInput } from './simulationClassementPdf.types';
import {
  canPieceHaveSleepingCapacity,
  formatFloor,
  formatHousingType,
  formatPieceType,
  formatRequestedCategory,
} from './simulatorLabels';
import {
  getAutoTableFinalY,
  getEtoilysLogoPngAsset,
  getSimulatorPdfPalette,
  normalizePdfText,
  type PdfColor,
} from './simulatorPdfShared';

const number = (value: number | null | undefined, unit = '') =>
  typeof value === 'number' && Number.isFinite(value)
    ? `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}${unit}`
    : 'Non renseigné';

export async function createSimulationClassementPdf({
  grid,
  rapport,
  grille,
  logement,
  totalSleepingCapacity,
  generatedAt,
  simulationId,
}: SimulationClassementPdfInput): Promise<jsPDF> {
  const palette = getSimulatorPdfPalette();
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  doc.setProperties({
    title: 'Votre simulation de classement',
    subject: `Compte rendu indicatif - ${formatRequestedCategory(grille?.categorie_demandee)}`,
    author: 'Etoilys',
  });
  doc.setLanguage('fr-FR');
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = width - margin * 2;
  const bottom = height - 64;
  const resumeUrl = `https://www.etoilys.fr/simulateur/${encodeURIComponent(simulationId)}`;
  const classificationUrl = 'https://www.etoilys.fr/demande-classement';
  const logo = await getEtoilysLogoPngAsset('/logo-etoilys-editorial.svg');
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(generatedAt);
  const success = rapport.resultat === true;
  let y = 100;

  const font = (size: number, bold = false, color: PdfColor = palette.ink, serif = false) => {
    doc.setFont(serif ? 'times' : 'helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };
  const lines = (value: string, maxWidth = contentWidth): string[] =>
    doc.splitTextToSize(normalizePdfText(value), maxWidth) as string[];
  const text = (
    value: string,
    x: number,
    top: number,
    maxWidth: number,
    size = 10,
    bold = false,
    color: PdfColor = palette.ink,
    serif = false
  ) => {
    font(size, bold, color, serif);
    const wrapped = lines(value, maxWidth);
    doc.text(wrapped, x, top + size * 0.8, { lineHeightFactor: 1.35 });
    return wrapped.length * size * 1.35;
  };
  const rule = (at: number, x = margin, length = contentWidth) => {
    doc.setDrawColor(...palette.muted);
    doc.setLineWidth(0.35);
    doc.line(x, at, x + length, at);
  };
  const startPage = () => {
    doc.setFillColor(...palette.paper);
    doc.rect(0, 0, width, height, 'F');
    if (logo) {
      doc.addImage(logo.dataUrl, 'PNG', margin - 11, 11, 108, 108 / logo.aspectRatio);
    } else {
      text('Etoilys', margin, 29, 160, 27, true, palette.ink, true);
    }
    font(8, false, palette.muted);
    doc.text(`Édité le ${date}`, width - margin, 40, { align: 'right' });
    rule(78);
    y = 100;
  };
  const nextPage = () => {
    doc.addPage();
    startPage();
  };
  const ensure = (needed: number) => {
    if (y + needed > bottom) nextPage();
  };
  const section = (title: string, size = 18) => {
    font(size, true, palette.ink, true);
    ensure(lines(title).length * size * 1.35 + 65);
    y += text(title, margin, y, contentWidth, size, true, palette.ink, true) + 12;
  };
  const paragraph = (value: string) => {
    font(9.5, false, palette.muted);
    for (const line of lines(value)) {
      ensure(13);
      text(line, margin, y, contentWidth, 9.5, false, palette.muted);
      y += 13;
    }
    y += 8;
  };
  const table = (head: string[], body: string[][], ratios: number[], extra: UserOptions = {}) => {
    ensure(65);
    autoTable(doc, {
      startY: y,
      margin: { top: 100, right: margin, bottom: height - bottom, left: margin },
      head: [head.map(normalizePdfText)],
      body: body.map((row) => row.map(normalizePdfText)),
      theme: 'plain',
      rowPageBreak: 'avoid',
      showHead: 'everyPage',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 7,
        textColor: palette.ink,
        overflow: 'linebreak',
        lineColor: palette.paper,
        lineWidth: { bottom: 2 },
        valign: 'top',
      },
      headStyles: {
        fillColor: palette.ink,
        textColor: palette.paper,
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: { fillColor: palette.surface },
      alternateRowStyles: { fillColor: palette.sage },
      columnStyles: Object.fromEntries(
        ratios.map((ratio, index) => [index, { cellWidth: contentWidth * ratio }])
      ),
      willDrawPage: ({ pageNumber }) => {
        if (pageNumber > 1) startPage();
      },
      ...extra,
    });
    y = (getAutoTableFinalY(doc) ?? y) + 22;
  };

  startPage();
  y += text('COMPTE RENDU DE SIMULATION', margin, y, contentWidth, 8.5, true, palette.copper) + 8;
  y +=
    text('Votre simulation de classement', margin, y, contentWidth, 29, true, palette.ink, true) +
    4;
  y +=
    text(
      'Meublé de tourisme - votre résultat et les points à préparer.',
      margin,
      y,
      contentWidth,
      10,
      false,
      palette.muted
    ) + 18;

  doc.setFillColor(...(success ? palette.sage : palette.warm));
  doc.roundedRect(margin, y, contentWidth, 108, 4, 4, 'F');
  text(
    `OBJECTIF : ${formatRequestedCategory(grille?.categorie_demandee).toLocaleUpperCase('fr-FR')}`,
    margin + 20,
    y + 16,
    contentWidth - 40,
    8.5,
    true
  );
  text(
    success ? 'Estimation favorable' : 'Estimation défavorable',
    margin + 20,
    y + 36,
    contentWidth - 40,
    27,
    true,
    palette.ink,
    true
  );
  text(
    success
      ? 'Vos réponses atteignent les conditions évaluées pour le classement demandé.'
      : 'Vos réponses ne permettent pas encore d’atteindre le classement demandé.',
    margin + 20,
    y + 77,
    contentWidth - 40,
    9.5,
    false,
    palette.muted
  );
  y += 124;

  const scores = [
    {
      title: 'Points obligatoires',
      obtained: rapport.points_obligatoires_obtenus,
      target: rapport.points_minimaux_obligatoires,
      reached: rapport.points_obligatoires_atteints,
    },
    {
      title: 'Points optionnels',
      obtained: rapport.points_optionnels_obtenus,
      target: rapport.points_optionnels_a_atteindre,
      reached: rapport.points_optionnels_atteints,
    },
  ];
  const scoreWidth = (contentWidth - 16) / 2;
  scores.forEach((score, index) => {
    const x = margin + index * (scoreWidth + 16);
    doc.setFillColor(...palette.surface);
    doc.roundedRect(x, y, scoreWidth, 104, 4, 4, 'F');
    text(score.title, x + 16, y + 14, scoreWidth - 32, 9, true);
    text(number(score.obtained), x + 16, y + 35, scoreWidth - 32, 27, true);
    text(
      `Objectif : ${number(score.target)} points`,
      x + 16,
      y + 69,
      scoreWidth - 32,
      9,
      false,
      palette.muted
    );
    text(
      score.reached === true
        ? 'Seuil atteint'
        : score.reached === false
          ? 'Seuil non atteint'
          : 'Seuil non renseigné',
      x + 16,
      y + 86,
      scoreWidth - 32,
      8,
      true,
      score.reached === false ? palette.copper : palette.muted
    );
  });
  y += 122;

  const parameters: Array<[string, string]> = [
    ['Type de logement', formatHousingType(grille?.type_habitation)],
    ['Étage', formatFloor(grille?.etage)],
    ['Capacité d’accueil', number(grille?.capacite_accueil, ' pers.')],
    ['Couchages', number(totalSleepingCapacity)],
    ['Surface renseignée', number(logement?.surface_totale, ' m²')],
    ['Pièces d’habitation', number(logement?.nb_pieces_habitation)],
  ];
  for (let index = 0; index < parameters.length; index += 3) {
    const row = parameters.slice(index, index + 3);
    const cellWidth = (contentWidth - 32) / 3;
    font(10, true);
    const rowHeight =
      Math.max(...row.map(([, value]) => lines(value, cellWidth).length * 13.5)) + 23;
    ensure(rowHeight);
    row.forEach(([label, value], column) => {
      const x = margin + column * (cellWidth + 16);
      text(label, x, y, cellWidth, 8.5, false, palette.muted);
      text(value, x, y + 15, cellWidth, 10, true);
    });
    y += rowHeight;
  }
  y += 8;

  // Keep both links together on the summary, independent of the appendix length.
  ensure(158);
  doc.setFillColor(...palette.ink);
  doc.roundedRect(margin, y, contentWidth, 128, 4, 4, 'F');
  text('Et maintenant ?', margin + 20, y + 16, contentWidth - 40, 22, true, palette.paper, true);
  text(
    'Préparez la suite avec Etoilys ou retrouvez vos réponses en ligne.',
    margin + 20,
    y + 49,
    contentWidth - 40,
    9.5,
    false,
    palette.paper
  );
  const buttonWidth = (contentWidth - 50) / 2;
  [
    { label: 'Demander un classement', href: classificationUrl, primary: true },
    { label: 'Reprendre ma simulation', href: resumeUrl, primary: false },
  ].forEach((button, index) => {
    const x = margin + 20 + index * (buttonWidth + 10);
    doc.setFillColor(...palette.paper);
    doc.setDrawColor(...palette.paper);
    doc.setLineWidth(0.6);
    doc.roundedRect(x, y + 82, buttonWidth, 30, 2, 2, button.primary ? 'F' : 'S');
    font(9.5, true, button.primary ? palette.ink : palette.paper);
    doc.text(button.label, x + buttonWidth / 2, y + 101, { align: 'center' });
    doc.link(x, y + 82, buttonWidth, 30, { url: button.href });
  });
  y += 137;
  text(
    'Pour retrouver cette simulation, utilisez le navigateur dans lequel elle a été créée.',
    margin,
    y,
    contentWidth,
    8,
    false,
    palette.muted
  );

  nextPage();
  section('Comprendre votre résultat', 27);
  paragraph(
    'Ce compte rendu reprend les informations de votre simulation à la date d’édition. Il reste indicatif : seule une visite officielle permet de confirmer le classement.'
  );
  table(
    ['Indicateur', 'Points'],
    [
      ['Points obligatoires obtenus', number(rapport.points_obligatoires_obtenus)],
      ['Minimum obligatoire à atteindre', number(rapport.points_minimaux_obligatoires)],
      ['Total des points obligatoires', number(rapport.points_totaux_obligatoires)],
      ['Points obligatoires à compenser', number(rapport.points_obligatoires_a_compenser)],
      ['Points optionnels obtenus', number(rapport.points_optionnels_obtenus)],
      [
        'Points optionnels nécessaires hors compensation',
        number(rapport.points_optionnels_necessaires),
      ],
      [
        'Objectif optionnel à atteindre, compensation comprise',
        number(rapport.points_optionnels_a_atteindre),
      ],
      ['Points optionnels disponibles', number(rapport.points_optionnels_disponibles)],
    ],
    [0.78, 0.22]
  );

  const invalid = rapport.criteres_obligatoires_non_valides ?? [];
  section('Les points à revoir');
  paragraph(
    success
      ? 'Le résultat global est favorable. Les éventuels critères ci-dessous restent à examiner pour préparer votre visite.'
      : 'Reprenez les critères ci-dessous et les scores de synthèse pour identifier les améliorations à apporter.'
  );
  if (invalid.length) {
    table(
      ['N°', 'Critère obligatoire non validé', 'Points'],
      invalid.map((criterionNumber) => {
        const criterion = getCriterionByNumber(grid, criterionNumber);
        return [
          String(criterionNumber),
          criterion?.libelle ?? 'Intitulé non disponible dans la grille',
          number(criterion?.points),
        ];
      }),
      [0.09, 0.77, 0.14]
    );
  } else {
    paragraph(
      'Le rapport ne signale aucun critère obligatoire non validé. Les seuils de points obligatoires et optionnels restent à lire ensemble.'
    );
  }

  ensure(300);
  section('Votre logement en détail', 27);
  paragraph(
    'Pièces et espaces renseignés dans la simulation. Les couchages correspondent à la capacité déclarée dans chaque pièce.'
  );
  if (logement?.pieces?.length) {
    table(
      ['Pièce / espace', 'Surface', 'Couchages', 'Ouvrant'],
      logement.pieces.map((piece) => [
        [piece.nom, formatPieceType(piece.type_piece)].filter(Boolean).join('\n'),
        number(piece.surface, ' m²'),
        canPieceHaveSleepingCapacity(piece.type_piece) ? number(piece.nombre_lits) : '-',
        piece.ouvrant === true ? 'Oui' : piece.ouvrant === false ? 'Non' : '-',
      ]),
      [0.52, 0.17, 0.17, 0.14]
    );
  } else {
    paragraph('Le détail des pièces n’est pas disponible dans ce compte rendu.');
  }

  nextPage();
  section('Le relevé de vos réponses', 27);
  paragraph(
    'Les points indiqués sont ceux associés aux critères du modèle. Les scores de synthèse proviennent du rapport calculé ; ils tiennent compte des règles d’applicabilité et de compensation.'
  );
  paragraph(
    'ONC : obligatoire non compensable. « Non applicable » peut provenir des règles de la grille ou de votre réponse. Une réponse absente reste indiquée comme non renseignée.'
  );
  const responses = new Map(
    (grille?.reponses ?? []).map((response) => [response.num_critere, response])
  );
  const statusLabels = {
    OBLIGATOIRE: 'Obligatoire',
    ONC: 'ONC',
    OPTIONNEL: 'Optionnel',
    NON_APPLICABLE: 'Non applicable',
  };
  const answerLabels = {
    VALIDE: 'Validé',
    NON_VALIDE: 'Non validé',
    NON_APPLICABLE: 'Non applicable',
  };
  for (const chapter of grid.chapitres) {
    const firstSubchapter = chapter.sous_chapitres.find((item) =>
      item.rubriques.some((rubrique) => rubrique.criteres.length > 0)
    );
    if (!firstSubchapter) continue;
    font(18, true, palette.ink, true);
    const headingHeight = lines(chapter.libelle).length * 18 * 1.35 + 12;
    font(11, true);
    ensure(headingHeight + lines(firstSubchapter.libelle).length * 15 + 75);
    section(chapter.libelle);
    for (const subchapter of chapter.sous_chapitres) {
      const criteria = subchapter.rubriques.flatMap((rubrique) => rubrique.criteres);
      if (!criteria.length) continue;
      font(11, true);
      ensure(lines(subchapter.libelle).length * 15 + 75);
      y += text(subchapter.libelle, margin, y, contentWidth, 11, true) + 10;
      table(
        ['N°', 'Critère', 'Statut', 'Points', 'Réponse'],
        criteria.map((criterion) => {
          const response = responses.get(criterion.num_critere);
          const status =
            response?.statut_critere ??
            getCriterionStatusForCategory(criterion, grille?.categorie_demandee);
          const answer =
            status === 'NON_APPLICABLE'
              ? 'Non applicable'
              : response?.statut_validation
                ? answerLabels[response.statut_validation]
                : 'Non renseigné';
          return [
            String(criterion.num_critere),
            criterion.libelle,
            status ? statusLabels[status] : 'Non renseigné',
            number(criterion.points),
            answer,
          ];
        }),
        [0.065, 0.515, 0.15, 0.08, 0.19],
        {
          didParseCell: ({ section: tableSection, column, cell }) => {
            if (tableSection === 'body' && column.index === 4 && cell.raw === 'Non validé') {
              cell.styles.textColor = palette.copper;
              cell.styles.fontStyle = 'bold';
            }
          },
        }
      );
    }
  }
  if (!grid.criteriaCount)
    paragraph('Le détail des critères n’est pas disponible dans ce compte rendu.');

  const count = doc.getNumberOfPages();
  for (let page = 1; page <= count; page += 1) {
    doc.setPage(page);
    rule(height - 48);
    text(
      'Estimation indicative. Seule une visite officielle confirme le classement.',
      margin,
      height - 37,
      contentWidth - 60,
      7.5,
      false,
      palette.muted
    );
    text(
      'www.etoilys.fr/simulateur',
      margin,
      height - 23,
      contentWidth - 60,
      7.5,
      false,
      palette.muted
    );
    doc.link(margin, height - 25, 140, 12, { url: 'https://www.etoilys.fr/simulateur' });
    font(8, false, palette.muted);
    doc.text(`${page} / ${count}`, width - margin, height - 26, { align: 'right' });
  }
  return doc;
}
