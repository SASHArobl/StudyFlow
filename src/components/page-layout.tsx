import type { ReactNode, Ref } from 'react';

export function PageHeader({
  title,
  description,
  titleRef,
}: {
  title: string;
  description?: string;
  titleRef?: Ref<HTMLHeadingElement>;
}) {
  return (
    <header className="page-heading">
      <h1 ref={titleRef} tabIndex={-1}>
        {title}
      </h1>
      {description && <p>{description}</p>}
    </header>
  );
}

export function PageContent({ children }: { children: ReactNode }) {
  return <div className="page-content">{children}</div>;
}

export function PagePlaceholder() {
  return (
    <section className="page-placeholder" aria-labelledby="placeholder-title">
      <span className="preview-label">Временная страница</span>
      <h2 id="placeholder-title">Раздел пока не реализован</h2>
      <p>
        Сейчас доступны переходы между разделами и настройка темы. Учебные
        функции появятся на следующих этапах.
      </p>
    </section>
  );
}
