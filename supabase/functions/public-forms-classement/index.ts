import {
  createAdminClient,
  enforceRateLimit,
  getClientIp,
  hashText,
  insertSubmission,
  jsonResponse,
  markSubmissionAsNotified,
  markSubmissionNotificationFailed,
  normalizeText,
  preflightResponse,
  sendResendNotification,
  validateEmail,
  validatePhone,
  verifyTurnstileToken,
} from '../_shared/formSubmission.ts';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

Deno.serve(async (req) => {
  const requestOrigin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return preflightResponse(requestOrigin);
  }

  if (req.method !== 'POST') {
    return jsonResponse(
      405,
      {
        success: false,
        error: 'Methode non autorisee.',
      },
      requestOrigin
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(
      400,
      {
        success: false,
        error: 'Payload JSON invalide.',
      },
      requestOrigin
    );
  }

  if (!isRecord(body)) {
    return jsonResponse(
      400,
      {
        success: false,
        error: 'Payload JSON invalide.',
      },
      requestOrigin
    );
  }

  const nom = normalizeText(body.nom);
  const prenom = normalizeText(body.prenom);
  const email = normalizeText(body.email).toLowerCase();
  const telephone = normalizeText(body.telephone);
  const adresse = normalizeText(body.adresse);
  const message = normalizeText(body.message);
  const consentAccepted = body.consent === true;
  const consentVersion = normalizeText(body.consentVersion);
  const turnstileToken = normalizeText(body.turnstileToken);
  const fieldErrors: Record<string, string> = {};

  if (!nom) fieldErrors.nom = 'Le nom est requis.';
  if (!prenom) fieldErrors.prenom = 'Le prenom est requis.';
  if (!email) fieldErrors.email = 'L email est requis.';
  if (email && !validateEmail(email)) fieldErrors.email = 'L email n est pas valide.';
  if (!telephone) fieldErrors.telephone = 'Le telephone est requis.';
  if (telephone && !validatePhone(telephone)) {
    fieldErrors.telephone = 'Le numero de telephone n est pas valide.';
  }
  if (!adresse) fieldErrors.adresse = 'L adresse est requise.';
  if (!consentAccepted) fieldErrors.consent = 'Le consentement est requis.';
  if (!consentVersion) fieldErrors.consentVersion = 'La version de consentement est requise.';
  if (!turnstileToken) {
    fieldErrors.turnstileToken = 'La verification anti-spam est requise.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(
      400,
      {
        success: false,
        error: 'Donnees invalides.',
        fieldErrors,
      },
      requestOrigin
    );
  }

  const clientIp = getClientIp(req);
  const sourceIpHash = clientIp ? await hashText(clientIp) : null;
  const userAgent = req.headers.get('user-agent') || 'unknown';

  const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    return jsonResponse(
      403,
      {
        success: false,
        error: turnstileCheck.error || 'Verification anti-spam invalide.',
      },
      requestOrigin
    );
  }

  const adminClient = createAdminClient();
  const rateLimit = await enforceRateLimit(adminClient, email, sourceIpHash);
  if (!rateLimit.allowed) {
    return jsonResponse(
      429,
      {
        success: false,
        error: rateLimit.error || 'Trop de tentatives. Merci de reessayer plus tard.',
      },
      requestOrigin
    );
  }

  const insertResult = await insertSubmission(adminClient, {
    formType: 'classement',
    nom,
    prenom,
    email,
    telephone,
    adresse,
    message,
    consentAccepted,
    consentVersion,
    turnstileVerified: true,
    sourceIpHash,
    userAgent,
    payload: {
      nom,
      prenom,
      email,
      telephone,
      adresse,
      message,
      consent: consentAccepted,
      consentVersion,
    },
  });

  if (!insertResult.submissionId) {
    return jsonResponse(
      500,
      {
        success: false,
        error: insertResult.error || 'Impossible d enregistrer la demande.',
      },
      requestOrigin
    );
  }

  const notification = await sendResendNotification(
    '[Etoilys] Nouvelle demande de classement',
    [
      `Submission ID: ${insertResult.submissionId}`,
      `Nom: ${nom}`,
      `Prenom: ${prenom}`,
      `Email: ${email}`,
      `Telephone: ${telephone}`,
      `Adresse: ${adresse}`,
      `Message:`,
      message || '(non renseigne)',
    ].join('\n'),
    email
  );

  if (!notification.success) {
    await markSubmissionNotificationFailed(
      adminClient,
      insertResult.submissionId,
      notification.error || 'Erreur inconnue'
    );

    return jsonResponse(
      500,
      {
        success: false,
        error: 'Demande enregistree mais notification indisponible. Merci de reessayer plus tard.',
      },
      requestOrigin
    );
  }

  await markSubmissionAsNotified(adminClient, insertResult.submissionId);

  return jsonResponse(
    200,
    {
      success: true,
      submissionId: insertResult.submissionId,
      message: 'Votre demande a ete envoyee avec succes.',
    },
    requestOrigin
  );
});
