'use client';

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

type DialogProps = {
  open: boolean;
  onDismiss: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

export function Dialog({
  open,
  onDismiss,
  title,
  description,
  children,
  className,
  initialFocusRef,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      initialFocusRef?.current?.focus();
    } else if (!open && dialog.open) dialog.close();
  }, [open, initialFocusRef]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn('dialog', className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
          return;
        }
        if (event.key !== 'Tab') return;
        const targets = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = targets[0];
        const last = targets.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === event.currentTarget)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClose={() => {
        if (open) onDismiss();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onDismiss();
      }}
    >
      <div className="dialog-heading">
        <h2 id={titleId}>{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Закрыть окно"
        >
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
        </Button>
      </div>
      {description && (
        <p id={descriptionId} className="dialog-description">
          {description}
        </p>
      )}
      {children}
    </dialog>
  );
}
