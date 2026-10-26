import type { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { navigationItems, sectionHref, type SectionId } from '@/lib/navigation';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';

export type NavigateHandler = (
  event: MouseEvent<HTMLAnchorElement>,
  id: SectionId,
) => void;

type SidebarProps = {
  active?: SectionId;
  onNavigate: NavigateHandler;
  onSearch: () => void;
  shortcut: string;
};

export function Sidebar({
  active,
  onNavigate,
  onSearch,
  shortcut,
}: SidebarProps) {
  const settings = navigationItems[6];
  return (
    <div className="sidebar-content">
      <div className="sidebar-brand">
        <span className="brand-mark">
          <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
        </span>
        <span>StudyFlow</span>
      </div>
      <Button
        variant="ghost"
        className="sidebar-search"
        onClick={onSearch}
        aria-label="Найти раздел"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
        <span>Найти раздел</span>
        <kbd>{shortcut}</kbd>
      </Button>
      <nav aria-label="Основная навигация" className="primary-navigation">
        <ul>
          {navigationItems
            .filter((item) => item.id !== 'settings')
            .map((item) => (
              <li key={item.id}>
                <a
                  href={sectionHref(item.id)}
                  aria-current={active === item.id ? 'page' : undefined}
                  className="navigation-link"
                  onClick={(event) => onNavigate(event, item.id)}
                >
                  <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <nav aria-label="Настройки">
          <a
            className="navigation-link"
            href={sectionHref(settings.id)}
            aria-current={active === settings.id ? 'page' : undefined}
            onClick={(event) => onNavigate(event, settings.id)}
          >
            <FontAwesomeIcon icon={settings.icon} aria-hidden="true" />
            <span>{settings.label}</span>
          </a>
        </nav>
        <ThemeSwitcher />
        <p className="sidebar-caption">Предварительная версия</p>
      </div>
    </div>
  );
}
