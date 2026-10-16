import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import KeyTakeaways from '../../components/ui/KeyTakeaways';
import ArticleSources from '../../components/ui/ArticleSources';
import ResponsiveComparisonTable from '../../components/ui/ResponsiveComparisonTable';
import ArticleLayout, { type ArticleLayoutArticle } from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getArticleAuthor } from '../../content/articleAuthors';
import { getArticleStructuredData } from '../../content/articleStructuredData';

const ARTICLE_PATH =
  '/nl/artikelen/vakantiewoning-voorbereiden-inspectiebezoek-sterrenclassificatie';
const REFERENTIEL_URL =
  'https://www.atout-france.fr/sites/default/files/2025-12/R%C3%A9f%C3%A9rentiel%20de%20classement%20des%20meubl%C3%A9s%20de%20tourisme%202022%20V2.pdf';
const GUIDE_CONTROLE_URL =
  'https://www.atout-france.fr/sites/default/files/2026-01/Guide%20de%20contr%C3%B4le%20-%20Meubl%C3%A9%20de%20tourisme.pdf';

const dishes = [
  '2 waterglazen;',
  '1 wijnglas;',
  '2 platte borden;',
  '2 diepe borden;',
  '2 dessertborden;',
  '2 eetlepels;',
  '2 theelepels;',
  '2 messen;',
  '2 vorken;',
  '2 kommen;',
  '2 kopjes of mokken.',
];

const checklist = [
  'Past de aangevraagde sterrencategorie bij de voorzieningen van uw woning?',
  'Komt het opgegeven maximumaantal gasten overeen met de daadwerkelijk aanwezige slaapplaatsen?',
  'Voldoet het aantal zitplaatsen aan de eettafel en in de woonkamer aan de eisen voor die capaciteit?',
  'Is er voldoende servies volgens criterium 63?',
  'Bestaat het servies uit bij elkaar passende sets?',
  'Zijn alle onderdelen van criterium 65 aanwezig?',
  'Zijn alle voorzieningen toegankelijk en werken ze?',
  'Zijn er minstens vijf toeristische informatiebronnen beschikbaar, waarvan drie in een vreemde taal of tweetalig?',
  'Staat schriftelijk vermeld welke diensten u aan gasten aanbiedt?',
  'Is duidelijk aangegeven of de woning wel of niet toegankelijk is?',
  'Is er een eenvoudige boodschap die gasten bewustmaakt van het belang van milieuvriendelijk gedrag?',
  'Is de woning schoon, goed onderhouden en ingericht zoals u haar aan gasten aanbiedt?',
];

const officialSources = [
  {
    id: 'atout-france-meuble-de-tourisme-1',
    organization: 'Atout France',
    title: 'Vakantiewoningen (meublés de tourisme)',
    url: 'https://www.atout-france.fr/fr/classement/meuble-de-tourisme',
  },
  {
    id: 'atout-france-referentiel-de-classement-des-meubles-de-tourisme-2022-2',
    organization: 'Atout France',
    title: 'Classificatiecriteria voor vakantiewoningen (2022)',
    url: REFERENTIEL_URL,
  },
  {
    id: 'atout-france-guide-de-controle-du-classement-des-meubles-de-tourisme-3',
    organization: 'Atout France',
    title: 'Inspectiegids voor de classificatie van vakantiewoningen',
    url: GUIDE_CONTROLE_URL,
  },
  {
    id: 'atout-france-faq-meuble-de-tourisme-4',
    organization: 'Atout France',
    title: 'Veelgestelde vragen over de classificatie van vakantiewoningen',
    url: 'https://www.atout-france.fr/fr/classement/faq-meuble-de-tourisme',
  },
];

function ArticleBulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2 mb-6 text-muted" data-testid="criterion-63-tableware">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-bold text-copper" aria-hidden="true">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CriterionStatus({ status }: { status: 'optional' | 'required' }) {
  const label = status === 'optional' ? 'Optioneel' : 'Verplicht';
  const classes =
    status === 'optional'
      ? 'border-ink/15 bg-paper text-ink'
      : 'border-alert-200 bg-alert-100 text-alert-500';

  return (
    <span
      className={`inline-flex justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'criteria-voor-de-aangevraagde-sterrencategorie',
    label: 'Welke criteria gelden voor de aangevraagde sterrencategorie?',
  },
  {
    id: 'uitrusting-en-capaciteit',
    label: 'Stem de uitrusting af op het aantal gasten',
  },
  {
    id: 'informatie-en-documenten-voor-gasten',
    label: 'Bereid de informatie en documenten voor uw gasten voor',
  },
  {
    id: 'woning-presenteren-zoals-verhuurd',
    label: 'Laat de woning zien zoals u die verhuurt',
  },
  {
    id: 'checklist-voor-het-inspectiebezoek',
    label: 'Checklist vóór het inspectiebezoek',
  },
  {
    id: 'aanvullend-bewijs-na-de-inspectie',
    label: 'Kunt u na de inspectie nog aanvullend bewijs indienen?',
  },
];

const structuredArticle = getArticleStructuredData(ARTICLE_PATH);

if (structuredArticle === null) {
  throw new Error(`Missing canonical article metadata for ${ARTICLE_PATH}`);
}

const author = getArticleAuthor(structuredArticle.authorId);
const article = {
  slug: 'vakantiewoning-voorbereiden-inspectiebezoek-sterrenclassificatie',
  title: structuredArticle.headline,
  excerpt:
    'Hoe werkt de controlelijst van 133 criteria en welke uitrusting, hoeveelheden en informatie controleert u vóór de inspectie?',
  relatedSummary:
    'Servies, uitrusting, documenten en aandachtspunten om uw woning goed voor te bereiden op het inspectiebezoek.',
  href: ARTICLE_PATH,
  category: 'guides-pratiques',
  readingTimeMinutes: 10,
  authorId: structuredArticle.authorId,
  authorName: author.name,
  publishedAt: structuredArticle.datePublished,
} satisfies ArticleLayoutArticle;

const keyTakeawaysBlock = (
  <KeyTakeaways
    locale="nl"
    variant="bullets"
    items={[
      {
        id: 'vakantiewoning-voorbereiden-inspectiebezoek-sterrenclassificatie-takeaway-1',
        content:
          'De aangevraagde sterrencategorie en de capaciteit van uw woning bepalen welke uitrusting u nodig hebt en in welke hoeveelheden.',
      },
      {
        id: 'vakantiewoning-voorbereiden-inspectiebezoek-sterrenclassificatie-takeaway-2',
        content:
          'Sommige criteria omvatten meerdere onderdelen: één ontbrekend onderdeel kan voldoende zijn om het hele criterium af te keuren.',
      },
      {
        id: 'vakantiewoning-voorbereiden-inspectiebezoek-sterrenclassificatie-takeaway-3',
        content:
          'Informatie en diensten moeten controleerbaar zijn aan de hand van schriftelijke of digitale informatie. Aan alle criteria voor netheid en goede staat moet bovendien worden voldaan.',
      },
    ]}
  />
);

const articleSources = (
  <ArticleSources
    locale="nl"
    sources={officialSources}
    description={<p>De onderstaande officiële documenten zijn in het Frans.</p>}
  />
);

export default function ArticlePreparerVisiteClassementMeubleTourismeNl() {
  return (
    <ArticleLayout
      article={article}
      locale="nl"
      tableOfContents={tableOfContents}
      lede={
        <>
          <p className="text-xl leading-comfortable text-muted mb-6">
            Tijdens het inspectiebezoek beoordeelt de inspecteur uw vakantiewoning aan de hand van
            de{' '}
            <strong>
              133 criteria uit het{' '}
              <a
                href={REFERENTIEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="article-inline-link"
              >
                officiële Franse referentiekader
              </a>
            </strong>
            . Sommige criteria zijn verplicht, andere zijn optioneel. Welke criteria gelden, hangt
            af van de sterrencategorie die u aanvraagt. Om de gewenste classificatie te verkrijgen,
            moet uw woning minstens <strong>95% van de punten voor verplichte criteria</strong>{' '}
            behalen, naast het vereiste aantal punten voor optionele criteria. De criteria voor
            netheid en goede staat kunnen niet met andere punten worden gecompenseerd: daaraan moet
            allemaal worden voldaan.
          </p>
          <p className="text-xl leading-comfortable text-muted mb-8">
            Sommige criteria gaan over verrassend kleine details: de juiste hoeveelheid servies,
            schriftelijke informatie in uw advertentie of een ontbrekend onderdeel van de
            uitrusting. Toch kunnen juist die details het verschil maken tijdens de controle. In dit
            artikel leest u welke punten vaak over het hoofd worden gezien of problemen kunnen
            opleveren, zodat u op de dag van de inspectie niet voor verrassingen komt te staan.
          </p>

          <div className="article-callout p-5 mb-12 text-base">
            <p className="text-base leading-comfortable text-muted">
              De onderstaande voorbeelden laten zien hoe de algemene regels van het referentiekader
              werken. Alleen een inspectie ter plaatse kan bevestigen welke sterrenclassificatie uw
              woning krijgt.
            </p>
          </div>
        </>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <div className="article-cta-panel mb-12 mt-12 p-8">
          <h2 className="text-h4 mb-3">Laatste controle vóór uw afspraak</h2>
          <p className="text-muted leading-comfortable mb-4">
            U hoeft de 133 criteria niet uit uw hoofd te kennen. Het belangrijkste is dat u weet
            welke eisen gelden voor de aangevraagde sterrencategorie en de capaciteit van uw woning,
            en controleert of alles wat de inspecteur moet kunnen zien of controleren op de dag van
            de inspectie beschikbaar is.
          </p>
          <p className="text-muted leading-comfortable mb-6">
            Met de simulator van Etoilys kunt u de criteria nalopen en eventuele laatste
            aandachtspunten ontdekken voordat het inspectiebezoek plaatsvindt.
          </p>
          <Button href="/simulateur" variant="primary">
            Controleer uw woning met de simulator (in het Frans)
          </Button>
        </div>
      }
      sources={articleSources}
      author={author}
    >
      <ArticleSectionHeading id="criteria-voor-de-aangevraagde-sterrencategorie">
        Welke criteria gelden voor de aangevraagde sterrencategorie?
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Voordat het inspectiebezoek begint, geeft u aan voor welke sterrencategorie u uw woning wilt
        laten beoordelen. De inspecteur controleert de woning vervolgens aan de hand van de criteria
        die voor deze categorie gelden.
      </p>
      <p className="text-muted leading-comfortable mb-6">
        Een voorziening kan in de ene sterrencategorie optioneel zijn en in een hogere categorie
        verplicht worden. De volgende voorbeelden maken dat duidelijk:
      </p>

      <ResponsiveComparisonTable
        appearance="editorial"
        className="mb-6"
        primaryColumnKey="criterion"
        columns={[
          {
            key: 'criterion',
            label: 'Voorbeeldcriterium',
            mobileLabel: 'Voorbeeldcriterium',
            widthClassName: 'w-[28%]',
          },
          {
            key: 'one',
            label: '1 ster',
            mobileLabel: '1 ster',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'two',
            label: '2 sterren',
            mobileLabel: '2 sterren',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'three',
            label: '3 sterren',
            mobileLabel: '3 sterren',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'four',
            label: '4 sterren',
            mobileLabel: '4 sterren',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'five',
            label: '5 sterren',
            mobileLabel: '5 sterren',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
        ]}
        rows={[
          {
            key: 'kettle',
            cells: {
              criterion: 'Waterkoker',
              one: <CriterionStatus status="optional" />,
              two: <CriterionStatus status="required" />,
              three: <CriterionStatus status="required" />,
              four: <CriterionStatus status="required" />,
              five: <CriterionStatus status="required" />,
            },
          },
          {
            key: 'bathroom-toiletries',
            cells: {
              criterion: 'Toiletartikelen in de badkamer',
              one: <CriterionStatus status="optional" />,
              two: <CriterionStatus status="optional" />,
              three: <CriterionStatus status="required" />,
              four: <CriterionStatus status="required" />,
              five: <CriterionStatus status="required" />,
            },
          },
          {
            key: 'espresso-machine',
            cells: {
              criterion: 'Espressomachine',
              one: <CriterionStatus status="optional" />,
              two: <CriterionStatus status="optional" />,
              three: <CriterionStatus status="optional" />,
              four: <CriterionStatus status="required" />,
              five: <CriterionStatus status="required" />,
            },
          },
        ]}
        caption="Voorbeelden van criteria per aangevraagde sterrencategorie"
        desktopWrapperClassName="hidden lg:block"
        headerCellClassName="p-2.5 font-semibold break-words"
        cellClassName="border-b border-ink/15 p-2.5 align-middle break-words text-muted"
        mobileContainerClassName="space-y-3 lg:hidden"
      />

      <p className="text-muted leading-comfortable mb-4">
        Om de aangevraagde sterrencategorie te behalen, moet de woning minstens 95% van de punten
        voor verplichte criteria en het voor die categorie vereiste aantal punten voor optionele
        criteria behalen. Het niet voldoen aan één verplicht criterium betekent dus niet automatisch
        dat de classificatie onmogelijk is.
      </p>

      <div className="article-callout mb-12 mt-8 p-6">
        <h3 className="mb-3 text-h4">Twijfelt u over het aantal sterren dat u wilt aanvragen?</h3>
        <p className="text-muted leading-comfortable mb-5">
          De simulator van Etoilys past de 133 criteria aan de capaciteit van uw woning aan en helpt
          u om vóór de inspectie een eerste zelfbeoordeling te maken.
        </p>
        <Button href="/simulateur" variant="secondary" size="sm">
          Probeer de simulator (in het Frans)
        </Button>
      </div>

      <ArticleSectionHeading id="uitrusting-en-capaciteit">
        Stem de uitrusting af op het aantal gasten
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Het opgegeven maximumaantal gasten bepaalt niet alleen hoeveel slaapplaatsen er nodig zijn.
        Ook de hoeveelheid servies, het aantal zitplaatsen aan de eettafel en verschillende andere
        eisen uit het referentiekader hangen hiervan af.
      </p>

      <h3 className="mt-8 mb-3">Criterium 63: controleer de hoeveelheden servies</h3>
      <p className="text-muted leading-comfortable mb-4">
        Criterium 63 gaat over de{' '}
        <strong>minimale hoeveelheid bij elkaar passend tafelservies per persoon</strong>.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Voor elke gast moet minimaal het volgende aanwezig zijn:
      </p>
      <ArticleBulletList items={dishes} />
      <p className="text-muted leading-comfortable mb-4">
        Voor een woning met een <strong>capaciteit van 6 personen</strong> zijn dus onder meer 12
        waterglazen, 6 wijnglazen, 12 platte borden, 12 kommen en 12 kopjes of mokken nodig. Van elk
        bestekonderdeel waarvan er twee per persoon vereist zijn, hebt u 12 stuks nodig.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Niet al het servies hoeft er precies hetzelfde uit te zien. Voor de 12 kommen in een woning
        voor 6 personen mag u bijvoorbeeld{' '}
        <strong>6 identieke witte kommen en 6 identieke blauwe kommen</strong> hebben. Zo hebt u
        twee bij elkaar passende sets, met in elke set één kom per persoon. Twaalf allemaal
        verschillende kommen vormen daarentegen geen bij elkaar passend servies.
      </p>

      <h3 className="mt-8 mb-3">Criterium 65: controleer de volledige lijst</h3>
      <p className="text-muted leading-comfortable mb-4">
        Om aan dit criterium te voldoen, moet de woning over alle onderstaande onderdelen
        beschikken:
      </p>
      <div className="article-callout p-5 mb-6">
        <ul className="space-y-3 text-muted" data-testid="criterion-65-equipment-groups">
          <li>
            <strong>Om te koken:</strong> 1 ovenschaal, 2 steelpannen, 1 koekenpan, 1 grote kookpan
            en 1 deksel;
          </li>
          <li>
            <strong>Voor de bereiding:</strong> 1 slakom, 1 snijplank, 1 broodmes, 1 vergiet, 1
            slacentrifuge, 1 taart- en/of cakevorm, 1 dunschiller en 1 maatbeker;
          </li>
          <li>
            <strong>Klein keukengerei:</strong> 1 kurkentrekker, 1 flesopener, 1 schaar, 1
            blikopener, 1 pannenonderzetter, 1 soeplepel, 1 schuimspaan, 1 spatel en 1 garde.
          </li>
        </ul>
      </div>
      <p className="text-muted leading-comfortable mb-4">
        Al deze onderdelen vallen onder hetzelfde criterium.{' '}
        <strong>Ontbreekt er ook maar één, dan kan criterium 65 niet worden goedgekeurd.</strong>
      </p>

      <h3 className="mt-8 mb-3">Ook het aantal zitplaatsen moet bij de capaciteit passen</h3>
      <p className="text-muted leading-comfortable mb-4">
        Aan de eettafel moeten voldoende zitplaatsen zijn voor het totale aantal gasten. Ook in de
        zithoek moet het aantal zitplaatsen op de bank en in de fauteuils aansluiten bij de
        capaciteit. Voor de zithoek geldt echter een <strong>maximum van 7 personen</strong> bij de
        beoordeling. Een woning voor 10 personen hoeft dus geen 10 zitplaatsen in de woonkamer te
        hebben om aan dit criterium te voldoen.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Kan uw woning 6 gasten ontvangen, maar zijn er slechts 5 zitplaatsen in de woonkamer? Dan
        voldoet de woning niet aan dit criterium. Dat blokkeert de classificatie echter niet
        automatisch: de uitkomst hangt af van het totale resultaat van de beoordeling.
      </p>

      <ArticleSectionHeading id="informatie-en-documenten-voor-gasten">
        Bereid de informatie en documenten voor uw gasten voor
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Niet alle criteria gaan alleen over de aanwezigheid van uitrusting. Er wordt ook gekeken
        naar de informatie en diensten die daadwerkelijk aan gasten worden aangeboden.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Wanneer een criterium betrekking heeft op informatie of een dienst, moet de inspecteur dit
        kunnen controleren aan de hand van schriftelijke of digitale informatie: uw advertentie,
        welkomstmap, website, e-mail, brochure of een mededeling in de woning. Alleen tijdens het
        inspectiebezoek mondeling aangeven dat iets beschikbaar is, is niet voldoende om het
        criterium te halen.
      </p>

      <h3 className="mt-8 mb-3">Criterium 100: zorg voor vijf toeristische informatiebronnen</h3>
      <p className="text-muted leading-comfortable mb-4">
        Criterium 100 vereist lokale en toeristische informatie in het Frans en in ten minste één
        vreemde taal.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Om aan dit criterium te voldoen, hebt u nodig:
      </p>
      <ul className="space-y-2 mb-6 text-muted">
        <li className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-bold text-copper" aria-hidden="true">
            •
          </span>
          <span>
            minstens <strong>5 folders, brochures of andere informatiebronnen</strong> in totaal;
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-bold text-copper" aria-hidden="true">
            •
          </span>
          <span>
            daarvan minstens <strong>3 die beschikbaar zijn in één of meer vreemde talen</strong>.
          </span>
        </li>
      </ul>
      <p className="text-muted leading-comfortable mb-4">
        Een tweetalige brochure telt zowel voor het Frans als voor de andere taal mee. U mag de
        informatie op papier of digitaal aanbieden, bijvoorbeeld via QR-codes, een tablet,
        downloadlinks, een website of een digitale gids.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        De informatie kan bijvoorbeeld gaan over bezienswaardigheden en monumenten,
        recreatiemogelijkheden, excursies, evenementen, het toeristenbureau, winkels, openbare
        diensten of zorgverleners in de buurt.
      </p>

      <h3 className="mt-8 mb-3">
        Criteria 105, 106, 108 en 110: zorg dat uw diensten schriftelijk aantoonbaar zijn
      </h3>
      <p className="text-muted leading-comfortable mb-4">
        De volgende criteria hebben betrekking op diensten die aan gasten worden aangeboden:
      </p>
      <ResponsiveComparisonTable
        appearance="editorial"
        className="mb-6"
        primaryColumnKey="criterion"
        columns={[
          {
            key: 'criterion',
            label: 'Criterium',
            mobileLabel: 'Criterium',
            align: 'center',
            widthClassName: 'w-1/4',
          },
          {
            key: 'service',
            label: 'Dienst die vermeld moet worden',
            mobileLabel: 'Dienst die vermeld moet worden',
            widthClassName: 'w-3/4',
          },
        ]}
        rows={[
          {
            key: '105',
            cells: {
              criterion: '105',
              service: 'Beddengoed wordt standaard door de verhuurder aangeboden',
            },
          },
          {
            key: '106',
            cells: {
              criterion: '106',
              service: 'Handdoeken worden standaard door de verhuurder aangeboden',
            },
          },
          {
            key: '108',
            cells: {
              criterion: '108',
              service: 'De verhuurder biedt standaard opgemaakte bedden bij aankomst aan',
            },
          },
          {
            key: '110',
            cells: {
              criterion: '110',
              service: 'Een schoonmaakservice wordt standaard aangeboden',
            },
          },
        ]}
        caption="Diensten voor gasten die schriftelijk controleerbaar moeten zijn"
      />
      <p className="text-muted leading-comfortable mb-4">
        Deze diensten mogen gratis of tegen betaling worden aangeboden. Belangrijk is dat ze
        standaard worden aangeboden en dat dit schriftelijk te controleren is: in uw advertentie,
        welkomstmap, website, standaardmail, brochure of een mededeling in de woning.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Verwar bovendien twee verschillende diensten niet: <strong>beddengoed aanbieden</strong> en{' '}
        <strong>aanbieden om de bedden voor aankomst op te maken</strong> zijn afzonderlijke
        criteria.
      </p>

      <h3 className="mt-8 mb-3">Criterium 116: vermeld of de woning toegankelijk is</h3>
      <p className="text-muted leading-comfortable mb-4">
        Criterium 116 gaat over{' '}
        <strong>informatie over de toegankelijkheid in de informatiemiddelen voor gasten</strong>.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Uw woning hoeft niet toegankelijk te zijn voor mensen met een beperkte mobiliteit om aan dit
        criterium te voldoen. Gasten moeten wel duidelijk worden geïnformeerd over de
        toegankelijkheid van de woning. Is de woning niet aangepast, vermeld dat dan in uw
        advertentie, op uw website, in de welkomstmap of op een andere plek waar gasten informatie
        vinden.
      </p>
      <p className="text-muted leading-comfortable mb-4">Een eenvoudige zin kan volstaan:</p>
      <blockquote className="article-quote mb-6 p-5">
        Deze vakantiewoning is niet aangepast voor mensen met een beperkte mobiliteit.
      </blockquote>

      <h3 className="mt-8 mb-3">Criterium 130: maak gasten bewust van milieuvriendelijk gedrag</h3>
      <p className="text-muted leading-comfortable mb-4">
        Dit criterium gaat over{' '}
        <strong>
          het informeren van gasten over wat zij tijdens hun verblijf kunnen doen om het milieu te
          ontzien
        </strong>
        .
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Deze informatie kan in de welkomstmap staan, in uw advertentie, op uw website of op een
        kaartje in de woning. U hoeft geen milieureglement van drie pagina's te schrijven. Een
        korte, praktische boodschap kan volstaan, bijvoorbeeld:
      </p>
      <blockquote className="article-quote mb-6 p-5">
        Schakel de verlichting en airconditioning uit wanneer u de woning verlaat en probeer tijdens
        uw verblijf zuinig om te gaan met water.
      </blockquote>
      <p className="text-muted leading-comfortable mb-4">
        U kunt ook aandacht besteden aan afvalscheiding, openbaar vervoer, fietsverhuur,
        wandelroutes, lokale producten of andere manieren om de milieubelasting van het verblijf te
        beperken.
      </p>

      <ArticleSectionHeading id="woning-presenteren-zoals-verhuurd">
        Laat de woning zien zoals u die verhuurt
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        De inspectie gaat over de woning zoals die daadwerkelijk aan gasten wordt aangeboden. Alle
        ruimtes die bij de verhuur horen, moeten toegankelijk zijn. De slaapplaatsen moeten in hun
        gebruikelijke opstelling staan en alle opgegeven voorzieningen moeten aanwezig, bereikbaar
        en in werkende staat zijn.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Apparaten en afstandsbedieningen moeten werken. Biedt u wifi aan, dan moet de verbinding
        kunnen worden getest. Ook documenten die u aan gasten belooft, moeten beschikbaar zijn.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        De sanitaire voorzieningen, vloeren, muren en plafonds, meubels, bedden en matrassen, en de
        keuken met haar apparatuur moeten schoon en in goede staat zijn.
      </p>

      <ArticleSectionHeading id="checklist-voor-het-inspectiebezoek">
        Checklist vóór het inspectiebezoek
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Controleer vóór uw afspraak de volgende punten:
      </p>
      <div className="article-callout p-6 mb-8">
        <ul className="space-y-3 text-muted" data-testid="pre-inspection-checklist">
          {checklist.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-copper bg-surface"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <ArticleSectionHeading id="aanvullend-bewijs-na-de-inspectie">
        Kunt u na de inspectie nog aanvullend bewijs indienen?
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Volgens de{' '}
        <a
          href={GUIDE_CONTROLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          officiële inspectiegids
        </a>{' '}
        mogen bepaalde aanvullende bewijsstukken binnen maximaal{' '}
        <strong>15 werkdagen na het inspectiebezoek</strong> worden ingediend. Dat kan bijvoorbeeld
        gaan om een document, een mededeling, een welkomstmap of een bewijsstuk voor een klein
        onderdeel van de uitrusting.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Dat is niet automatisch toegestaan en vervangt een goede voorbereiding van de woning niet.
        Uitrusting en diensten moeten in principe tijdens de inspectie ter plaatse kunnen worden
        vastgesteld. Of aanvullend bewijs kan worden meegenomen, hangt af van het criterium en de
        aangeleverde stukken.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Met alleen een offerte of factuur kunnen bijvoorbeeld niet-uitgevoerde werkzaamheden, een
        gebrek aan netheid, een onderhoudsprobleem of een belangrijk apparaat dat tijdens de
        inspectie ontbrak niet worden goedgekeurd.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Etoilys laat u per criterium weten of het aanvullende bewijs kan worden geaccepteerd. Meer
        informatie over alle stappen en termijnen vindt u op onze pagina over de{' '}
        <Link
          to="/nl/classificatieprocedure-vakantiewoning"
          className="article-inline-link font-semibold"
        >
          classificatieprocedure
        </Link>
        .
      </p>
    </ArticleLayout>
  );
}
