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

const ARTICLE_PATH = '/en/articles/prepare-holiday-rental-star-rating-inspection';
const REFERENTIEL_URL =
  'https://www.atout-france.fr/sites/default/files/2025-12/R%C3%A9f%C3%A9rentiel%20de%20classement%20des%20meubl%C3%A9s%20de%20tourisme%202022%20V2.pdf';
const GUIDE_CONTROLE_URL =
  'https://www.atout-france.fr/sites/default/files/2026-01/Guide%20de%20contr%C3%B4le%20-%20Meubl%C3%A9%20de%20tourisme.pdf';

const dishes = [
  '2 water glasses;',
  '1 wine glass;',
  '2 dinner plates;',
  '2 soup plates;',
  '2 dessert plates;',
  '2 tablespoons;',
  '2 teaspoons;',
  '2 knives;',
  '2 forks;',
  '2 bowls;',
  '2 cups or mugs.',
];

const checklist = [
  "Is the star rating you are applying for realistic given your property's equipment?",
  'Does the declared guest capacity match the beds actually available?',
  'Do the dining and living room seats meet the requirements for that capacity?',
  'Do you have the amounts of tableware required under criterion 63?',
  'Does your tableware form matching sets?',
  'Do you have every item required under criterion 65?',
  'Is all equipment accessible and in working order?',
  'Are at least five tourist information resources available, including three in a foreign language or bilingual?',
  'Are the services offered to guests clearly documented in writing?',
  "Is the property's accessibility or lack of accessibility clearly stated?",
  'Is there a simple message encouraging guests to respect the environment?',
  'Is the property clean, well maintained and presented as it would be for guests?',
];

const officialSources = [
  {
    id: 'atout-france-meuble-de-tourisme-1',
    organization: 'Atout France',
    title: 'Furnished tourist accommodation',
    url: 'https://www.atout-france.fr/fr/classement/meuble-de-tourisme',
  },
  {
    id: 'atout-france-referentiel-de-classement-des-meubles-de-tourisme-2022-2',
    organization: 'Atout France',
    title: '2022 classification criteria for furnished tourist accommodation',
    url: REFERENTIEL_URL,
  },
  {
    id: 'atout-france-guide-de-controle-du-classement-des-meubles-de-tourisme-3',
    organization: 'Atout France',
    title: 'Inspection guide for furnished tourist accommodation classification',
    url: GUIDE_CONTROLE_URL,
  },
  {
    id: 'atout-france-faq-meuble-de-tourisme-4',
    organization: 'Atout France',
    title: 'Furnished tourist accommodation FAQ',
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
  const label = status === 'optional' ? 'Optional' : 'Mandatory';
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
    id: 'understanding-the-criteria-for-your-star-rating',
    label: 'Understand the criteria for your chosen star rating',
  },
  {
    id: 'equipment-and-guest-capacity',
    label: "Match the equipment to your property's guest capacity",
  },
  {
    id: 'guest-information-and-documents',
    label: 'Prepare guest information and documents',
  },
  {
    id: 'presenting-the-property-as-rented',
    label: 'Present the property as guests will find it',
  },
  { id: 'pre-inspection-checklist', label: 'Pre-inspection checklist' },
  {
    id: 'additional-evidence-after-inspection',
    label: 'Can you submit additional evidence after the inspection?',
  },
];

const structuredArticle = getArticleStructuredData(ARTICLE_PATH);

if (structuredArticle === null) {
  throw new Error(`Missing canonical article metadata for ${ARTICLE_PATH}`);
}

const author = getArticleAuthor(structuredArticle.authorId);
const article = {
  slug: 'prepare-holiday-rental-star-rating-inspection',
  title: structuredArticle.headline,
  excerpt:
    'How do the 133 criteria work, and what equipment, quantities and guest information should you check before your inspection?',
  relatedSummary:
    'Equipment, documents and key checks to make before your classification inspection.',
  href: ARTICLE_PATH,
  category: 'guides-pratiques',
  readingTimeMinutes: 9,
  authorId: structuredArticle.authorId,
  authorName: author.name,
  publishedAt: structuredArticle.datePublished,
} satisfies ArticleLayoutArticle;

const keyTakeawaysBlock = (
  <KeyTakeaways
    locale="en"
    variant="bullets"
    items={[
      {
        id: 'prepare-holiday-rental-star-rating-inspection-takeaway-1',
        content:
          "The star rating you are applying for and your property's guest capacity determine some of the equipment and quantities required.",
      },
      {
        id: 'prepare-holiday-rental-star-rating-inspection-takeaway-2',
        content:
          'Some criteria cover several items: just one missing piece of equipment can be enough for the entire criterion to fail.',
      },
      {
        id: 'prepare-holiday-rental-star-rating-inspection-takeaway-3',
        content:
          'Information and services must be verifiable through written or digital materials, while all cleanliness and good-condition criteria must be met.',
      },
    ]}
  />
);

const articleSources = (
  <ArticleSources
    locale="en"
    sources={officialSources}
    description={<p>The official documents linked below are in French.</p>}
  />
);

export default function ArticlePreparerVisiteClassementMeubleTourismeEn() {
  return (
    <ArticleLayout
      article={article}
      locale="en"
      tableOfContents={tableOfContents}
      lede={
        <>
          <p className="text-xl leading-comfortable text-muted mb-6">
            During the classification inspection, the inspector assesses your property against the{' '}
            <strong>
              133 criteria in the{' '}
              <a
                href={REFERENTIEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="article-inline-link"
              >
                official French classification standard
              </a>
            </strong>
            . Some criteria are mandatory, while others are optional, and which ones apply depends
            on the star rating you are seeking. To obtain your chosen rating, your property must
            achieve at least <strong>95% of the mandatory points</strong>, as well as the required
            number of optional points. Cleanliness and good-condition criteria cannot be offset by
            other points: all of them must be met.
          </p>
          <p className="text-xl leading-comfortable text-muted mb-8">
            Some criteria concern surprisingly small details: the exact amount of tableware,
            information included in your listing, or a missing piece of equipment. Yet these details
            can make all the difference on inspection day. This guide covers the items most often
            overlooked or likely to cause problems, so you can avoid unwelcome surprises when the
            inspector arrives.
          </p>

          <div className="article-callout p-5 mb-12 text-base">
            <p className="text-base leading-comfortable text-muted">
              The examples below illustrate the general requirements of the classification standard.
              Only an on-site inspection can confirm a property's star rating.
            </p>
          </div>
        </>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <div className="article-cta-panel mb-12 mt-12 p-8">
          <h2 className="text-h4 mb-3">One last check before your appointment</h2>
          <p className="text-muted leading-comfortable mb-4">
            You don't need to memorise all 133 criteria. What matters is understanding the
            requirements for your property's star rating and guest capacity, and making sure
            everything the inspector needs to see or check will be available on the day.
          </p>
          <p className="text-muted leading-comfortable mb-6">
            The Etoilys simulator helps you work through the criteria and spot anything you may have
            missed before your appointment.
          </p>
          <Button href="/simulateur" variant="primary">
            Check your property with the simulator (in French)
          </Button>
        </div>
      }
      sources={articleSources}
      author={author}
    >
      <ArticleSectionHeading id="understanding-the-criteria-for-your-star-rating">
        Understand the criteria for your chosen star rating
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Before the inspection begins, you specify the star rating you are applying for. The
        inspector then assesses the property against the criteria for that rating.
      </p>
      <p className="text-muted leading-comfortable mb-6">
        An item of equipment may be optional at one star level and mandatory at a higher one. These
        examples show how that works:
      </p>

      <ResponsiveComparisonTable
        appearance="editorial"
        className="mb-6"
        primaryColumnKey="criterion"
        columns={[
          {
            key: 'criterion',
            label: 'Example criterion',
            mobileLabel: 'Example criterion',
            widthClassName: 'w-[28%]',
          },
          {
            key: 'one',
            label: '1 star',
            mobileLabel: '1 star',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'two',
            label: '2 stars',
            mobileLabel: '2 stars',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'three',
            label: '3 stars',
            mobileLabel: '3 stars',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'four',
            label: '4 stars',
            mobileLabel: '4 stars',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
          {
            key: 'five',
            label: '5 stars',
            mobileLabel: '5 stars',
            align: 'center',
            widthClassName: 'w-[14.4%]',
          },
        ]}
        rows={[
          {
            key: 'kettle',
            cells: {
              criterion: 'Kettle',
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
              criterion: 'Bathroom toiletries',
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
              criterion: 'Espresso machine',
              one: <CriterionStatus status="optional" />,
              two: <CriterionStatus status="optional" />,
              three: <CriterionStatus status="optional" />,
              four: <CriterionStatus status="required" />,
              five: <CriterionStatus status="required" />,
            },
          },
        ]}
        caption="Examples of criteria by requested star rating"
        desktopWrapperClassName="hidden lg:block"
        headerCellClassName="p-2.5 font-semibold break-words"
        cellClassName="border-b border-ink/15 p-2.5 align-middle break-words text-muted"
        mobileContainerClassName="space-y-3 lg:hidden"
      />

      <p className="text-muted leading-comfortable mb-4">
        To obtain the requested star rating, your property must reach at least 95% of the mandatory
        points and the quota of optional points required for that rating. Failure to meet a single
        mandatory criterion does not automatically prevent classification.
      </p>

      <div className="article-callout mb-12 mt-8 p-6">
        <h3 className="mb-3 text-h4">Not sure which star rating to apply for?</h3>
        <p className="text-muted leading-comfortable mb-5">
          The Etoilys simulator adjusts all 133 criteria to your property's guest capacity and lets
          you carry out an initial self-assessment before the inspection.
        </p>
        <Button href="/simulateur" variant="secondary" size="sm">
          Try the simulator (in French)
        </Button>
      </div>

      <ArticleSectionHeading id="equipment-and-guest-capacity">
        Match the equipment to your property's guest capacity
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Declared guest capacity affects more than the number of beds. It also determines how much
        tableware is required, the number of seats at the dining table and several other criteria.
      </p>

      <h3 className="mt-8 mb-3">Criterion 63: check your tableware quantities</h3>
      <p className="text-muted leading-comfortable mb-4">
        Criterion 63 concerns the <strong>minimum quantity of matching tableware per guest</strong>.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        For each guest, the property must have at least:
      </p>
      <ArticleBulletList items={dishes} />
      <p className="text-muted leading-comfortable mb-4">
        For a property with a <strong>six-person capacity</strong>, that means, among other things,
        12 water glasses, six wine glasses, 12 dinner plates, 12 bowls, 12 cups or mugs, and 12 of
        each type of cutlery required in pairs.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Not all your tableware has to look identical. For example, for 12 bowls in a six-person
        property, you could have{' '}
        <strong>six matching white bowls and six matching blue bowls</strong>. That gives you two
        consistent sets, each containing one bowl per guest. By contrast, 12 completely different
        bowls would not count as matching sets.
      </p>

      <h3 className="mt-8 mb-3">Criterion 65: check every item on the list</h3>
      <p className="text-muted leading-comfortable mb-4">
        To meet this criterion, your property needs all of the following:
      </p>
      <div className="article-callout p-5 mb-6">
        <ul className="space-y-3 text-muted" data-testid="criterion-65-equipment-groups">
          <li>
            <strong>For cooking:</strong> 1 ovenproof dish, 2 saucepans, 1 frying pan, 1 large
            cooking pot and 1 lid;
          </li>
          <li>
            <strong>For food preparation:</strong> 1 mixing bowl, 1 chopping board, 1 bread knife, 1
            colander, 1 salad spinner, 1 pie and/or cake tin, 1 peeler and 1 measuring jug;
          </li>
          <li>
            <strong>For smaller utensils:</strong> 1 corkscrew, 1 bottle opener, 1 pair of scissors,
            1 tin opener, 1 trivet, 1 ladle, 1 skimmer, 1 spatula and 1 whisk.
          </li>
        </ul>
      </div>
      <p className="text-muted leading-comfortable mb-4">
        All these items fall under a single criterion.{' '}
        <strong>If even one is missing, criterion 65 cannot be met.</strong>
      </p>

      <h3 className="mt-8 mb-3">Seating must also match your guest capacity</h3>
      <p className="text-muted leading-comfortable mb-4">
        The dining table and its chairs must seat the property's full guest capacity. The same
        applies to seating on sofas and armchairs in the living area, but this requirement is{' '}
        <strong>capped at seven guests</strong>. A property designed for ten guests does not
        therefore need ten seats in the living room to meet this criterion.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        If your property accommodates six guests but the living room has only five seats, this
        criterion cannot be met. However, this does not automatically prevent classification, which
        depends on the overall result of the assessment.
      </p>

      <ArticleSectionHeading id="guest-information-and-documents">
        Prepare guest information and documents
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Some criteria are about more than whether equipment is present. They also check the
        information and services actually available to guests.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Where a criterion concerns information or a service, the inspector must be able to verify it
        in a written or digital source: your listing, welcome guide, website, email, brochure or
        notice. Simply saying that you provide something during the inspection is not enough to meet
        the criterion.
      </p>

      <h3 className="mt-8 mb-3">
        Criterion 100: provide five sources of local tourist information
      </h3>
      <p className="text-muted leading-comfortable mb-4">
        Criterion 100 requires local and tourist information in French and at least one foreign
        language.
      </p>
      <p className="text-muted leading-comfortable mb-4">To meet it, you need:</p>
      <ul className="space-y-2 mb-6 text-muted">
        <li className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-bold text-copper" aria-hidden="true">
            •
          </span>
          <span>
            at least <strong>five leaflets, brochures or information resources</strong> in total;
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-bold text-copper" aria-hidden="true">
            •
          </span>
          <span>
            <strong>at least three of these available in one or more foreign languages</strong>.
          </span>
        </li>
      </ul>
      <p className="text-muted leading-comfortable mb-4">
        A bilingual brochure counts as information in both French and the foreign language.
        Resources can be printed or digital: QR codes, a tablet, downloadable documents, a website
        or a digital guide.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        These might cover local sights and monuments, leisure activities, excursions, events, the
        tourist office, shops, public services or nearby healthcare professionals.
      </p>

      <h3 className="mt-8 mb-3">
        Criteria 105, 106, 108 and 110: make sure the services are documented
      </h3>
      <p className="text-muted leading-comfortable mb-4">
        The following criteria concern services offered to guests:
      </p>
      <ResponsiveComparisonTable
        appearance="editorial"
        className="mb-6"
        primaryColumnKey="criterion"
        columns={[
          {
            key: 'criterion',
            label: 'Criterion',
            mobileLabel: 'Criterion',
            align: 'center',
            widthClassName: 'w-1/4',
          },
          {
            key: 'service',
            label: 'Service to be documented',
            mobileLabel: 'Service to be documented',
            widthClassName: 'w-3/4',
          },
        ]}
        rows={[
          {
            key: '105',
            cells: {
              criterion: '105',
              service: 'Bed linen is always offered by the host',
            },
          },
          {
            key: '106',
            cells: {
              criterion: '106',
              service: 'Towels are always offered by the host',
            },
          },
          {
            key: '108',
            cells: {
              criterion: '108',
              service: 'Beds made up on arrival are always offered by the host',
            },
          },
          {
            key: '110',
            cells: {
              criterion: '110',
              service: 'A cleaning service is always offered',
            },
          },
        ]}
        caption="Guest services that must be verifiable in writing"
      />
      <p className="text-muted leading-comfortable mb-4">
        These services can be free or paid. What matters is that they are offered as standard and
        that guests can verify this in writing: in your rental listing, welcome guide, website,
        standard email, brochure or notice inside the property.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Don't confuse two separate services: <strong>offering bed linen</strong> and{' '}
        <strong>offering to have the beds made up on arrival</strong> are assessed under different
        criteria.
      </p>

      <h3 className="mt-8 mb-3">Criterion 116: state whether the property is accessible</h3>
      <p className="text-muted leading-comfortable mb-4">
        Criterion 116 concerns{' '}
        <strong>accessibility information included in guest-facing materials</strong>.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Your property does not need to be suitable for guests with reduced mobility to meet this
        criterion. However, guests must be clearly informed about its level of accessibility. If the
        accommodation is not adapted, this should be stated in your listing, on your website, in the
        welcome guide or in another source of information for guests.
      </p>
      <p className="text-muted leading-comfortable mb-4">A simple sentence may be enough:</p>
      <blockquote className="article-quote mb-6 p-5">
        This property is not suitable for guests with reduced mobility.
      </blockquote>

      <h3 className="mt-8 mb-3">Criterion 130: help guests reduce their environmental impact</h3>
      <p className="text-muted leading-comfortable mb-4">
        Criterion 130 is about{' '}
        <strong>
          making guests aware of the steps they can take during their stay to protect the
          environment
        </strong>
        .
      </p>
      <p className="text-muted leading-comfortable mb-4">
        That information can appear in the welcome guide, your listing, your website or a notice in
        the property. There is no need to write a three-page environmental policy. A short,
        practical reminder can be enough, for example:
      </p>
      <blockquote className="article-quote mb-6 p-5">
        Please switch off the lights and air conditioning when you leave the property, and try to
        limit your water use during your stay.
      </blockquote>
      <p className="text-muted leading-comfortable mb-4">
        Other ideas include recycling and waste sorting, public transport, bicycle hire, walking
        routes, local products or other ways to reduce the environmental impact of a stay.
      </p>

      <ArticleSectionHeading id="presenting-the-property-as-rented">
        Present the property as guests will find it
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        The inspection covers the property as it is actually offered to guests. All rooms included
        in the rental must be accessible, beds must be set up as they normally are, and all declared
        equipment must be present, accessible and working.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        All appliances and remote controls must work. If the property offers Wi-Fi, the inspector
        must be able to test the connection. Any documents promised to guests must also be
        available.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Bathrooms and toilets, floors, walls and ceilings, furniture, bedding, and the kitchen and
        its equipment must be clean and in good condition.
      </p>

      <ArticleSectionHeading id="pre-inspection-checklist">
        Pre-inspection checklist
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Before your appointment, check the following:
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

      <ArticleSectionHeading id="additional-evidence-after-inspection">
        Can you submit additional evidence after the inspection?
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        The{' '}
        <a
          href={GUIDE_CONTROLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          official inspection guide
        </a>{' '}
        allows certain supporting evidence to be submitted within{' '}
        <strong>15 working days after the inspection</strong>. This might include a document, a
        notice, a welcome guide or evidence relating to a small item of equipment.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        This is neither automatic nor a substitute for preparing the property. Equipment and
        services must normally be checked on site on inspection day. Whether additional evidence can
        be accepted depends on the criterion and the evidence provided.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        A quote or invoice cannot, for example, be used to validate work that has not been carried
        out, a cleanliness issue, a maintenance problem or major equipment that was not present at
        the inspection.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Etoilys will tell you whether the additional evidence can be accepted for the criterion
        concerned. To understand all the stages and timescales, you can also{' '}
        <Link to="/en/classification-process" className="article-inline-link font-semibold">
          read about the classification process
        </Link>
        .
      </p>
    </ArticleLayout>
  );
}
