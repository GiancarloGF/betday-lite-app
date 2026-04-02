import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

/**
 * Clears localStorage before each test to guarantee isolation
 * between test cases that depend on persisted client-side data.
 */
beforeEach(() => {
  localStorage.clear();
});
