import type { Locale } from './locales';

export const cookieConsentContent = {
  fr: {
    bannerAriaLabel: 'Gestion des cookies',
    bannerTitle: 'Vos choix de cookies',
    bannerText:
      'Nous utilisons des cookies pour comprendre comment vous utilisez le site et mesurer l’efficacité de nos publicités. Vous pouvez tout accepter, tout refuser ou choisir ce que vous autorisez.',
    rejectAllLabel: 'Tout refuser',
    customizeLabel: 'Personnaliser',
    acceptAllLabel: 'Tout accepter',
    learnMoreLabel: 'En savoir plus',
    privacyLinkLabel: 'Politique de confidentialité',
    preferencesTitle: 'Vos préférences de cookies',
    preferencesIntro:
      'Choisissez ce que vous autorisez. Vous pourrez modifier vos choix à tout moment depuis le bas de page.',
    closePreferencesLabel: 'Fermer les préférences',
    necessaryTitle: 'Essentiels',
    necessaryText:
      'Ils permettent au site de fonctionner, de sécuriser les formulaires et de mémoriser vos choix.',
    alwaysActiveLabel: 'Toujours actifs',
    analyticsTitle: 'Améliorer le site',
    analyticsText:
      'Comprendre les pages consultées et l’utilisation de nos formulaires et simulateurs.',
    analyticsTool: 'Outil utilisé : PostHog',
    advertisingTitle: 'Mesurer nos publicités',
    advertisingText: 'Savoir si nos publicités donnent lieu à une demande de classement.',
    advertisingTool: 'Outil utilisé : OpenAI Ads',
    advertisingMatchingText:
      'OpenAI Ads peut utiliser une version hachée de certaines coordonnées saisies dans le formulaire pour relier une demande à une publicité. Le détail des données utilisées figure dans notre politique de confidentialité.',
    cookielessTitle: 'Statistiques de fréquentation sans cookies',
    cookielessText:
      'Un comptage limité des pages d’entrée nous aide à suivre la fréquentation du site. Vous pouvez aussi le désactiver.',
    enabledLabel: 'Activé',
    disabledLabel: 'Désactivé',
    saveLabel: 'Enregistrer mes choix',
    savedMessage: 'Vos choix ont été enregistrés.',
    memoryOnlyMessage:
      'Vos choix sont appliqués pour cette visite, mais n’ont pas pu être mémorisés.',
  },
  en: {
    bannerAriaLabel: 'Cookie management',
    bannerTitle: 'Your cookie choices',
    bannerText:
      'We use cookies to understand how you use the site and measure the effectiveness of our ads. You can accept all, reject all or choose what you allow.',
    rejectAllLabel: 'Reject all',
    customizeLabel: 'Customize',
    acceptAllLabel: 'Accept all',
    learnMoreLabel: 'Learn more',
    privacyLinkLabel: 'Privacy policy',
    preferencesTitle: 'Your cookie preferences',
    preferencesIntro:
      'Choose what you allow. You can change your choices at any time using the link at the bottom of the page.',
    closePreferencesLabel: 'Close preferences',
    necessaryTitle: 'Essential',
    necessaryText: 'These help the site work, keep forms secure and remember your choices.',
    alwaysActiveLabel: 'Always active',
    analyticsTitle: 'Improve the site',
    analyticsText: 'Understand viewed pages and how our forms and simulators are used.',
    analyticsTool: 'Tool used: PostHog',
    advertisingTitle: 'Measure our ads',
    advertisingText: 'Know whether our ads lead to a classification request.',
    advertisingTool: 'Tool used: OpenAI Ads',
    advertisingMatchingText:
      'OpenAI Ads may use a hashed version of some contact details entered in the form to connect a request with an ad. Details of the data used are provided in our privacy policy.',
    cookielessTitle: 'Cookieless traffic statistics',
    cookielessText:
      'A limited count of landing pages helps us monitor site traffic. You can also disable it.',
    enabledLabel: 'Enabled',
    disabledLabel: 'Disabled',
    saveLabel: 'Save my choices',
    savedMessage: 'Your choices have been saved.',
    memoryOnlyMessage: 'Your choices apply for this visit, but could not be saved for later.',
  },
  nl: {
    bannerAriaLabel: 'Cookiebeheer',
    bannerTitle: 'Uw cookiekeuzes',
    bannerText:
      'We gebruiken cookies om te begrijpen hoe u de website gebruikt en om de effectiviteit van onze advertenties te meten. U kunt alles accepteren, alles weigeren of zelf kiezen wat u toestaat.',
    rejectAllLabel: 'Alles weigeren',
    customizeLabel: 'Aanpassen',
    acceptAllLabel: 'Alles accepteren',
    learnMoreLabel: 'Meer informatie',
    privacyLinkLabel: 'Privacybeleid',
    preferencesTitle: 'Uw cookievoorkeuren',
    preferencesIntro:
      'Kies wat u toestaat. U kunt uw keuzes op elk moment wijzigen via de link onderaan de pagina.',
    closePreferencesLabel: 'Voorkeuren sluiten',
    necessaryTitle: 'Noodzakelijk',
    necessaryText:
      'Deze zorgen ervoor dat de website werkt, formulieren worden beveiligd en uw keuzes worden onthouden.',
    alwaysActiveLabel: 'Altijd actief',
    analyticsTitle: 'Website verbeteren',
    analyticsText:
      'Inzicht krijgen in bekeken pagina’s en het gebruik van onze formulieren en simulatoren.',
    analyticsTool: 'Gebruikt hulpmiddel: PostHog',
    advertisingTitle: 'Onze advertenties meten',
    advertisingText: 'Weten of onze advertenties leiden tot een classificatieaanvraag.',
    advertisingTool: 'Gebruikt hulpmiddel: OpenAI Ads',
    advertisingMatchingText:
      'OpenAI Ads kan een gehashte versie gebruiken van bepaalde contactgegevens die in het formulier zijn ingevuld om een aanvraag aan een advertentie te koppelen. Details over de gebruikte gegevens staan in ons privacybeleid.',
    cookielessTitle: 'Bezoekersstatistieken zonder cookies',
    cookielessText:
      'Een beperkte telling van landingspagina’s helpt ons het websiteverkeer te volgen. U kunt dit ook uitschakelen.',
    enabledLabel: 'Ingeschakeld',
    disabledLabel: 'Uitgeschakeld',
    saveLabel: 'Mijn keuzes opslaan',
    savedMessage: 'Uw keuzes zijn opgeslagen.',
    memoryOnlyMessage: 'Uw keuzes gelden voor dit bezoek, maar konden niet worden bewaard.',
  },
} as const satisfies Record<
  Locale,
  {
    bannerAriaLabel: string;
    bannerTitle: string;
    bannerText: string;
    rejectAllLabel: string;
    customizeLabel: string;
    acceptAllLabel: string;
    learnMoreLabel: string;
    privacyLinkLabel: string;
    preferencesTitle: string;
    preferencesIntro: string;
    closePreferencesLabel: string;
    necessaryTitle: string;
    necessaryText: string;
    alwaysActiveLabel: string;
    analyticsTitle: string;
    analyticsText: string;
    analyticsTool: string;
    advertisingTitle: string;
    advertisingText: string;
    advertisingTool: string;
    advertisingMatchingText: string;
    cookielessTitle: string;
    cookielessText: string;
    enabledLabel: string;
    disabledLabel: string;
    saveLabel: string;
    savedMessage: string;
    memoryOnlyMessage: string;
  }
>;
