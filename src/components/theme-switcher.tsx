'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import {
  getThemePreference,
  setThemePreference,
  subscribeTheme,
} from '@/lib/theme';

const getServerPreference = () => 'system' as const;

export function ThemeSwitcher() {
  const id = useId();
  const preference = useSyncExternalStore(
    subscribeTheme,
    getThemePreference,
    getServerPreference,
  );
  const [saveFailed, setSaveFailed] = useState(false);
  return (
    <div className="theme-preference">
      <div className="theme-control">
        <label htmlFor={id}>
          <FontAwesomeIcon icon={faCircleHalfStroke} aria-hidden="true" />
          <span>Тема</span>
        </label>
        <select
          id={id}
          value={preference}
          onChange={(event) => {
            const value = event.target.value;
            if (value === 'system' || value === 'light' || value === 'dark')
              setSaveFailed(!setThemePreference(value));
          }}
        >
          <option value="system">Системная</option>
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </div>
      {saveFailed && (
        <p className="theme-save-status" role="status">
          Тема изменена, но браузер не позволил сохранить выбор.
        </p>
      )}
    </div>
  );
}
