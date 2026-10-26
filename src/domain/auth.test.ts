import { describe, expect, it } from 'vitest';
import {
  loginSchema,
  registrationSchema,
  resetSchema,
  updateProfileSchema,
  emptySchema,
} from './auth';

describe('authentication boundaries', () => {
  it('requires a long matching new password but accepts an existing shorter login password', () => {
    expect(
      registrationSchema.safeParse({
        email: 'student@example.com',
        password: 'short',
        confirmation: 'short',
      }).success,
    ).toBe(false);
    expect(
      loginSchema.safeParse({ email: 'student@example.com', password: 'short' })
        .success,
    ).toBe(true);
    expect(
      resetSchema.safeParse({
        password: 'long-password-123',
        confirmation: 'different',
      }).success,
    ).toBe(false);
    expect(
      resetSchema.safeParse({
        password: 'long-password-123',
        confirmation: 'long-password-123',
      }).success,
    ).toBe(true);
  });
  it('rejects unknown fields and caller-selected profile ownership', () => {
    expect(
      registrationSchema.safeParse({
        email: 'student@example.com',
        password: 'long-password-123',
        confirmation: 'long-password-123',
        role: 'admin',
      }).success,
    ).toBe(false);
    expect(emptySchema.safeParse({ user_id: 'someone-else' }).success).toBe(
      false,
    );
    expect(
      updateProfileSchema.safeParse({
        expected_user_id: '10000000-0000-4000-8000-000000000001',
        display_name: 'Alex',
        expected_version: '1',
        user_id: 'someone-else',
      }).success,
    ).toBe(false);
  });
  it('validates profile version and normalizes a plain-text name', () => {
    expect(
      updateProfileSchema.parse({
        expected_user_id: '10000000-0000-4000-8000-000000000001',
        display_name: '  Alex  ',
        expected_version: '1',
      }).display_name,
    ).toBe('Alex');
    for (const value of ['0', '-1', '1.2', '999999999999999999999999'])
      expect(
        updateProfileSchema.safeParse({
          expected_user_id: '10000000-0000-4000-8000-000000000001',
          display_name: 'Alex',
          expected_version: value,
        }).success,
      ).toBe(false);
    expect(
      updateProfileSchema.safeParse({
        expected_user_id: '10000000-0000-4000-8000-000000000001',
        display_name: 'a'.repeat(81),
        expected_version: '1',
      }).success,
    ).toBe(false);
  });
});
