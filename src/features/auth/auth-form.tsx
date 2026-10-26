'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authSchemas, type AuthMode } from '@/domain/auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authMessage } from './messages';

const copy = {
  login: {
    title: 'С возвращением',
    description: 'Войдите, чтобы продолжить учёбу.',
    submit: 'Войти',
  },
  register: {
    title: 'Начните со спокойного плана',
    description: 'Создайте аккаунт StudyFlow.',
    submit: 'Создать аккаунт',
  },
  'forgot-password': {
    title: 'Восстановить доступ',
    description: 'Отправим ссылку для смены пароля.',
    submit: 'Отправить ссылку',
  },
  'reset-password': {
    title: 'Новый пароль',
    description: 'После сохранения войдите с новым паролем.',
    submit: 'Сохранить пароль',
  },
};
export function AuthForm({ mode }: { mode: AuthMode }) {
  const params = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const hasEmail = mode !== 'reset-password';
  const hasPassword = mode !== 'forgot-password';
  const hasConfirmation = mode === 'register' || mode === 'reset-password';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const result = authSchemas[mode].safeParse(values);
    setError('');
    setFields({});
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues)
        errors[String(issue.path[0])] ??= issue.message;
      setFields(errors);
      form
        .querySelector<HTMLInputElement>(`[name="${Object.keys(errors)[0]}"]`)
        ?.focus();
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setError(
          authMessage(
            typeof data === 'object' && data && 'error' in data
              ? String(data.error)
              : '',
          ),
        );
        return;
      }
      if (mode === 'login') window.location.replace('/app');
      else if (mode === 'reset-password')
        window.location.replace('/login?notice=password-reset');
      else {
        form.reset();
        setSent(true);
      }
    } catch {
      setError(authMessage('network'));
    } finally {
      setPending(false);
    }
  }
  const notice = params.get('notice');
  const noticeText =
    notice === 'account-unavailable'
      ? authMessage('account_unavailable')
      : notice === 'invalid-link'
        ? 'Ссылка недействительна или уже использована. Откройте её в том же браузере, где запрашивали письмо, или запросите новую.'
        : notice === 'password-reset'
          ? 'Пароль обновлён. Войдите с новым паролем.'
          : notice === 'session-required'
            ? 'Запросите новую ссылку для восстановления доступа.'
            : notice === 'service-unavailable'
              ? authMessage('service_unavailable')
              : '';
  return (
    <section className="auth-panel" aria-labelledby="auth-title">
      <Link href="/login" className="auth-brand">
        StudyFlow
      </Link>
      <h1 id="auth-title">{copy[mode].title}</h1>
      <p className="auth-description">{copy[mode].description}</p>
      {noticeText && (
        <p className="auth-notice" role="status">
          {noticeText}
        </p>
      )}
      {sent ? (
        <div role="status" className="auth-notice">
          <p>
            {mode === 'register'
              ? 'Если регистрация доступна для этого адреса, вы получите письмо. Подтвердите email по ссылке в этом браузере.'
              : 'Если аккаунт с таким email существует, вы получите ссылку. Откройте её в этом браузере.'}
          </p>
          <Link href="/login">Вернуться ко входу</Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate aria-busy={pending}>
          {hasEmail && (
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                required
                maxLength={254}
                aria-invalid={Boolean(fields.email)}
                aria-describedby={fields.email ? 'email-error' : undefined}
              />
              {fields.email && (
                <span id="email-error" className="field-error">
                  {fields.email}
                </span>
              )}
            </div>
          )}
          {hasPassword && (
            <div className="form-field">
              <label htmlFor="password">Пароль</label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                required
                maxLength={128}
                aria-invalid={Boolean(fields.password)}
                aria-describedby={
                  fields.password
                    ? 'password-error'
                    : mode !== 'login'
                      ? 'password-hint'
                      : undefined
                }
              />
              {mode !== 'login' && (
                <span id="password-hint" className="form-hint">
                  От 12 до 128 символов. Можно использовать менеджер паролей.
                </span>
              )}
              {fields.password && (
                <span id="password-error" className="field-error">
                  {fields.password}
                </span>
              )}
            </div>
          )}
          {hasConfirmation && (
            <div className="form-field">
              <label htmlFor="confirmation">Повторите пароль</label>
              <Input
                id="confirmation"
                name="confirmation"
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
                aria-invalid={Boolean(fields.confirmation)}
                aria-describedby={
                  fields.confirmation ? 'confirmation-error' : undefined
                }
              />
              {fields.confirmation && (
                <span id="confirmation-error" className="field-error">
                  {fields.confirmation}
                </span>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={pending}
            className="auth-submit"
          >
            {pending ? 'Подождите…' : copy[mode].submit}
          </Button>
        </form>
      )}
      <nav className="auth-links" aria-label="Доступ к аккаунту">
        {mode === 'login' ? (
          <>
            <Link href="/forgot-password">Забыли пароль?</Link>
            <span>
              Нет аккаунта? <Link href="/register">Создать</Link>
            </span>
          </>
        ) : (
          <Link href="/login">Уже есть аккаунт? Войти</Link>
        )}
        {notice === 'invalid-link' && (
          <Link href="/forgot-password">Запросить новую ссылку</Link>
        )}
      </nav>
      <div className="auth-theme">
        <ThemeSwitcher />
      </div>
    </section>
  );
}
