import {
  faCalendarDays,
  faChartBar,
  faFolderOpen,
  faSquareCheck,
  faSun,
} from '@fortawesome/free-regular-svg-icons';
import { faSliders, faStopwatch } from '@fortawesome/free-solid-svg-icons';

export const navigationItems = [
  {
    id: 'today',
    label: 'Сегодня',
    english: 'Today',
    icon: faSun,
    description: 'Ежедневный учебный план и следующее занятие.',
  },
  {
    id: 'subjects',
    label: 'Предметы',
    english: 'Subjects',
    icon: faFolderOpen,
    description: 'Учебные предметы, темы и прогресс освоения.',
  },
  {
    id: 'tasks',
    label: 'Задачи',
    english: 'Tasks',
    icon: faSquareCheck,
    description: 'Задания, подзадачи и сроки выполнения.',
  },
  {
    id: 'planner',
    label: 'Планировщик',
    english: 'Planner',
    icon: faCalendarDays,
    description: 'Расписание учебных занятий на день и неделю.',
  },
  {
    id: 'focus',
    label: 'Фокус',
    english: 'Focus',
    icon: faStopwatch,
    description: 'Пространство для сосредоточенной учёбы.',
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    english: 'Analytics',
    icon: faChartBar,
    description: 'История занятий и учебный прогресс.',
  },
  {
    id: 'settings',
    label: 'Настройки',
    english: 'Settings',
    icon: faSliders,
    description: 'Настройки приложения и управление личными данными.',
  },
] as const;

export type SectionId = (typeof navigationItems)[number]['id'];

export function getSection(value: string | null) {
  return navigationItems.find((item) => item.id === (value ?? 'today'));
}

export function sectionHref(id: SectionId): string {
  return `/app?view=${id}`;
}
