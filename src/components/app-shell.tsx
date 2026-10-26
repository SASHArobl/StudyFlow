'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { getSection, sectionHref } from '@/lib/navigation';
import { Sidebar, type NavigateHandler } from './sidebar';
import { NavigationSearch } from './navigation-search';
import { PageContent, PageHeader, PagePlaceholder } from './page-layout';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';
import { ErrorState } from './ui/feedback';

// Global styles are loaded by the root layout; do not inject duplicate icon CSS.
config.autoAddCss = false;

const subscribePlatform = () => () => {};
const getShortcut = () =>
  /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘ K' : 'Ctrl K';
const getServerShortcut = () => 'Ctrl K';

export function AppShell() {
  const searchParams = useSearchParams();
  const section = getSection(searchParams.get('view'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const shortcut = useSyncExternalStore(
    subscribePlatform,
    getShortcut,
    getServerShortcut,
  );
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigationPending = useRef(false);
  const title = section?.label ?? 'Раздел не найден';

  useEffect(() => {
    document.title = `${title} · StudyFlow`;
    if (navigationPending.current) {
      titleRef.current?.focus();
      navigationPending.current = false;
    }
  }, [title]);

  useEffect(() => {
    const media = matchMedia('(min-width: 960px)');
    const onResize = () => {
      if (media.matches) setDrawerOpen(false);
    };
    const onBack = () => {
      setDrawerOpen(false);
      setSearchOpen(false);
      navigationPending.current = true;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k' &&
        !event.altKey
      ) {
        const target = event.target;
        if (
          target instanceof HTMLElement &&
          (target.isContentEditable ||
            /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
        )
          return;
        event.preventDefault();
        setDrawerOpen(false);
        setSearchOpen((value) => !value);
      }
    };
    media.addEventListener('change', onResize);
    window.addEventListener('popstate', onBack);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      media.removeEventListener('change', onResize);
      window.removeEventListener('popstate', onBack);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const onNavigate: NavigateHandler = (event, id) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (section?.id !== id) {
      navigationPending.current = true;
      window.history.pushState(null, '', sectionHref(id));
      window.scrollTo(0, 0);
    }
    setDrawerOpen(false);
    setSearchOpen(false);
  };
  function openSearch() {
    setDrawerOpen(false);
    setSearchOpen(true);
  }
  function goToToday() {
    navigationPending.current = true;
    window.history.replaceState(null, '', sectionHref('today'));
  }

  const sidebarProps = {
    active: section?.id,
    onNavigate,
    onSearch: openSearch,
    shortcut,
  };
  return (
    <div className="application-shell">
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <aside className="desktop-sidebar" aria-label="Боковая панель">
        <Sidebar {...sidebarProps} />
      </aside>
      <Dialog
        open={drawerOpen}
        onDismiss={() => setDrawerOpen(false)}
        title="Навигация"
        className="navigation-drawer"
      >
        <Sidebar {...sidebarProps} />
      </Dialog>
      <div className="workspace">
        <header className="workspace-header">
          <div className="workspace-location">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu-trigger"
              aria-label="Открыть навигацию"
              aria-expanded={drawerOpen}
              aria-haspopup="dialog"
              onClick={() => setDrawerOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} aria-hidden="true" />
            </Button>
            <span className="breadcrumb-parent">Учёба</span>
            <span className="breadcrumb-divider" aria-hidden="true">
              /
            </span>
            <span className="breadcrumb-current">{title}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={openSearch}
            aria-label="Поиск раздела"
            aria-haspopup="dialog"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
          </Button>
        </header>
        <main id="main-content" tabIndex={-1}>
          <PageContent>
            <PageHeader
              title={title}
              description={section?.description}
              titleRef={titleRef}
            />
            {section ? (
              <PagePlaceholder />
            ) : (
              <ErrorState
                title="Такого раздела нет"
                message="Проверьте адрес или выберите раздел в навигации."
                action={<Button onClick={goToToday}>Открыть «Сегодня»</Button>}
              />
            )}
          </PageContent>
        </main>
      </div>
      <NavigationSearch
        open={searchOpen}
        onDismiss={() => setSearchOpen(false)}
        onNavigate={onNavigate}
        active={section?.id}
      />
    </div>
  );
}
