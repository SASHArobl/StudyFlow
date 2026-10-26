import { Suspense } from 'react';
import { AuthenticatedWorkspace } from '@/features/auth/authenticated-workspace';
import { LoadingState } from '@/components/ui/feedback';

// Generic static entry point: no cookies, account data, or server query parsing.
export default function WorkspacePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthenticatedWorkspace />
    </Suspense>
  );
}
