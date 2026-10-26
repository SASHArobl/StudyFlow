'use client';

import { ErrorState } from '@/components/ui/feedback';

export default function WorkspaceError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="workspace-failure">
      <ErrorState
        message="Попробуйте открыть интерфейс ещё раз. Если ошибка повторится, перезагрузите страницу."
        onRetry={reset}
      />
    </div>
  );
}
