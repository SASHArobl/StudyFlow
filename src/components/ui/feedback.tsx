import { useId, type ReactNode } from 'react';
import { Button } from './button';

export function LoadingState({
  label = 'Открываем интерфейс…',
}: {
  label?: string;
}) {
  return (
    <div className="feedback loading-state" role="status" aria-live="polite">
      <p>{label}</p>
      <div className="loading-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function ErrorState({
  title = 'Не удалось открыть раздел',
  message,
  onRetry,
  action,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
}) {
  const titleId = useId();
  return (
    <section
      className="feedback error-state"
      role="alert"
      aria-labelledby={titleId}
    >
      <h2 id={titleId}>{title}</h2>
      <p>{message}</p>
      {onRetry && <Button onClick={onRetry}>Попробовать снова</Button>}
      {action}
    </section>
  );
}
