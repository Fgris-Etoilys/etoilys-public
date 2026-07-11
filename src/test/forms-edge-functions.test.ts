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
    expect(shared).toContain("value === 'en' ? 'en' : 'fr'");
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

    expect(shared).toContain("preferredLanguage === 'en' ? 'anglais (en)' : 'français (fr)'");
    expect(contact).toContain('Langue préférée:');
    expect(classement).toContain('Langue préférée:');
    expect(contact).toContain('formatPreferredLanguageLabel(preferredLanguage)');
    expect(classement).toContain('formatPreferredLanguageLabel(preferredLanguage)');
    expect(contact).toMatch(
      /sendResendNotification\([\s\S]*Langue préférée:[\s\S]*formatPreferredLanguageLabel\(preferredLanguage\)[\s\S]*email\s*\)/
    );
    expect(classement).toMatch(
      /sendResendNotification\([\s\S]*Langue préférée:[\s\S]*formatPreferredLanguageLabel\(preferredLanguage\)[\s\S]*email\s*\)/
    );
  });

  it('sends the assembled text body to Resend without dropping preferred language', () => {
    const shared = readRepoFile('supabase/functions/_shared/formSubmission.ts');

    expect(shared).toContain('textBody: string');
    expect(shared).toContain('text: textBody');
    expect(shared).toContain('reply_to: replyToEmail');
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
