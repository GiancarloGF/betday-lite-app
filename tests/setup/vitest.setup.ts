import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_key';

/**
 * Clears localStorage before each test to guarantee isolation
 * between test cases that depend on persisted client-side data.
 */
beforeEach(() => {
  localStorage.clear();
});
