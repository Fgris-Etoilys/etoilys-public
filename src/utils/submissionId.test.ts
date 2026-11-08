import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSubmissionId } from './submissionId';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('createSubmissionId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a distinct v4 UUID on each call', () => {
    const first = createSubmissionId();

    expect(first).toMatch(UUID_V4);
    expect(createSubmissionId()).not.toBe(first);
  });

  it('falls back on getRandomValues when randomUUID is missing', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (bytes: Uint8Array) => bytes.fill(255),
    });

    expect(createSubmissionId()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  });
});
