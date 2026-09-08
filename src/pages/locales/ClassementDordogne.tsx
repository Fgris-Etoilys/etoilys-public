import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SmartImage from '../../components/ui/SmartImage';
import DepartmentPricingSection from '../../components/local/DepartmentPricingSection';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import { DORDOGNE_DEPARTMENT_PAGE } from '../../content/local/departments/dordogne';

const officialClassificationUrl =
  'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme';

const questions = [
  {
    question: 'Mon gîte ou mon appartement peut-il être classé ?',
    answer: (
      <>
        Maison de vacances, gîte rural, studio ou appartement : le classement concerne les meublés
        de tourisme, quelle que soit la plateforme sur laquelle ils sont proposés. Les critères
        dépendent notamment de la capacité, des équipements et de la catégorie visée.{' '}
        <Link to="/prerequis-au-classement">Consulter les prérequis.</Link>
      </>
    ),
  },
  {
    question: 'Dois-je déjà connaître le nombre d’étoiles à demander ?',
    answer: (
      <>
        Vous pouvez nous expliquer votre projet dès la demande. Notre simulateur vous aide aussi à
        repérer les critères de la catégorie envisagée. Son résultat est indicatif : seule la visite
        officielle permet d’évaluer le logement.{' '}
        <Link to="/simulateur">Explorer les critères avec le simulateur.</Link>
      </>
    ),
  },
  {
    question: 'Que se passe-t-il après ma demande ?',
    answer: (
      <>
        Etoilys vous recontacte pour préciser votre projet, confirmer la zone d’intervention et le
        tarif, puis convenir d’une date de visite. L’envoi du formulaire ne réserve pas
        automatiquement un créneau. Vous connaissez les modalités avant de valider la visite.
      </>
    ),
  },
  {
    question: 'Et si mon logement ne remplit pas tous les critères ?',
    answer: (
      <>
        L’inspecteur vous explique les points constatés. Selon le critère et ce que permet le
        référentiel, certains justificatifs ou compléments peuvent être transmis après la visite. La
        catégorie demandée n’est jamais garantie à l’avance.
      </>
    ),
  },
  {
    question: 'Le classement est-il obligatoire ? Combien de temps dure-t-il ?',
    answer: (
      <>
        Le classement est volontaire et valable cinq ans une fois acquis. Il ne remplace pas les
        formalités de déclaration ou d’enregistrement applicables à votre location.{' '}
        <a href={officialClassificationUrl} target="_blank" rel="noopener noreferrer">
          Voir le cadre officiel.
        </a>
      </>
    ),
  },
];

export default function ClassementDordogne() {
  return (
    <div className="dd-landing">
      <section className="dd-hero dd-container" aria-labelledby="dd-title">
        <div className="dd-hero-copy">
          <p className="dd-eyebrow">
            <span /> PROPRIÉTAIRES EN DORDOGNE
          </p>
          <h1 id="dd-title">
            Votre meublé.
            <br />
            Ses étoiles.
            <br />
            <em>En Dordogne.</em>
          </h1>
          <p className="dd-hero-description">
            Faites classer votre gîte, maison ou appartement avec Etoilys. Une visite officielle
            chez vous, un tarif clair et un interlocuteur pour avancer.
          </p>
          <Button href="/demande-classement" size="lg" className="dd-button">
            Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
          </Button>
          <p className="dd-cta-note">Nous vous recontactons pour organiser la visite.</p>
          <a href="#tarifs" className="dd-text-link dd-hero-price">
            D’abord, connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="dd-hero-visual">
          <figure className="dd-hero-photo">
            <SmartImage
              assetKey="dordogneInterior"
              alt="Les maisons de pierre de La Roque-Gageac au bord de la Dordogne"
              priority
              sizes="(min-width: 900px) 45vw, 100vw"
            />
            <figcaption>
              <MapPin size={14} aria-hidden="true" /> La Roque-Gageac, Dordogne
            </figcaption>
          </figure>
          <div className="dd-photo-note">
            <span className="dd-star-line" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={19} />
              ))}
            </span>
            <p>
              Du studio au grand gîte,
              <br />
              <strong>un classement de 1 à 5 étoiles.</strong>
            </p>
            <span>Selon les critères remplis par votre logement.</span>
          </div>
          <span className="dd-photo-index" aria-hidden="true">
            24 / LE PÉRIGORD
          </span>
        </div>
      </section>

      <div className="dd-proof-strip">
        <div className="dd-container dd-proof-inner">
          <div>
            <ShieldCheck size={27} strokeWidth={1.3} aria-hidden="true" />
            <p>
              <strong>Organisme accrédité</strong>
              <a href={COFRAC_ACCREDITATION_URL} target="_blank" rel="noopener noreferrer">
                Cofrac Inspection n° 3-2394 <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </p>
          </div>
          <div>
            <span className="dd-proof-number">5</span>
            <p>
              <strong>ans de validité</strong>
              <span>Une fois le classement acquis</span>
            </p>
          </div>
          <div>
            <MapPin size={26} strokeWidth={1.3} aria-hidden="true" />
            <p>
              <strong>Une équipe basée en Dordogne</strong>
              <span>À Mauzac et Grand Castang</span>
            </p>
          </div>
        </div>
      </div>

      <section
        id="le-classement"
        className="dd-section dd-container dd-benefits"
        aria-labelledby="dd-benefits-title"
      >
        <div className="dd-section-intro">
          <p className="dd-eyebrow">LE CLASSEMENT, POUR VOUS</p>
          <h2 id="dd-benefits-title">
            Bien plus qu’une étoile
            <br />
            sur votre annonce.
          </h2>
          <p>
            Vous avez soigné votre logement. Le classement lui donne un repère officiel de confort
            et de services, lisible pour vos voyageurs.
          </p>
        </div>
        <div className="dd-benefit-list">
          <article>
            <span className="dd-list-number">01</span>
            <div>
              <h3>Un repère qui inspire confiance</h3>
              <p>
                De 1 à 5 étoiles, une catégorie fondée sur un référentiel national. Une façon claire
                de présenter le niveau de votre location.
              </p>
            </div>
          </article>
          <article>
            <span className="dd-list-number">02</span>
            <div>
              <h3>Un cadre fiscal à considérer</h3>
              <p>
                Au régime micro-BIC, un meublé classé bénéficie, sous conditions, d’un abattement et
                d’un plafond de recettes plus élevés qu’un meublé non classé.
              </p>
              <a
                href="https://bofip.impots.gouv.fr/bofip/14765-PGP.html/ACTU-2025-00127"
                target="_blank"
                rel="noopener noreferrer"
                className="dd-small-link"
              >
                Les conditions du micro-BIC <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </article>
          <article>
            <span className="dd-list-number">03</span>
            <div>
              <h3>Une taxe de séjour par catégorie</h3>
              <p>
                Votre meublé classé relève du barème local de sa catégorie. L’intérêt dépend de la
                commune et de votre location.
              </p>
              <Link to="/simulateur-taxe-sejour" className="dd-small-link">
                Comparer pour ma location <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="dd-expertise" aria-labelledby="dd-expertise-title">
        <div className="dd-container dd-expertise-grid">
          <figure className="dd-stone-photo">
            <SmartImage
              assetKey="dordogneLandscape"
              alt="Architecture de pierre et végétation dans un village du Périgord"
              sizes="(min-width: 900px) 35vw, 100vw"
            />
            <figcaption>Le Périgord, notre point d’ancrage.</figcaption>
          </figure>
          <div className="dd-expertise-copy">
            <p className="dd-eyebrow">POURQUOI ETOILYS</p>
            <h2 id="dd-expertise-title">
              Le sérieux d’un organisme accrédité.
              <br />
              <em>La proximité en plus.</em>
            </h2>
            <p>
              Basés en Dordogne, nous nous consacrons au classement des meublés de tourisme. Notre
              rôle : évaluer votre logement avec rigueur et rendre la démarche compréhensible à
              chaque étape.
            </p>
            <ul className="dd-checks">
              <li>
                <Check size={18} aria-hidden="true" />
                <span>Un tarif et des modalités confirmés avant de fixer la visite.</span>
              </li>
              <li>
                <Check size={18} aria-hidden="true" />
                <span>Une évaluation sur place, selon le référentiel officiel.</span>
              </li>
              <li>
                <Check size={18} aria-hidden="true" />
                <span>
                  Le rapport, la grille de contrôle et la proposition de classement après la visite.
                </span>
              </li>
            </ul>
            <a
              href={COFRAC_ACCREDITATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dd-text-link"
            >
              Consulter notre portée d’accréditation <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="tarifs"
        className="dd-section dd-container dd-tariff-section"
        aria-labelledby="dd-tariff-title"
      >
        <div className="dd-tariff-copy">
          <p className="dd-eyebrow">VOTRE LOGEMENT, VOTRE TARIF</p>
          <h2 id="dd-tariff-title">
            Commençons par
            <br />
            <em>votre commune.</em>
          </h2>
          <p>
            Consultez le tarif prévu pour votre meublé. Etoilys confirme ensuite les conditions et
            la possibilité d’intervenir à votre adresse.
          </p>
          <p className="dd-area-label">
            <MapPin size={17} aria-hidden="true" /> Ancrés en Dordogne
          </p>
          <p className="dd-area-copy">
            Bergeracois, Périgord Noir, vallées de la Dordogne et de la Vézère, Grand Périgueux,
            vallée de l’Isle, Ribéracois et secteurs proches.
          </p>
          <Link to="/zones-intervention" className="dd-text-link">
            Voir nos zones d’intervention <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {DORDOGNE_DEPARTMENT_PAGE.pricing && (
          <DepartmentPricingSection config={DORDOGNE_DEPARTMENT_PAGE.pricing} variant="dordogne" />
        )}
      </section>

      <section id="etapes" className="dd-process" aria-labelledby="dd-process-title">
        <div className="dd-container">
          <div className="dd-process-heading">
            <div>
              <p className="dd-eyebrow">DE LA DEMANDE AUX ÉTOILES</p>
              <h2 id="dd-process-title">Vous savez où vous allez.</h2>
            </div>
            <Link to="/procedure" className="dd-text-link">
              La procédure en détail <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <ol className="dd-steps">
            <li>
              <span>01</span>
              <h3>
                Vous nous parlez
                <br />
                de votre logement.
              </h3>
              <p>
                Envoyez vos coordonnées et l’adresse du meublé. Vous pouvez préciser votre projet
                dans le message.
              </p>
            </li>
            <li>
              <span>02</span>
              <h3>
                Nous préparons
                <br />
                la visite ensemble.
              </h3>
              <p>
                Nous vous recontactons pour confirmer le tarif, les modalités et convenir d’une
                date.
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>
                Votre logement
                <br />
                est évalué sur place.
              </h3>
              <p>
                Après le contrôle selon la grille officielle, vous recevez les documents et la
                proposition de classement.
              </p>
            </li>
          </ol>
          <p className="dd-process-note">
            La catégorie dépend des critères remplis. Une fois acquis, le classement est valable 5
            ans.
          </p>
        </div>
      </section>

      <section className="dd-section dd-container dd-faq" aria-labelledby="dd-faq-title">
        <div>
          <p className="dd-eyebrow">AVANT DE VOUS LANCER</p>
          <h2 id="dd-faq-title">
            Les dernières
            <br />
            questions.
          </h2>
          <p>Un point particulier sur votre logement ?</p>
          <Link to="/contact" className="dd-text-link">
            Parlons-en <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="dd-faq-list">
          {questions.map(({ question, answer }) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <div>{answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="dd-final" aria-labelledby="dd-final-title">
        <div className="dd-container dd-final-inner">
          <div>
            <p className="dd-eyebrow">À VOUS DE JOUER</p>
            <h2 id="dd-final-title">
              La prochaine étape ?<br />
              <em>Parlons de votre meublé.</em>
            </h2>
            <p>
              Indiquez-nous votre projet en Dordogne.
              <br />
              Nous vous recontactons pour organiser la suite.
            </p>
          </div>
          <div className="dd-final-action">
            <Button href="/demande-classement" size="lg" className="dd-button dd-button-light">
              Demander mon classement <ArrowRight size={20} aria-hidden="true" />
            </Button>
            <span>Tarif confirmé avant tout engagement.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
