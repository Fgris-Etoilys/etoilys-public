import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export interface ApiSuccessBody {
  success: true;
  submissionId: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type ApiBody = ApiSuccessBody | ApiErrorBody;

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
  turnstileVerified: boolean;
  sourceIpHash: string | null;
  userAgent: string;
  payload: Record<string, unknown>;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

export const normalizeText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

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
): Promise<{ allowed: boolean; error?: string }> => {
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
      return { allowed: false, error: 'Impossible de verifier la limite anti-spam.' };
    }

    if ((ipQuery.count || 0) >= hourlyIpLimit) {
      return { allowed: false, error: 'Trop de tentatives. Merci de reessayer plus tard.' };
    }
  }

  const emailQuery = await client
    .from('form_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', oneHourAgo);

  if (emailQuery.error) {
    return { allowed: false, error: 'Impossible de verifier la limite anti-spam.' };
  }

  if ((emailQuery.count || 0) >= hourlyEmailLimit) {
    return { allowed: false, error: 'Trop de tentatives. Merci de reessayer plus tard.' };
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
      payload_json: input.payload,
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

export const sendResendNotification = async (
  subject: string,
  textBody: string,
  replyToEmail: string
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
    },
    body: JSON.stringify({
      from: fromEmail,
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
      error: `Envoi email impossible (${response.status}): ${errorText}`,
    };
  }

  return { success: true };
};
