import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export interface ApiSuccessBody {
  success: true;
  submissionId: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  error: string;
  errorCode?: ApiErrorCode;
  fieldErrors?: Record<string, string>;
  fieldErrorCodes?: Record<string, FieldErrorCode>;
}

export type ApiBody = ApiSuccessBody | ApiErrorBody;

export type PreferredLanguage = 'fr' | 'en' | 'nl';

export type ApiErrorCode =
  | 'METHOD_NOT_ALLOWED'
  | 'INVALID_JSON'
  | 'INVALID_PAYLOAD'
  | 'VALIDATION_FAILED'
  | 'TURNSTILE_INVALID'
  | 'RATE_LIMITED'
  | 'RATE_LIMIT_UNAVAILABLE'
  | 'INSERT_FAILED'
  | 'NOTIFICATION_FAILED';

export type FieldErrorCode = 'REQUIRED' | 'INVALID_EMAIL' | 'INVALID_PHONE';

export interface SubmissionRecordInput {
  formType: 'contact' | 'classement';
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  adresse?: string;
  message?: string;
  consentAccepted: boolean;
  consentVersion: string;
  preferredLanguage: PreferredLanguage;
  turnstileVerified: boolean;
  sourceIpHash: string | null;
  userAgent: string;
  payload: Record<string, unknown>;
}

export type PublicFormKind = 'contact' | 'classification-request';

interface ResendEmailInput {
  to: string[];
  replyToEmail: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
  idempotencyKey: string;
}

interface CustomerConfirmationInput {
  formKind: PublicFormKind;
  preferredLanguage: PreferredLanguage;
  firstName?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

export const normalizeText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export const normalizePreferredLanguage = (value: unknown): PreferredLanguage =>
  value === 'en' || value === 'nl' ? value : 'fr';

export const formatPreferredLanguageLabel = (preferredLanguage: PreferredLanguage): string =>
  preferredLanguage === 'en'
    ? 'anglais (en)'
    : preferredLanguage === 'nl'
      ? 'néerlandais (nl)'
      : 'français (fr)';

export const validateEmail = (value: string): boolean => emailRegex.test(value);

export const validatePhone = (value: string): boolean => phoneRegex.test(value.replace(/\s/g, ''));

const parseAllowedOrigins = (): string[] => {
  const raw = Deno.env.get('ALLOWED_ORIGINS') || '';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const resolveCorsOrigin = (origin: string | null): string => {
  const allowedOrigins = parseAllowedOrigins();
  if (allowedOrigins.length === 0) return '*';
  if (origin && allowedOrigins.includes(origin)) return origin;
  return allowedOrigins[0];
};

export const getCorsHeaders = (requestOrigin: string | null): Record<string, string> => ({
  'Access-Control-Allow-Origin': resolveCorsOrigin(requestOrigin),
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
  Vary: 'Origin',
});

export const jsonResponse = (
  status: number,
  body: ApiBody,
  requestOrigin: string | null
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: getCorsHeaders(requestOrigin),
  });

export const preflightResponse = (requestOrigin: string | null): Response =>
  new Response(null, {
    status: 204,
    headers: getCorsHeaders(requestOrigin),
  });

export const getClientIp = (req: Request): string | null => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || null;
  }

  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return null;
};

export const hashText = async (value: string): Promise<string> => {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const createAdminClient = (): SupabaseClient => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
};

export const verifyTurnstileToken = async (
  token: string,
  remoteIp: string | null
): Promise<{ success: boolean; error?: string }> => {
  if (Deno.env.get('BYPASS_TURNSTILE') === 'true') {
    return { success: true };
  }

  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) {
    return { success: false, error: 'TURNSTILE_SECRET_KEY manquant.' };
  }

  const payload = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    payload.set('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: payload,
  });

  if (!response.ok) {
    return { success: false, error: `Turnstile indisponible (${response.status}).` };
  }

  const data = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
  if (!data.success) {
    return { success: false, error: 'Verification anti-spam invalide.' };
  }

  return { success: true };
};

const parseLimit = (envName: string, fallback: number): number => {
  const value = Number(Deno.env.get(envName));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const enforceRateLimit = async (
  client: SupabaseClient,
  email: string,
  sourceIpHash: string | null
): Promise<{ allowed: boolean; error?: string; errorCode?: ApiErrorCode }> => {
  const hourlyIpLimit = parseLimit('FORM_RATE_LIMIT_IP_PER_HOUR', 10);
  const hourlyEmailLimit = parseLimit('FORM_RATE_LIMIT_EMAIL_PER_HOUR', 5);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  if (sourceIpHash) {
    const ipQuery = await client
      .from('form_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('source_ip_hash', sourceIpHash)
      .gte('created_at', oneHourAgo);

    if (ipQuery.error) {
      return {
        allowed: false,
        error: 'Impossible de verifier la limite anti-spam.',
        errorCode: 'RATE_LIMIT_UNAVAILABLE',
      };
    }

    if ((ipQuery.count || 0) >= hourlyIpLimit) {
      return {
        allowed: false,
        error: 'Trop de tentatives. Merci de reessayer plus tard.',
        errorCode: 'RATE_LIMITED',
      };
    }
  }

  const emailQuery = await client
    .from('form_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', oneHourAgo);

  if (emailQuery.error) {
    return {
      allowed: false,
      error: 'Impossible de verifier la limite anti-spam.',
      errorCode: 'RATE_LIMIT_UNAVAILABLE',
    };
  }

  if ((emailQuery.count || 0) >= hourlyEmailLimit) {
    return {
      allowed: false,
      error: 'Trop de tentatives. Merci de reessayer plus tard.',
      errorCode: 'RATE_LIMITED',
    };
  }

  return { allowed: true };
};

export const insertSubmission = async (
  client: SupabaseClient,
  input: SubmissionRecordInput
): Promise<{ submissionId?: string; error?: string }> => {
  const { data, error } = await client
    .from('form_submissions')
    .insert({
      form_type: input.formType,
      nom: input.nom,
      prenom: input.prenom || null,
      email: input.email,
      telephone: input.telephone || null,
      adresse: input.adresse || null,
      message: input.message || null,
      consent_accepted: input.consentAccepted,
      consent_version: input.consentVersion,
      turnstile_verified: input.turnstileVerified,
      source_ip_hash: input.sourceIpHash,
      user_agent: input.userAgent,
      payload_json: {
        ...input.payload,
        preferredLanguage: input.preferredLanguage,
      },
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    return { error: 'Insertion en base impossible.' };
  }

  return { submissionId: data.id };
};

export const markSubmissionAsNotified = async (
  client: SupabaseClient,
  submissionId: string
): Promise<void> => {
  await client
    .from('form_submissions')
    .update({
      status: 'notified',
      notified_at: new Date().toISOString(),
      notification_error: null,
    })
    .eq('id', submissionId);
};

export const markSubmissionNotificationFailed = async (
  client: SupabaseClient,
  submissionId: string,
  error: string
): Promise<void> => {
  await client
    .from('form_submissions')
    .update({
      status: 'notification_failed',
      notification_error: error,
    })
    .eq('id', submissionId);
};

export const markCustomerConfirmationSent = async (
  client: SupabaseClient,
  submissionId: string
): Promise<void> => {
  await client
    .from('form_submissions')
    .update({
      customer_confirmation_sent_at: new Date().toISOString(),
      customer_confirmation_error: null,
    })
    .eq('id', submissionId);
};

export const markCustomerConfirmationFailed = async (
  client: SupabaseClient,
  submissionId: string,
  error: string
): Promise<void> => {
  await client
    .from('form_submissions')
    .update({
      customer_confirmation_error: error,
    })
    .eq('id', submissionId);
};

const sanitizeOperationalError = (value: string): string => {
  const withoutEmails = value.replace(/[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+/g, '[email redacted]');
  return withoutEmails.slice(0, 500);
};

const formatResendFromEmail = (fromEmail: string): string =>
  fromEmail.includes('<') ? fromEmail : `Etoilys <${fromEmail}>`;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatGreeting = (preferredLanguage: PreferredLanguage, firstName?: string): string => {
  const normalizedFirstName = normalizeText(firstName);

  if (preferredLanguage === 'en') {
    return normalizedFirstName ? `Hello ${normalizedFirstName},` : 'Hello,';
  }

  if (preferredLanguage === 'nl') {
    return normalizedFirstName ? `Hallo ${normalizedFirstName},` : 'Hallo,';
  }

  return normalizedFirstName ? `Bonjour ${normalizedFirstName},` : 'Bonjour,';
};

const renderTransactionalHtml = (textBody: string, htmlLang: PreferredLanguage): string => {
  const paragraphs = textBody
    .split('\n\n')
    .map((paragraph) => paragraph.split('\n').map(escapeHtml).join('<br>'))
    .map((paragraph) => `<p style="margin:0 0 16px;">${paragraph}</p>`)
    .join('');

  return [
    '<!doctype html>',
    `<html lang="${htmlLang}">`,
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Etoilys</title>',
    '</head>',
    '<body style="margin:0;padding:0;background:#f7f8fb;color:#1f2937;font-family:Arial,sans-serif;">',
    '<div style="max-width:640px;margin:0 auto;padding:32px 20px;">',
    '<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:28px;">',
    '<p style="margin:0 0 24px;font-size:18px;font-weight:700;color:#0132b0;">Etoilys</p>',
    `<div style="font-size:16px;line-height:1.6;">${paragraphs}</div>`,
    '</div>',
    '</div>',
    '</body>',
    '</html>',
  ].join('');
};

export const buildCustomerConfirmationEmail = ({
  formKind,
  preferredLanguage,
  firstName,
}: CustomerConfirmationInput): { subject: string; textBody: string; htmlBody: string } => {
  const greeting = formatGreeting(preferredLanguage, firstName);

  if (preferredLanguage === 'en') {
    const subject =
      formKind === 'classification-request'
        ? 'We have received your classification request'
        : 'We have received your message';
    const textBody =
      formKind === 'classification-request'
        ? [
            greeting,
            'We have received your classification request.',
            'A member of the Etoilys team will contact you within one business day to discuss your property and the next steps in the classification process.',
            'Kind regards,',
            'The Etoilys team',
          ].join('\n\n')
        : [
            greeting,
            'We have received your message.',
            'A member of the Etoilys team will contact you within one business day.',
            'Kind regards,',
            'The Etoilys team',
          ].join('\n\n');

    return { subject, textBody, htmlBody: renderTransactionalHtml(textBody, preferredLanguage) };
  }

  if (preferredLanguage === 'nl') {
    const subject =
      formKind === 'classification-request'
        ? 'We hebben uw classificatieaanvraag goed ontvangen'
        : 'We hebben uw bericht goed ontvangen';
    const textBody =
      formKind === 'classification-request'
        ? [
            greeting,
            'We hebben uw aanvraag voor de classificatie van uw vakantiewoning goed ontvangen.',
            'Een medewerker van Etoilys neemt binnen één werkdag contact met u op om uw vakantiewoning en de volgende stappen van de classificatieprocedure te bespreken.',
            'Met vriendelijke groet,',
            'Het team van Etoilys',
          ].join('\n\n')
        : [
            greeting,
            'We hebben uw bericht goed ontvangen.',
            'Een medewerker van Etoilys neemt binnen één werkdag contact met u op.',
            'Met vriendelijke groet,',
            'Het team van Etoilys',
          ].join('\n\n');

    return { subject, textBody, htmlBody: renderTransactionalHtml(textBody, preferredLanguage) };
  }

  const subject =
    formKind === 'classification-request'
      ? 'Nous avons bien reçu votre demande de classement'
      : 'Nous avons bien reçu votre message';
  const textBody =
    formKind === 'classification-request'
      ? [
          greeting,
          'Nous avons bien reçu votre demande de classement.',
          "Un membre de l'équipe Etoilys vous recontactera sous 24 heures ouvrées afin d'échanger sur votre logement et d'organiser la suite de la démarche.",
          'Bien cordialement,',
          "L'équipe Etoilys",
        ].join('\n\n')
      : [
          greeting,
          'Nous avons bien reçu votre message.',
          "Un membre de l'équipe Etoilys vous recontactera sous 24 heures ouvrées.",
          'Bien cordialement,',
          "L'équipe Etoilys",
        ].join('\n\n');

  return { subject, textBody, htmlBody: renderTransactionalHtml(textBody, preferredLanguage) };
};

export const sendResendEmail = async ({
  to,
  replyToEmail,
  subject,
  textBody,
  htmlBody,
  idempotencyKey,
}: ResendEmailInput): Promise<{ success: boolean; error?: string }> => {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL');

  if (!apiKey || !fromEmail) {
    return { success: false, error: 'Configuration email incomplète (Resend).' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: formatResendFromEmail(fromEmail),
        to,
        reply_to: replyToEmail,
        subject,
        text: textBody,
        ...(htmlBody ? { html: htmlBody } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: sanitizeOperationalError(
          `Envoi email impossible (${response.status}): ${errorText}`
        ),
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: sanitizeOperationalError(error instanceof Error ? error.message : 'Erreur inconnue'),
    };
  }
};

export const sendResendNotification = async (
  subject: string,
  textBody: string,
  replyToEmail: string,
  idempotencyKey: string
): Promise<{ success: boolean; error?: string }> => {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL');
  const notifyTo = Deno.env.get('NOTIFY_TO_EMAIL');

  if (!apiKey || !fromEmail || !notifyTo) {
    return { success: false, error: 'Configuration email incomplète (Resend).' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: formatResendFromEmail(fromEmail),
      to: [notifyTo],
      reply_to: replyToEmail,
      subject,
      text: textBody,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      error: sanitizeOperationalError(`Envoi email impossible (${response.status}): ${errorText}`),
    };
  }

  return { success: true };
};

export const sendCustomerConfirmation = async (
  formKind: PublicFormKind,
  submissionId: string,
  customerEmail: string,
  preferredLanguage: PreferredLanguage,
  firstName?: string
): Promise<{ success: boolean; error?: string }> => {
  const notifyTo = Deno.env.get('NOTIFY_TO_EMAIL');
  if (!notifyTo) {
    return { success: false, error: 'Configuration email incomplète (Resend).' };
  }

  const confirmationEmail = buildCustomerConfirmationEmail({
    formKind,
    preferredLanguage,
    firstName,
  });

  return sendResendEmail({
    to: [customerEmail],
    replyToEmail: notifyTo,
    subject: confirmationEmail.subject,
    textBody: confirmationEmail.textBody,
    htmlBody: confirmationEmail.htmlBody,
    idempotencyKey: `${formKind}:${submissionId}:customer`,
  });
};
