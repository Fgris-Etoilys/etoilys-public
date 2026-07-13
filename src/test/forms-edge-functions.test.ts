import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readRepoFile = (relativePath: string): string =>
  readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');

const readMigrationFiles = (): string[] => {
  const migrationDir = path.resolve(process.cwd(), 'supabase/migrations');
  return readdirSync(migrationDir)
    .filter((fileName) => fileName.endsWith('.sql'))
    .map((fileName) => readFileSync(path.join(migrationDir, fileName), 'utf8'));
};

describe('public form Edge Functions i18n contract', () => {
  it('normalizes preferredLanguage on the server and stores it in payload_json', () => {
    const shared = readRepoFile('supabase/functions/_shared/formSubmission.ts');
    const contact = readRepoFile('supabase/functions/public-forms-contact/index.ts');
    const classement = readRepoFile('supabase/functions/public-forms-classement/index.ts');

    expect(shared).toContain('normalizePreferredLanguage');
    expect(shared).toContain("value === 'en' || value === 'nl' ? value : 'fr'");
    expect(shared).toContain('preferredLanguage: input.preferredLanguage');
    expect(contact).toContain('const preferredLanguage = normalizePreferredLanguage');
    expect(classement).toContain('const preferredLanguage = normalizePreferredLanguage');
    expect(contact).toContain('preferredLanguage,');
    expect(classement).toContain('preferredLanguage,');
  });

  it('adds preferred language to internal notification emails', () => {
    const shared = readRepoFile('supabase/functions/_shared/formSubmission.ts');
    const contact = readRepoFile('supabase/functions/public-forms-contact/index.ts');
    const classement = readRepoFile('supabase/functions/public-forms-classement/index.ts');

    expect(shared).toContain("preferredLanguage === 'nl'");
    expect(shared).toContain('néerlandais (nl)');
    expect(contact).toContain('Langue préférée:');
    expect(classement).toContain('Langue préférée:');
    expect(contact).toContain('formatPreferredLanguageLabel(preferredLanguage)');
    expect(classement).toContain('formatPreferredLanguageLabel(preferredLanguage)');
    expect(contact).toMatch(
      /sendResendNotification\([\s\S]*Langue préférée:[\s\S]*formatPreferredLanguageLabel\(preferredLanguage\)[\s\S]*contact:\$\{submissionId\}:internal/
    );
    expect(classement).toMatch(
      /sendResendNotification\([\s\S]*Langue préférée:[\s\S]*formatPreferredLanguageLabel\(preferredLanguage\)[\s\S]*classification-request:\$\{submissionId\}:internal/
    );
  });

  it('sends Resend emails with idempotency keys and the existing reply address', () => {
    const shared = readRepoFile('supabase/functions/_shared/formSubmission.ts');
    const contact = readRepoFile('supabase/functions/public-forms-contact/index.ts');
    const classement = readRepoFile('supabase/functions/public-forms-classement/index.ts');

    expect(shared).toContain('textBody: string');
    expect(shared).toContain('text: textBody');
    expect(shared).toContain('reply_to: replyToEmail');
    expect(shared).toContain("'Idempotency-Key': idempotencyKey");
    expect(shared).toContain('formatResendFromEmail(fromEmail)');
    expect(shared).toContain('Etoilys <${fromEmail}>');
    expect(contact).toContain('`contact:${submissionId}:internal`');
    expect(contact).toContain(
      "sendCustomerConfirmation('contact', submissionId, email, preferredLanguage)"
    );
    expect(classement).toContain('`classification-request:${submissionId}:internal`');
    expect(classement).toMatch(
      /sendCustomerConfirmation\(\s*'classification-request',\s*submissionId,\s*email,\s*preferredLanguage,\s*prenom\s*\)/
    );
    expect(shared).toContain('idempotencyKey: `${formKind}:${submissionId}:customer`');
    expect(shared).not.toContain('idempotencyKey: customerEmail');
    expect(shared).not.toContain('idempotencyKey: email');
  });

  it('builds localized customer confirmation emails for French, English and Dutch', () => {
    const shared = readRepoFile('supabase/functions/_shared/formSubmission.ts');

    expect(shared).toContain('buildCustomerConfirmationEmail');
    expect(shared).toContain('Nous avons bien reçu votre demande de classement');
    expect(shared).toContain('Nous avons bien reçu votre message');
    expect(shared).toContain('sous 24 heures ouvrées');
    expect(shared).toContain('We have received your classification request');
    expect(shared).toContain('We have received your message');
    expect(shared).toContain('within one business day');
    expect(shared).toContain('We hebben uw classificatieaanvraag goed ontvangen');
    expect(shared).toContain('We hebben uw bericht goed ontvangen');
    expect(shared).toContain('binnen één werkdag');
    expect(shared).toContain("preferredLanguage === 'nl'");
    expect(shared).toContain(
      "return normalizedFirstName ? `Hallo ${normalizedFirstName},` : 'Hallo,'"
    );
    expect(shared).toContain(
      'const renderTransactionalHtml = (textBody: string, htmlLang: PreferredLanguage)'
    );
    expect(shared).toContain('<html lang="${htmlLang}">');
    expect(shared).toContain('renderTransactionalHtml(textBody, preferredLanguage)');
  });

  it('tracks internal and customer email failures independently after insert success', () => {
    const shared = readRepoFile('supabase/functions/_shared/formSubmission.ts');
    const contact = readRepoFile('supabase/functions/public-forms-contact/index.ts');
    const classement = readRepoFile('supabase/functions/public-forms-classement/index.ts');

    expect(shared).toContain('markCustomerConfirmationSent');
    expect(shared).toContain('markCustomerConfirmationFailed');
    expect(shared).toContain('customer_confirmation_sent_at');
    expect(shared).toContain('customer_confirmation_error');
    expect(contact).toContain('Promise.allSettled');
    expect(classement).toContain('Promise.allSettled');
    expect(contact).not.toContain("errorCode: 'NOTIFICATION_FAILED'");
    expect(classement).not.toContain("errorCode: 'NOTIFICATION_FAILED'");
    expect(contact).toContain('markSubmissionNotificationFailed(adminClient, submissionId');
    expect(contact).toContain('markCustomerConfirmationFailed(adminClient, submissionId');
    expect(classement).toContain('markSubmissionNotificationFailed(adminClient, submissionId');
    expect(classement).toContain('markCustomerConfirmationFailed(adminClient, submissionId');
  });

  it('does not attempt email sending before a successful insert', () => {
    const contact = readRepoFile('supabase/functions/public-forms-contact/index.ts');
    const classement = readRepoFile('supabase/functions/public-forms-classement/index.ts');

    expect(contact).toMatch(
      /if \(!insertResult\.submissionId\) \{[\s\S]*errorCode: 'INSERT_FAILED'[\s\S]*\}\s*const submissionId = insertResult\.submissionId;[\s\S]*Promise\.allSettled/
    );
    expect(classement).toMatch(
      /if \(!insertResult\.submissionId\) \{[\s\S]*errorCode: 'INSERT_FAILED'[\s\S]*\}\s*const submissionId = insertResult\.submissionId;[\s\S]*Promise\.allSettled/
    );
  });

  it('returns stable backend error codes without adding a preferredLanguage column', () => {
    const shared = readRepoFile('supabase/functions/_shared/formSubmission.ts');
    const contact = readRepoFile('supabase/functions/public-forms-contact/index.ts');
    const classement = readRepoFile('supabase/functions/public-forms-classement/index.ts');

    expect(shared).toContain('type ApiErrorCode');
    expect(shared).toContain('type FieldErrorCode');
    expect(contact).toContain('errorCode:');
    expect(contact).toContain('fieldErrorCodes');
    expect(classement).toContain('errorCode:');
    expect(classement).toContain('fieldErrorCodes');

    const migrations = readMigrationFiles().join('\n');
    expect(migrations).not.toMatch(/preferred_?language/i);
  });
});
