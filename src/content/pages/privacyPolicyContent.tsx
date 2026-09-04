import type { ReactNode } from 'react';
import type { Locale } from '../../i18n/locales';

type PrivacyPolicyContent = {
  title: string;
  lastUpdated: string;
  cookiePreferencesLabel: string;
  body?: ReactNode;
};

const linkClassName = 'text-primary hover:underline';
const sectionTitleClassName = 'text-h4 font-semibold text-gray-800 mb-3';
const strongClassName = 'text-gray-700';

export const privacyPolicyContent = {
  fr: {
    title: 'Politique de confidentialité',
    lastUpdated: 'Dernière mise à jour : 10 juillet 2026',
    cookiePreferencesLabel: 'Gérer mes cookies',
    body: undefined,
  },
  en: {
    title: 'Privacy policy',
    lastUpdated: 'Last updated: July 10, 2026',
    cookiePreferencesLabel: 'Manage cookies',
    body: (
      <>
        <div className="space-y-4">
          <p>
            This privacy policy describes how ETOILYS collects and processes personal data from
            users of the website{' '}
            <a
              href="https://www.etoilys.fr"
              className={linkClassName}
              target="_blank"
              rel="noopener noreferrer"
            >
              www.etoilys.fr
            </a>
            , in particular when they use the contact form or the classification request form.
          </p>
          <p>
            ETOILYS attaches particular importance to the protection of personal data and undertakes
            to process this data lawfully, fairly, transparently and proportionately to the purposes
            pursued.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>1. Data controller</h2>
          <p className="mb-4">The data controller is:</p>
          <div className="bg-primary-100 rounded-card p-6 text-sm space-y-0.5 mb-4">
            <p className="font-semibold text-gray-800">ETOILYS</p>
            <p>SAS with share capital of EUR 2,000</p>
            <p>RCS Bergerac 939 330 809</p>
            <p>Registered office: 1345 route de Dautres, 24150 Mauzac-et-Grand-Castang, France</p>
            <p>
              Email:{' '}
              <a href="mailto:contact@etoilys.fr" className={linkClassName}>
                contact@etoilys.fr
              </a>
            </p>
            <p>
              Phone:{' '}
              <a href="tel:+33649551540" className={linkClassName}>
                +33 6 49 55 15 40
              </a>
            </p>
          </div>
          <p>
            For any question about this policy or the processing of your personal data, you can
            contact us at:{' '}
            <a href="mailto:contact@etoilys.fr" className={linkClassName}>
              contact@etoilys.fr
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>2. Personal data collected</h2>
          <p className="mb-3">
            Depending on the forms and exchanges, ETOILYS may collect the following categories of
            data:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 mb-4">
            <li>
              <strong className={strongClassName}>identification and contact data</strong>: last
              name, first name, email address, phone number;
            </li>
            <li>
              <strong className={strongClassName}>data relating to your request</strong>: subject of
              the request, message content, information about your classification project;
            </li>
            <li>
              <strong className={strongClassName}>
                data relating to the furnished accommodation concerned
              </strong>
              : property address, characteristics useful for reviewing the request, and more
              generally any information you choose to send us;
            </li>
            <li>
              <strong className={strongClassName}>technical data linked to site use</strong>: IP
              address, technical logs, security data, information needed to prevent abuse and
              operate the forms;
            </li>
            <li>
              <strong className={strongClassName}>data from an anti-spam or anti-bot system</strong>
              , when this mechanism is used to secure form submissions;
            </li>
            <li>
              <strong className={strongClassName}>audience measurement data</strong>: detailed
              journeys, acquisition and interactions only after analytics consent has been accepted;
              after an explicit refusal, an optional cookieless count may contain only the landing
              page without parameters and the language.
            </li>
          </ul>
          <p>
            ETOILYS ensures that it collects only the data strictly necessary to process the
            requests addressed to it.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>3. Purposes and legal bases of processing</h2>
          <p className="mb-4">Your personal data is processed for the following purposes:</p>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-700 mb-1">
                a) Replying to requests sent through the contact form
              </p>
              <p className="text-sm">
                <span className="font-medium">Legal basis:</span> ETOILYS' legitimate interest in
                replying to requests received or, depending on the nature of the request,
                pre-contractual measures taken at your request.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                b) Reviewing and processing classification or quotation requests
              </p>
              <p className="text-sm">
                <span className="font-medium">Legal basis:</span> pre-contractual measures taken at
                your request and, where applicable, performance of the contract if a contractual
                relationship is entered into.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                c) Administrative and commercial follow-up of the relationship
              </p>
              <p className="text-sm">
                <span className="font-medium">Legal basis:</span> performance of the contract,
                pre-contractual measures or legitimate interest depending on the stage of the
                relationship.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                d) Securing the site, preventing spam, automated submissions and abusive use
              </p>
              <p className="text-sm">
                <span className="font-medium">Legal basis:</span> ETOILYS' legitimate interest in
                protecting its site, forms and services. The CNIL also cites CAPTCHA-type measures
                among the measures that may be used for a legitimate technical protection purpose.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                e) Complying with applicable legal, accounting, tax or evidentiary obligations
              </p>
              <p className="text-sm">
                <span className="font-medium">Legal basis:</span> legal obligation.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>4. Recipients of the data</h2>
          <p className="mb-3">
            The personal data collected is intended only for authorised persons within ETOILYS, to
            the extent necessary to manage your request.
          </p>
          <p className="mb-3">
            It may also be sent to technical service providers acting on behalf of ETOILYS, in
            particular for:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
            <li>hosting and technical operation of the site;</li>
            <li>technical processing of forms;</li>
            <li>sending and routing emails;</li>
            <li>securing forms and preventing abuse;</li>
            <li>technical storage or management of application logs.</li>
          </ul>
          <p className="mb-3">
            In this respect, the site may rely in particular on the following services, depending on
            its actual configuration:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
            <li>
              <strong className={strongClassName}>Vercel</strong> for site hosting and operation;
            </li>
            <li>
              <strong className={strongClassName}>Railway</strong> for hosting and technical
              operation of the Starsmanager backend;
            </li>
            <li>
              <strong className={strongClassName}>Resend</strong> for email routing;
            </li>
            <li>
              <strong className={strongClassName}>Cloudflare Turnstile</strong> for anti-bot
              protection on forms;
            </li>
            <li>
              <strong className={strongClassName}>PostHog</strong> for detailed audience,
              acquisition and journey analysis after analytics consent, or for optional minimal
              cookieless measurement after an explicit refusal.
            </li>
            <li>
              <strong className={strongClassName}>OpenAI Ads</strong> to measure, with your separate
              consent, whether a classification request follows an Etoilys advertisement shown on
              ChatGPT.
            </li>
          </ul>
          <p className="mb-3">
            ETOILYS does not voluntarily send PostHog or OpenAI Ads any name, email address, phone
            number, postal address or free-text message content entered in forms.
          </p>
          <p>ETOILYS does not sell your personal data to third parties.</p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>5. Transfers of data outside the European Union</h2>
          <p className="mb-3">
            Some technical service providers used by ETOILYS may be located or process certain data
            outside the European Union or the European Economic Area.
          </p>
          <p className="mb-3">
            Where such transfers take place, ETOILYS ensures that they are governed by appropriate
            safeguards, for example:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>standard contractual clauses approved by the European Commission;</li>
            <li>
              or, where applicable, a recognised mechanism such as the Data Privacy Framework.
            </li>
          </ul>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>6. Retention periods</h2>
          <p className="mb-3">
            ETOILYS keeps your personal data only for the period necessary for the purposes pursued,
            then for the periods required to meet its legal obligations or defend its rights.
          </p>
          <p className="mb-3">In principle:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              data relating to a contact request or classification request without a subsequent
              contractual relationship is kept for the time needed to process the request, then may
              be kept for up to 3 years from the last contact from the person concerned, for
              commercial follow-up or renewed contact;
            </li>
            <li>
              in the event of a contractual relationship, the data is kept for the duration of the
              relationship, then archived for the applicable legal periods;
            </li>
            <li>contracts and commercial correspondence may be kept for 5 years;</li>
            <li>invoices and accounting documents are kept for 10 years;</li>
            <li>
              information needed to manage an objection to marketing may be kept for 3 years in
              order to take your choice into account.
            </li>
          </ul>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>7. Data security</h2>
          <p>
            ETOILYS implements appropriate technical and organisational measures to preserve the
            security, integrity and confidentiality of personal data, and in particular to prevent
            its alteration, loss, disclosure or unauthorised access.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>8. Your rights</h2>
          <p className="mb-3">
            In accordance with the applicable regulations, you have, depending on the case, the
            following rights:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
            <li>right of access to your data;</li>
            <li>right to rectification;</li>
            <li>right to erasure;</li>
            <li>right to restriction of processing;</li>
            <li>right to object;</li>
            <li>right to data portability where applicable;</li>
            <li>right to withdraw your consent at any time when processing is based on consent.</li>
          </ul>
          <p className="mb-3">
            You can exercise your rights by writing to:{' '}
            <a href="mailto:contact@etoilys.fr" className={linkClassName}>
              contact@etoilys.fr
            </a>
          </p>
          <p className="mb-3">
            If there is reasonable doubt about your identity, proof of identity may be requested in
            order to secure the processing of your request.
          </p>
          <p className="mb-3">
            ETOILYS will endeavour to reply as soon as possible and, in any event, within the
            maximum legal period applicable. The CNIL states that this period is in principle one
            month.
          </p>
          <p>
            If, after contacting us, you consider that your rights have not been respected, you may
            lodge a complaint with the{' '}
            <a
              href="https://www.cnil.fr"
              className={linkClassName}
              target="_blank"
              rel="noopener noreferrer"
            >
              CNIL
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>9. Cookies and other trackers</h2>
          <p className="mb-3">
            The site may use cookies or other trackers necessary for its operation, security or form
            submission.
          </p>
          <p className="mb-3">
            In accordance with the rules recalled by the CNIL, some trackers may be exempt from
            consent when they are strictly necessary for the operation of the requested service or
            for certain accepted technical purposes. By contrast, cookies or trackers that are not
            strictly necessary may only be placed after your consent has been collected.
          </p>
          <p className="mb-3">
            Until you make a choice, the PostHog SDK is not loaded and no PostHog event is sent. If
            you accept, persistent analytics may measure viewed pages, acquisition, forms, contact
            links, simulators and conversions. The choice is kept for up to 6 months.
          </p>
          <p className="mb-3">
            With your separate consent for advertising measurement, an OpenAI Ads measurement pixel
            may be loaded to measure whether a classification request follows an Etoilys
            advertisement shown on ChatGPT. The site does not explicitly send any raw data entered
            in the form (name, email, phone number, address, message) in this conversion event,
            which is only sent after your request has actually been confirmed as successful. If
            OpenAI Ads' automatic advanced matching is enabled for this source, it may separately
            detect certain supported customer information directly on the page and send it to OpenAI
            in hashed (non-readable) form, independently of the content of this event. This consent
            is independent from the one given to PostHog and can be withdrawn at any time in the
            preferences, which stops any new event from being sent.
          </p>
          <p className="mb-3">
            After an explicit refusal, and only if the dedicated production setting is enabled, at
            most one cookieless event per page load may contain the landing page without query or
            fragment and the language. It contains no campaign, UTM, AI referrer, conversion or
            persistent identifier. This minimal measurement can be disabled independently in cookie
            preferences.
          </p>
          <p>
            Withdrawing consent stops detailed tracking and sends no new event on the current
            document. Minimal measurement may resume on the next page load unless separately
            disabled. A reload before a choice loses the volatile acquisition context and cannot be
            linked to a later conversion.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>10. Changes to this policy</h2>
          <p className="mb-3">
            ETOILYS may amend this privacy policy at any time, in particular to take account of
            legal, regulatory or technical developments, or changes in the processing carried out on
            the site.
          </p>
          <p>The applicable version is the one published on the site on the date of your visit.</p>
        </div>
      </>
    ),
  },
  nl: {
    title: 'Privacybeleid',
    lastUpdated: 'Laatst bijgewerkt: 10 juli 2026',
    cookiePreferencesLabel: 'Cookies beheren',
    body: (
      <>
        <div className="space-y-4">
          <p>
            Dit privacybeleid beschrijft hoe ETOILYS persoonsgegevens verzamelt en verwerkt van
            gebruikers van de website{' '}
            <a
              href="https://www.etoilys.fr"
              className={linkClassName}
              target="_blank"
              rel="noopener noreferrer"
            >
              www.etoilys.fr
            </a>
            , met name wanneer zij het contactformulier of het formulier voor een
            classificatieaanvraag gebruiken.
          </p>
          <p>
            ETOILYS hecht bijzonder belang aan de bescherming van persoonsgegevens en verbindt zich
            ertoe deze gegevens rechtmatig, behoorlijk, transparant en evenredig met de nagestreefde
            doeleinden te verwerken.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>1. Verwerkingsverantwoordelijke</h2>
          <p className="mb-4">De verwerkingsverantwoordelijke is:</p>
          <div className="bg-primary-100 rounded-card p-6 text-sm space-y-0.5 mb-4">
            <p className="font-semibold text-gray-800">ETOILYS</p>
            <p>SAS met aandelenkapitaal van 2.000 euro</p>
            <p>RCS Bergerac 939 330 809</p>
            <p>Statutaire zetel: 1345 route de Dautres, 24150 Mauzac-et-Grand-Castang, Frankrijk</p>
            <p>
              E-mail:{' '}
              <a href="mailto:contact@etoilys.fr" className={linkClassName}>
                contact@etoilys.fr
              </a>
            </p>
            <p>
              Telefoon:{' '}
              <a href="tel:+33649551540" className={linkClassName}>
                +33 6 49 55 15 40
              </a>
            </p>
          </div>
          <p>
            Voor vragen over dit beleid of de verwerking van uw persoonsgegevens kunt u contact met
            ons opnemen via:{' '}
            <a href="mailto:contact@etoilys.fr" className={linkClassName}>
              contact@etoilys.fr
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>2. Verzamelde persoonsgegevens</h2>
          <p className="mb-3">
            Afhankelijk van de formulieren en uitwisselingen kan ETOILYS de volgende categorieën
            gegevens verzamelen:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 mb-4">
            <li>
              <strong className={strongClassName}>identificatie- en contactgegevens</strong>: naam,
              voornaam, e-mailadres, telefoonnummer;
            </li>
            <li>
              <strong className={strongClassName}>gegevens over uw aanvraag</strong>: onderwerp van
              de aanvraag, inhoud van het bericht, informatie over uw classificatieproject;
            </li>
            <li>
              <strong className={strongClassName}>
                gegevens over de betrokken gemeubileerde woning
              </strong>
              : adres van de woning, nuttige kenmerken voor de behandeling van de aanvraag en, meer
              algemeen, alle informatie die u ervoor kiest aan ons door te geven;
            </li>
            <li>
              <strong className={strongClassName}>
                technische gegevens in verband met sitegebruik
              </strong>
              : IP-adres, technische logs, beveiligingsgegevens, informatie die nodig is om misbruik
              te voorkomen en de formulieren te laten functioneren;
            </li>
            <li>
              <strong className={strongClassName}>
                gegevens uit een antispam- of antibotsysteem
              </strong>
              , wanneer dit mechanisme wordt gebruikt om formulierverzendingen te beveiligen;
            </li>
            <li>
              <strong className={strongClassName}>gegevens voor bezoekersmeting</strong>:
              gedetailleerde trajecten, acquisitie en interacties uitsluitend na aanvaarding van
              analytics-toestemming; na een uitdrukkelijke weigering kan een optionele telling
              zonder cookie uitsluitend de landingspagina zonder parameters en de taal bevatten.
            </li>
          </ul>
          <p>
            ETOILYS zorgt ervoor alleen gegevens te verzamelen die strikt noodzakelijk zijn voor de
            behandeling van de aan haar gerichte aanvragen.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>
            3. Doeleinden en rechtsgronden van de verwerking
          </h2>
          <p className="mb-4">Uw persoonsgegevens worden verwerkt voor de volgende doeleinden:</p>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-700 mb-1">
                a) Beantwoorden van aanvragen via het contactformulier
              </p>
              <p className="text-sm">
                <span className="font-medium">Rechtsgrond:</span> het gerechtvaardigd belang van
                ETOILYS om ontvangen verzoeken te beantwoorden of, afhankelijk van de aard van het
                verzoek, precontractuele maatregelen op uw verzoek.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                b) Onderzoeken en behandelen van classificatie- of offerteaanvragen
              </p>
              <p className="text-sm">
                <span className="font-medium">Rechtsgrond:</span> precontractuele maatregelen op uw
                verzoek en, indien van toepassing, uitvoering van de overeenkomst wanneer een
                contractuele relatie wordt aangegaan.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                c) Administratieve en commerciële afhandeling van de relatie
              </p>
              <p className="text-sm">
                <span className="font-medium">Rechtsgrond:</span> uitvoering van de overeenkomst,
                precontractuele maatregelen of gerechtvaardigd belang, afhankelijk van de fase van
                de relatie.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                d) Beveiliging van de site en preventie van spam, geautomatiseerde verzendingen en
                misbruik
              </p>
              <p className="text-sm">
                <span className="font-medium">Rechtsgrond:</span> het gerechtvaardigd belang van
                ETOILYS om haar site, formulieren en diensten te beschermen. De CNIL noemt ook
                CAPTCHA-achtige maatregelen als maatregelen die kunnen worden gebruikt voor een
                legitiem technisch beschermingsdoel.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">
                e) Naleving van toepasselijke wettelijke, boekhoudkundige, fiscale of
                bewijsverplichtingen
              </p>
              <p className="text-sm">
                <span className="font-medium">Rechtsgrond:</span> wettelijke verplichting.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>4. Ontvangers van de gegevens</h2>
          <p className="mb-3">
            De verzamelde persoonsgegevens zijn uitsluitend bestemd voor bevoegde personen binnen
            ETOILYS, voor zover nodig om uw aanvraag te beheren.
          </p>
          <p className="mb-3">
            Zij kunnen ook worden doorgegeven aan technische dienstverleners die voor rekening van
            ETOILYS handelen, met name voor:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
            <li>hosting en technische exploitatie van de site;</li>
            <li>technische verwerking van formulieren;</li>
            <li>verzending en routering van e-mails;</li>
            <li>beveiliging van formulieren en preventie van misbruik;</li>
            <li>technische opslag of beheer van applicatielogs.</li>
          </ul>
          <p className="mb-3">
            In dit verband kan de site, afhankelijk van de daadwerkelijke configuratie, met name
            steunen op de volgende diensten:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
            <li>
              <strong className={strongClassName}>Vercel</strong> voor hosting en exploitatie van de
              site;
            </li>
            <li>
              <strong className={strongClassName}>Railway</strong> voor hosting en technische
              exploitatie van de Starsmanager-backend;
            </li>
            <li>
              <strong className={strongClassName}>Resend</strong> voor e-mailroutering;
            </li>
            <li>
              <strong className={strongClassName}>Cloudflare Turnstile</strong> voor
              antibotbescherming van formulieren;
            </li>
            <li>
              <strong className={strongClassName}>PostHog</strong> voor gedetailleerde analyse van
              bezoekersgedrag, de herkomst van bezoeken en gebruikersroutes na toestemming voor
              analytics, of voor optionele minimale meting zonder cookie na een uitdrukkelijke
              weigering.
            </li>
            <li>
              <strong className={strongClassName}>OpenAI Ads</strong> om, met uw afzonderlijke
              toestemming, te meten of een classificatieaanvraag volgt op een Etoilys-advertentie
              die op ChatGPT wordt getoond.
            </li>
          </ul>
          <p className="mb-3">
            ETOILYS geeft PostHog of OpenAI Ads niet vrijwillig namen, e-mailadressen,
            telefoonnummers, postadressen of vrije berichtinhoud door die in formulieren zijn
            ingevoerd.
          </p>
          <p>ETOILYS verkoopt uw persoonsgegevens niet aan derden.</p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>
            5. Doorgifte van gegevens buiten de Europese Unie
          </h2>
          <p className="mb-3">
            Sommige technische dienstverleners die door ETOILYS worden gebruikt, kunnen buiten de
            Europese Unie of de Europese Economische Ruimte zijn gevestigd of daar bepaalde gegevens
            verwerken.
          </p>
          <p className="mb-3">
            Wanneer dergelijke doorgiften plaatsvinden, zorgt ETOILYS ervoor dat zij worden
            beschermd door passende waarborgen, bijvoorbeeld:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>standaardcontractbepalingen goedgekeurd door de Europese Commissie;</li>
            <li>
              of, indien van toepassing, een erkend mechanisme zoals het Data Privacy Framework.
            </li>
          </ul>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>6. Bewaartermijnen</h2>
          <p className="mb-3">
            ETOILYS bewaart uw persoonsgegevens alleen gedurende de periode die nodig is voor de
            nagestreefde doeleinden, en daarna gedurende de termijnen die vereist zijn om aan
            wettelijke verplichtingen te voldoen of haar rechten te verdedigen.
          </p>
          <p className="mb-3">In beginsel:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              gegevens over een contactaanvraag of classificatieaanvraag zonder latere contractuele
              relatie worden bewaard zolang nodig is om de aanvraag te behandelen en kunnen
              vervolgens tot 3 jaar na het laatste contact van de betrokkene worden bewaard voor
              commerciële afhandeling of hernieuwd contact;
            </li>
            <li>
              bij een contractuele relatie worden de gegevens bewaard gedurende de relatie en daarna
              gearchiveerd gedurende de toepasselijke wettelijke termijnen;
            </li>
            <li>contracten en commerciële correspondentie kunnen 5 jaar worden bewaard;</li>
            <li>facturen en boekhoudstukken worden 10 jaar bewaard;</li>
            <li>
              informatie die nodig is om bezwaar tegen direct marketing te beheren, kan 3 jaar
              worden bewaard om met uw keuze rekening te houden.
            </li>
          </ul>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>7. Gegevensbeveiliging</h2>
          <p>
            ETOILYS treft passende technische en organisatorische maatregelen om de veiligheid,
            integriteit en vertrouwelijkheid van persoonsgegevens te waarborgen en met name
            wijziging, verlies, openbaarmaking of ongeoorloofde toegang te voorkomen.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>8. Uw rechten</h2>
          <p className="mb-3">
            Overeenkomstig de toepasselijke regelgeving beschikt u, afhankelijk van het geval, over
            de volgende rechten:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
            <li>recht op toegang tot uw gegevens;</li>
            <li>recht op rectificatie;</li>
            <li>recht op wissing;</li>
            <li>recht op beperking van de verwerking;</li>
            <li>recht van bezwaar;</li>
            <li>recht op gegevensoverdraagbaarheid indien van toepassing;</li>
            <li>
              recht om uw toestemming op elk moment in te trekken wanneer verwerking op toestemming
              berust.
            </li>
          </ul>
          <p className="mb-3">
            U kunt uw rechten uitoefenen door te schrijven naar:{' '}
            <a href="mailto:contact@etoilys.fr" className={linkClassName}>
              contact@etoilys.fr
            </a>
          </p>
          <p className="mb-3">
            Bij redelijke twijfel over uw identiteit kan een identiteitsbewijs worden gevraagd om de
            behandeling van uw verzoek te beveiligen.
          </p>
          <p className="mb-3">
            ETOILYS zal zo snel mogelijk antwoorden en in elk geval binnen de toepasselijke maximale
            wettelijke termijn. De CNIL herinnert eraan dat deze termijn in beginsel één maand is.
          </p>
          <p>
            Als u na contact met ons van mening bent dat uw rechten niet worden gerespecteerd, kunt
            u een klacht indienen bij de{' '}
            <a
              href="https://www.cnil.fr"
              className={linkClassName}
              target="_blank"
              rel="noopener noreferrer"
            >
              CNIL
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>9. Cookies en andere trackers</h2>
          <p className="mb-3">
            De site kan cookies of andere trackers gebruiken die nodig zijn voor de werking,
            beveiliging of formulierverzending.
          </p>
          <p className="mb-3">
            Overeenkomstig de door de CNIL in herinnering gebrachte regels kunnen sommige trackers
            van toestemming zijn vrijgesteld wanneer zij strikt noodzakelijk zijn voor de werking
            van de gevraagde dienst of voor bepaalde aanvaarde technische doeleinden. Cookies of
            trackers die niet strikt noodzakelijk zijn, mogen daarentegen alleen na uw toestemming
            worden geplaatst.
          </p>
          <p className="mb-3">
            Zolang geen keuze is gemaakt, wordt de PostHog SDK niet geladen en wordt geen
            PostHog-gebeurtenis verzonden. Bij acceptatie kunnen persistente analytics bekeken
            pagina’s, acquisitie, formulieren, contactlinks, simulatoren en conversies meten. De
            keuze wordt maximaal 6 maanden bewaard.
          </p>
          <p className="mb-3">
            Met uw afzonderlijke toestemming voor advertentiemeting kan een OpenAI Ads-meetpixel
            worden geladen om te meten of een classificatieaanvraag volgt op een Etoilys-advertentie
            die op ChatGPT wordt getoond. De site verzendt in deze conversiegebeurtenis expliciet
            geen ruwe gegevens die in het formulier zijn ingevoerd (naam, e-mail, telefoonnummer,
            adres, bericht); de gebeurtenis wordt alleen verzonden nadat uw aanvraag daadwerkelijk
            succesvol is bevestigd. Als de automatische advanced matching van OpenAI Ads voor deze
            bron is geactiveerd, kan deze afzonderlijk bepaalde ondersteunde klantgegevens
            rechtstreeks op de pagina detecteren en in gehashte (niet-leesbare) vorm naar OpenAI
            verzenden, onafhankelijk van de inhoud van deze gebeurtenis. Deze toestemming staat los
            van de toestemming die aan PostHog is gegeven en kan op elk moment worden ingetrokken in
            de voorkeuren, waardoor geen nieuwe gebeurtenis meer wordt verzonden.
          </p>
          <p className="mb-3">
            Na een uitdrukkelijke weigering, en alleen als de specifieke productie-instelling is
            ingeschakeld, kan maximaal één gebeurtenis zonder cookie per laadbeurt de landingspagina
            zonder query of fragment en de taal bevatten. Zij bevat geen campagne, UTM, AI-referrer,
            conversie of persistente identifier. Deze minimale meting kan afzonderlijk worden
            uitgeschakeld in de cookievoorkeuren.
          </p>
          <p>
            Het intrekken van toestemming stopt gedetailleerde tracking en verzendt geen nieuwe
            gebeurtenis op het huidige document. Minimale meting kan bij de volgende paginaweergave
            worden hervat, tenzij zij afzonderlijk is uitgeschakeld. Bij herladen voordat een keuze
            is gemaakt, gaat de tijdelijke acquisitiecontext verloren en kan deze niet aan een
            latere conversie worden gekoppeld.
          </p>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>10. Wijziging van dit beleid</h2>
          <p className="mb-3">
            ETOILYS kan dit privacybeleid op elk moment wijzigen, met name om rekening te houden met
            wettelijke, regelgevende of technische ontwikkelingen, of met wijzigingen in de
            verwerkingen die op de site worden uitgevoerd.
          </p>
          <p>
            De toepasselijke versie is de versie die op de datum van uw bezoek op de site is
            gepubliceerd.
          </p>
        </div>
      </>
    ),
  },
} as const satisfies Record<Locale, PrivacyPolicyContent>;
