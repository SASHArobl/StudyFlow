'use client';
import { useState, type FormEvent } from 'react';
import {
  profileSchema,
  updateProfileSchema,
  type Profile,
} from '@/domain/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authMessage } from '@/features/auth/messages';

export function AccountSettings({
  profile,
  onUpdate,
}: {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
}) {
  const [pending, setPending] = useState(false);
  const [expectedVersion, setExpectedVersion] = useState(profile.version);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const parsed = updateProfileSchema.safeParse({
      expected_user_id: profile.user_id,
      display_name: new FormData(form).get('display_name'),
      expected_version: expectedVersion,
    });
    setMessage('');
    setError('');
    if (!parsed.success) {
      setError('Имя должно содержать не более 80 символов.');
      return;
    }
    setPending(true);
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as {
        profile?: unknown;
        error?: string;
      };
      if (!response.ok) {
        setError(authMessage(data.error ?? ''));
        return;
      }
      const saved = profileSchema.parse(data.profile);
      onUpdate(saved);
      setExpectedVersion(saved.version);
      setMessage('Профиль сохранён.');
    } catch {
      setError(authMessage('network'));
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="account-settings" aria-labelledby="profile-heading">
      <h2 id="profile-heading">Профиль</h2>
      <form onSubmit={save} aria-busy={pending}>
        <div className="form-field">
          <label htmlFor="profile-email">Email · подтверждён</label>
          <Input id="profile-email" value={profile.email} readOnly />
          <span className="form-hint">
            Email используется для входа и восстановления доступа.
          </span>
        </div>
        <div className="form-field">
          <label htmlFor="display-name">Имя</label>
          <Input
            id="display-name"
            name="display_name"
            autoComplete="name"
            maxLength={80}
            defaultValue={profile.display_name}
          />
        </div>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        {message && <p role="status">{message}</p>}
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </form>
    </section>
  );
}
