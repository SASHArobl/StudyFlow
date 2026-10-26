'use client';

import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { navigationItems, sectionHref, type SectionId } from '@/lib/navigation';
import type { NavigateHandler } from './sidebar';
import { Dialog } from './ui/dialog';
import { Input } from './ui/input';

export function NavigationSearch({
  open,
  onDismiss,
  onNavigate,
  active,
}: {
  open: boolean;
  onDismiss: () => void;
  onNavigate: NavigateHandler;
  active?: SectionId;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const results = navigationItems.filter((item) =>
    `${item.label} ${item.english}`
      .toLocaleLowerCase('ru')
      .includes(query.trim().toLocaleLowerCase('ru')),
  );
  function dismiss() {
    setQuery('');
    onDismiss();
  }
  return (
    <Dialog
      open={open}
      onDismiss={dismiss}
      title="Перейти в раздел"
      description="Поиск по разделам StudyFlow."
      initialFocusRef={inputRef}
      className="navigation-search-dialog"
    >
      <div className="search-field">
        <label htmlFor="section-search">Название раздела</label>
        <Input
          id="section-search"
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Например, планировщик"
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              listRef.current?.querySelector('a')?.focus();
            }
          }}
        />
      </div>
      <ul
        ref={listRef}
        className="search-results"
        aria-label="Разделы приложения"
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          const links = Array.from(event.currentTarget.querySelectorAll('a'));
          const current = links.findIndex(
            (link) => link === document.activeElement,
          );
          const next = current + (event.key === 'ArrowDown' ? 1 : -1);
          event.preventDefault();
          if (next < 0) inputRef.current?.focus();
          else links[next % links.length]?.focus();
        }}
      >
        {results.map((item) => (
          <li key={item.id}>
            <a
              href={sectionHref(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
              onClick={(event) => {
                onNavigate(event, item.id);
                if (event.defaultPrevented) dismiss();
              }}
            >
              <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
              <span className="search-english">{item.english}</span>
            </a>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <p className="search-empty" role="status">
          Раздел не найден. Попробуйте другое название.
        </p>
      )}
    </Dialog>
  );
}
