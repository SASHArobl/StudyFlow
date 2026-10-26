'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { LoadingState, ErrorState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { profileSchema, type Profile } from '@/domain/auth';
import { authMessage } from './messages';

export function AuthenticatedWorkspace() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let generation = 0;
    async function verify() {
      const current = ++generation;
      try {
        const response = await fetch('/api/account/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
          cache: 'no-store',
          signal: controller.signal,
        });
        if (controller.signal.aborted || current !== generation) return;
        if (response.status === 401 || response.status === 403) {
          setProfile(null);
          window.location.replace(
            response.status === 403
              ? '/login?notice=account-unavailable'
              : '/login',
          );
          return;
        }
        const data = (await response.json()) as {
          profile?: unknown;
          error?: string;
        };
        if (controller.signal.aborted || current !== generation) return;
        if (!response.ok) {
          setProfile(null);
          setError(authMessage(data.error ?? ''));
          return;
        }
        setProfile(profileSchema.parse(data.profile));
        setError('');
      } catch {
        if (!controller.signal.aborted && current === generation) {
          setProfile(null);
          setError(authMessage('network'));
        }
      }
    }
    void verify();
    const onFocus = () => {
      void verify();
    };
    window.addEventListener('focus', onFocus);
    const channel =
      typeof BroadcastChannel !== 'undefined'
        ? new BroadcastChannel('studyflow-auth')
        : null;
    if (channel)
      channel.onmessage = () => {
        setProfile(null);
        void verify();
      };
    return () => {
      controller.abort();
      window.removeEventListener('focus', onFocus);
      channel?.close();
    };
  }, [attempt]);
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) throw new Error(authMessage('service_unavailable'));
      setProfile(null);
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('studyflow-auth');
        channel.postMessage('signed-out');
        channel.close();
      }
      window.location.replace('/login');
    } catch {
      setError('Не удалось выйти. Проверьте соединение и повторите попытку.');
    } finally {
      setSigningOut(false);
    }
  }
  if (error)
    return (
      <main className="auth-layout">
        <ErrorState
          title="Аккаунт недоступен"
          message={error}
          action={
            <Button
              onClick={() => {
                setError('');
                setAttempt((value) => value + 1);
              }}
            >
              Повторить
            </Button>
          }
        />
      </main>
    );
  if (!profile) return <LoadingState />;
  return (
    <AppShell
      key={profile.user_id}
      profile={profile}
      onProfileUpdate={setProfile}
      onSignOut={signOut}
      signingOut={signingOut}
    />
  );
}
