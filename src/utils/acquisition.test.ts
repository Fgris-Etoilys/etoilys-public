import { describe, expect, it } from 'vitest';
import {
  captureVolatileAcquisitionContext,
  classifyConsentedAcquisition,
  getAudienceLandingProperties,
  normalizeAcquisitionSource,
} from './acquisition';

describe('acquisition', () => {
  it('captures UTM and referrer values only in a volatile context', () => {
    const context = captureVolatileAcquisitionContext({
      locationHref:
        'https://www.etoilys.fr/en/contact?utm_source=chatgpt.com&utm_medium=referral#form',
      referrer: 'https://chatgpt.com/c/secret',
    });

    expect(context).toEqual({
      landingPage: '/en/contact',
      locale: 'en',
      utmSource: 'chatgpt.com',
      utmMedium: 'referral',
      initialReferrer: 'https://chatgpt.com/c/secret',
    });
    expect(getAudienceLandingProperties(context)).toEqual({
      landing_page: '/en/contact',
      locale: 'en',
    });
  });

  it.each([
    ['chatgpt.com', 'chatgpt'],
    ['perplexity.ai', 'perplexity'],
    ['claude.ai', 'claude'],
    ['gemini', 'gemini'],
    ['copilot.microsoft.com', 'copilot'],
    ['poe.com', 'other'],
  ])('classifies the UTM source %s as generative AI', (utmSource, aiReferrer) => {
    expect(
      classifyConsentedAcquisition({
        landingPage: '/classement',
        locale: 'fr',
        utmSource,
        utmMedium: 'referral',
        initialReferrer: null,
      })
    ).toEqual({
      acquisition_channel: 'generative_ai',
      acquisition_source: utmSource,
      ai_referrer: aiReferrer,
      landing_page: '/classement',
      locale: 'fr',
    });
  });

  it.each([
    ['https://chatgpt.com/', 'chatgpt'],
    ['https://foo.perplexity.ai/search', 'perplexity'],
    ['https://claude.ai/new', 'claude'],
    ['https://gemini.google.com/app', 'gemini'],
    ['https://copilot.microsoft.com/', 'copilot'],
    ['https://www.bing.com/chat?q=etoilys', 'copilot'],
  ])('classifies the referrer %s as generative AI', (initialReferrer, aiReferrer) => {
    expect(
      classifyConsentedAcquisition({
        landingPage: '/',
        locale: 'fr',
        utmSource: null,
        utmMedium: null,
        initialReferrer,
      })
    ).toMatchObject({
      acquisition_channel: 'generative_ai',
      ai_referrer: aiReferrer,
    });
  });

  it.each([
    'https://chatgpt.com.evil.example/',
    'https://perplexity.ai.attacker.example/',
    'https://notclaude.ai/',
    'https://gemini.google.com.attacker.example/',
  ])('does not trust a deceptive AI domain: %s', (initialReferrer) => {
    expect(
      classifyConsentedAcquisition({
        landingPage: '/',
        locale: 'fr',
        utmSource: null,
        utmMedium: null,
        initialReferrer,
      })
    ).toMatchObject({ acquisition_channel: 'referral' });
  });

  it('applies UTM precedence and classifies common acquisition channels', () => {
    expect(
      classifyConsentedAcquisition({
        landingPage: '/contact',
        locale: 'fr',
        utmSource: 'Google Ads',
        utmMedium: 'cpc',
        initialReferrer: 'https://chatgpt.com/',
      })
    ).toMatchObject({
      acquisition_channel: 'paid_search',
      acquisition_source: 'google_ads',
    });

    expect(
      classifyConsentedAcquisition({
        landingPage: '/',
        locale: 'fr',
        utmSource: null,
        utmMedium: null,
        initialReferrer: 'https://www.google.fr/search?q=etoilys',
      })
    ).toMatchObject({ acquisition_channel: 'organic_search', acquisition_source: 'google' });

    expect(
      classifyConsentedAcquisition({
        landingPage: '/',
        locale: 'fr',
        utmSource: null,
        utmMedium: null,
        initialReferrer: 'https://www.linkedin.com/feed/',
      })
    ).toMatchObject({ acquisition_channel: 'social', acquisition_source: 'linkedin' });
  });

  it('classifies empty and internal referrers as direct', () => {
    for (const initialReferrer of [null, 'https://www.etoilys.fr/classement']) {
      expect(
        classifyConsentedAcquisition({
          landingPage: '/contact',
          locale: 'fr',
          utmSource: null,
          utmMedium: null,
          initialReferrer,
        })
      ).toMatchObject({ acquisition_channel: 'direct', acquisition_source: 'direct' });
    }
  });

  it('rejects sensitive or empty UTM sources and bounds normalized values', () => {
    expect(normalizeAcquisitionSource('test@example.com')).toBeNull();
    expect(normalizeAcquisitionSource('06 49 55 15 40')).toBeNull();
    expect(normalizeAcquisitionSource('  Partner Campaign  ')).toBe('partner_campaign');
    expect(normalizeAcquisitionSource('a'.repeat(100))).toHaveLength(64);
  });
});
