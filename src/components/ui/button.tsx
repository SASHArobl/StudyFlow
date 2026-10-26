import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'icon';
};

export function Button({
  className,
  variant = 'secondary',
  size = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'button',
        `button--${variant}`,
        size === 'icon' && 'button--icon',
        className,
      )}
      {...props}
    />
  );
}
