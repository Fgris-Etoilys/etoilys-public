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
    lastUpdated: 'Dernière mise à jour : 1 mai 2026',
    cookiePreferencesLabel: 'Gérer mes cookies',
    body: undefined,
  },
  en: {
    title: 'Privacy policy',
    lastUpdated: 'Last updated: May 1, 2026',
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
              <strong className={strongClassName}>audience measurement data</strong>: browsing
              journey, pages viewed, interactions with buttons, forms and simulators, only after
              analytics consent has been accepted.
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
              <strong className={strongClassName}>Supabase</strong> for certain technical or
              processing functions;
            </li>
            <li>
              <strong className={strongClassName}>Resend</strong> for email routing;
            </li>
            <li>
              <strong className={strongClassName}>Cloudflare Turnstile</strong> for anti-bot
              protection on forms;
            </li>
            <li>
              <strong className={strongClassName}>PostHog</strong> for audience measurement and
              journey analysis, only after analytics consent has been accepted.
            </li>
          </ul>
          <p className="mb-3">
            ETOILYS does not voluntarily send PostHog any name, email address, phone number, postal
            address or free-text message content entered in forms.
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
            The cookie management mechanism allows you to accept, refuse or change your choice
            relating to audience measurement. This choice is kept for 6 months, after which a new
            choice may be requested.
          </p>
          <p>
            In this respect, PostHog is used on the site only after analytics consent has been
            accepted. The events sent are limited to journey information and values grouped by
            ranges; full URLs, query parameters and free-text form content are not voluntarily
            transmitted.
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
} as const satisfies Record<Locale, PrivacyPolicyContent>;
