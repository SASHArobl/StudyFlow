import { Suspense } from 'react';
import { AuthForm } from '@/features/auth/auth-form';
import { LoadingState } from '@/components/ui/feedback';
export const metadata = { title: 'StudyFlow — Account' };
export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthForm mode="forgot-password" />
    </Suspense>
  );
}
