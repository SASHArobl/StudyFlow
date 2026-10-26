import { Suspense } from 'react';
import { AppShell } from '@/components/app-shell';
import { LoadingState } from '@/components/ui/feedback';

// Generic static entry point: no cookies, account data, or server query parsing.
export default function WorkspacePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AppShell />
    </Suspense>
  );
}
