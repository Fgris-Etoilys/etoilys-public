import {
  createAdminClient,
  enforceRateLimit,
  formatPreferredLanguageLabel,
  getClientIp,
  hashText,
  insertSubmission,
  jsonResponse,
  markSubmissionAsNotified,
  markSubmissionNotificationFailed,
  normalizeText,
  normalizePreferredLanguage,
  preflightResponse,
  sendResendNotification,
  validateEmail,
  verifyTurnstileToken,
  type FieldErrorCode,
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
        errorCode: 'METHOD_NOT_ALLOWED',
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
        errorCode: 'INVALID_JSON',
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
        errorCode: 'INVALID_PAYLOAD',
      },
      requestOrigin
    );
  }

  const nom = normalizeText(body.nom);
  const email = normalizeText(body.email).toLowerCase();
  const message = normalizeText(body.message);
  const consentAccepted = body.consent === true;
  const consentVersion = normalizeText(body.consentVersion);
  const preferredLanguage = normalizePreferredLanguage(body.preferredLanguage);
  const turnstileToken = normalizeText(body.turnstileToken);
  const fieldErrors: Record<string, string> = {};
  const fieldErrorCodes: Record<string, FieldErrorCode> = {};

  if (!nom) {
    fieldErrors.nom = 'Le nom est requis.';
    fieldErrorCodes.nom = 'REQUIRED';
  }
  if (!email) {
    fieldErrors.email = 'L email est requis.';
    fieldErrorCodes.email = 'REQUIRED';
  }
  if (email && !validateEmail(email)) {
    fieldErrors.email = 'L email n est pas valide.';
    fieldErrorCodes.email = 'INVALID_EMAIL';
  }
  if (!message) {
    fieldErrors.message = 'Le message est requis.';
    fieldErrorCodes.message = 'REQUIRED';
  }
  if (!consentAccepted) {
    fieldErrors.consent = 'Le consentement est requis.';
    fieldErrorCodes.consent = 'REQUIRED';
  }
  if (!consentVersion) {
    fieldErrors.consentVersion = 'La version de consentement est requise.';
    fieldErrorCodes.consentVersion = 'REQUIRED';
  }
  if (!turnstileToken) {
    fieldErrors.turnstileToken = 'La verification anti-spam est requise.';
    fieldErrorCodes.turnstileToken = 'REQUIRED';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(
      400,
      {
        success: false,
        error: 'Donnees invalides.',
        errorCode: 'VALIDATION_FAILED',
        fieldErrors,
        fieldErrorCodes,
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
        errorCode: 'TURNSTILE_INVALID',
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
        errorCode: rateLimit.errorCode || 'RATE_LIMITED',
      },
      requestOrigin
    );
  }

  const insertResult = await insertSubmission(adminClient, {
    formType: 'contact',
    nom,
    email,
    message,
    consentAccepted,
    consentVersion,
    preferredLanguage,
    turnstileVerified: true,
    sourceIpHash,
    userAgent,
    payload: {
      nom,
      email,
      message,
      consent: consentAccepted,
      consentVersion,
      preferredLanguage,
    },
  });

  if (!insertResult.submissionId) {
    return jsonResponse(
      500,
      {
        success: false,
        error: insertResult.error || 'Impossible d enregistrer la demande.',
        errorCode: 'INSERT_FAILED',
      },
      requestOrigin
    );
  }

  const notification = await sendResendNotification(
    '[Etoilys] Nouveau formulaire de contact',
    [
      `Submission ID: ${insertResult.submissionId}`,
      `Langue préférée: ${formatPreferredLanguageLabel(preferredLanguage)}`,
      `Nom: ${nom}`,
      `Email: ${email}`,
      `Message:`,
      message,
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
        errorCode: 'NOTIFICATION_FAILED',
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
