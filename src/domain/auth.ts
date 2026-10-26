import { z } from 'zod';

const email = z.email('Введите корректный email.').trim().max(254);
const password = z
  .string()
  .min(12, 'Минимум 12 символов.')
  .max(128, 'Не более 128 символов.');
export const loginSchema = z.strictObject({
  email,
  password: z.string().min(1, 'Введите пароль.').max(128),
});
export const registrationSchema = z
  .strictObject({ email, password, confirmation: z.string() })
  .refine((data) => data.password === data.confirmation, {
    path: ['confirmation'],
    message: 'Пароли не совпадают.',
  });
export const recoverySchema = z.strictObject({ email });
export const resetSchema = z
  .strictObject({ password, confirmation: z.string() })
  .refine((data) => data.password === data.confirmation, {
    path: ['confirmation'],
    message: 'Пароли не совпадают.',
  });
export const emptySchema = z.strictObject({});
export const updateProfileSchema = z.strictObject({
  expected_user_id: z.uuid(),
  display_name: z.string().trim().max(80, 'Не более 80 символов.'),
  expected_version: z.string().regex(/^[1-9][0-9]{0,17}$/),
});
export const profileSchema = z.object({
  user_id: z.uuid(),
  display_name: z.string(),
  locale: z.enum(['ru', 'en']),
  version: z.string().regex(/^[1-9][0-9]*$/),
  created_at: z.string(),
  updated_at: z.string(),
  email: z.email(),
});
export type Profile = z.infer<typeof profileSchema>;
export type AuthMode =
  'login' | 'register' | 'forgot-password' | 'reset-password';
export const authSchemas = {
  login: loginSchema,
  register: registrationSchema,
  'forgot-password': recoverySchema,
  'reset-password': resetSchema,
};
