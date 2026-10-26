# StudyFlow — поэтапный план

Status: **Approved roadmap 1.0; Stage 5 Milestones 1–2 — Application Foundation and Authentication implemented and verified**. The user explicitly approved requirements, architecture, design system, reference mapping, implementation roadmap, and Today v1.0. The user explicitly authorized the reusable application shell before business features; no release date is committed.

## Этапы и согласования

| Этап | Результат | Состояние / условие перехода |
| --- | --- | --- |
| 1. Требования | PRD 0.2 | Утверждён пользователем |
| 2. Architecture | architecture.md, decisions.md, implementation roadmap | Approved by the user |
| 3. Design system and UX | Reference analysis, two directions, flows, page specifications, tokens, responsive states | Approved by the user, including Today v1.0; detailed specifications for other pages remain to be written before their implementation |
| 4. Инициализация | Минимальный воспроизводимый проект | Foundation initialized; checks recorded in docs/initialization.md; local DB execution requires Docker |
| 5. Инкрементальная реализация | Рабочие сценарии по таблице ниже | Application Foundation and Authentication/User Profiles completed; remaining functional increments not started |
| 6. Визуальный обзор | Реальные экраны и исправления | Отдельный итоговый этап; текущая визуальная проверка в каждом инкременте |
| 7. Технический обзор | Корректность, безопасность, эксплуатация, ограничения | До первого реального использования |

## Этап 3 — подготовить дизайн

- Today → Focus → результат → история; Subject/Topic, Task/Subtask, Planner день/неделя, Analytics, аккаунт/настройки.
- Отдельно: неизвестное время после reload, конфликт записи/времени, sync-индикатор, ошибки места, блокировка экспорта, подтверждение удаления.
- Ru/en, keyboard, desktop/mobile, плотность, типографика, компоненты.
- Для каждого референса: область, характеристики, точность, интеграция. Не проектировать по неувиденному референсу.
- Архивирование объясняет судьбу открытых задач/будущих занятий; перенос/отмена не происходят молча.

## Этап 4 — инициализация

1. Создать App Router/strict TypeScript, поддерживаемый Node.js LTS не ниже 22, Tailwind, выбранные UI primitives; зафиксировать версии и lockfile.
2. Настроить lint/typecheck/build, Vitest, Playwright, local Supabase; фиктивные данные без production-доступа в тестах.
3. Env validation, server-only границы, шаблон переменных без секретов; типы БД из SQL-миграций.
4. Выбрать hosting/регион/план, SMTP, backup/deletion retention и лимиты по реальным условиям владельца. Развёртывание production не входит в инициализацию без команды.
5. Проверить воспроизводимость установки, production build и минимальный браузерный запуск. Не добавлять будущие AI/Exams/Calendar функции.

## Initialization outcome

The approved stack, strict TypeScript, lint/format, environment validation, directory
boundaries, Vitest, Playwright, local Supabase configuration, and permanent AGENTS.md
are in place. See [development guide](development.md) and [verification record](initialization.md).
The application shell, authentication routes, basic profile, private schema/RPC migration and tests are implemented.
Study features, synchronization engine, service worker and hosted project are not implemented.
Hosting/region/plan, SMTP, and backup/deletion retention are deferred to deployment
preflight. Local Supabase Auth, Mailpit and SQL/RLS checks have now run; see milestone-2.md.
Stage 5 has completed user-directed Milestones 1–2. Study business features have not started.

## Stage 5 — user-directed Milestone 1: Application Foundation

The user explicitly requested the reusable shell before the functional increments
below. Implement `/app?view=...`, seven-section navigation, responsive desktop/sidebar
and mobile drawer, header/title primitives, themes, accessible navigation search,
and shared loading/error patterns. Use clearly labeled temporary page shells.
No authentication, study data, offline engine, or synchronization is included.
This changes implementation order only; the approved architecture is unchanged.
See [milestone record](milestone-1.md). Stop after this milestone.

## Stage 5 — user-directed Milestone 2: Authentication and User Profiles

Email/password registration, confirmation, sign-in/out, PKCE recovery, SSR cookie
sessions and basic owned profiles are implemented. The generic `/app` entry stays
static; protected endpoints and narrow RLS-backed RPCs enforce access separately.
See [authentication contract](authentication.md) and [verification record](milestone-2.md).
No study features, offline identity/storage, sync or hosted deployment are included.

## Этап 5 — последующие функциональные инкременты

| № | Рабочий результат | Проверка перед продолжением |
| --- | --- | --- |
| 1 | Email/password: регистрация/confirmation, вход/выход, recovery; роли и account_state | Два пользователя изолированы; прямой RPC/старый session_id не обходят права; auth не кэшируется |
| 2 | Subject сквозь IndexedDB → outbox → транзакцию → receipt → снимок | Потерянный ответ после commit не создаёт дубль; чужие UUID отклонены; новая правка в полёте не потеряна |
| 3 | Два устройства, версии, сохранение вариантов, выбор/повторный конфликт | Base/local/server сохранены; выбор не затирает третью правку; зависимый ребёнок ждёт родителя |
| 4 | Статическая оболочка, offline reload, оболочки всех разделов, безопасное обновление SW/IndexedDB | Production работает после перезапуска без сети; API не в Cache API; очередь переживает обновление; нет смешения аккаунтов |
| 5 | Topics, Tasks/Subtasks, Sessions, редактирование/архив | SQL проверяет предмет/связи; один уровень подзадач; архив сохраняет историю; локальная запись офлайн |
| 6 | Today и ручной Planner день/неделя | UTC+4, date-only дедлайны, план/факт отдельно, пересечения предупреждаются, пропущенное переносится вручную |
| 7 | Focus: секундомер/Pomodoro, паузы, заметки, manual time, recovery | Атомарный Finish; один Focus онлайн; generation при смене устройства; offline overlap, crash, часы, повтор Finish |
| 8 | Оценка результата, история, Analytics | Только подтверждённые непересекающиеся интервалы; manual выделено; полночь/неделя; Task/Topic не меняются автоматически |
| 9 | JSON export, reauth и удаление с защищённым Cron-повтором этапов | Revision-барьер; отказ Admin API без ложного success; retry; отзыв сессий и отсутствие воскрешения старым offline-клиентом |
| 10 | Цельный сценарий, ru/en, keyboard, адаптивность | Полный PRD acceptance run без заглушек; переход к итоговым обзорам |

Офлайн и sync не откладываются на конец: это основа инкрементов 1–4.

После инкремента 4 — контрольная точка архитектуры: годовой синтетический профиль (100 предметов, 1000 тем, 2000 задач, 5000 подзадач, 1000 занятий/результатов, 5000 интервалов, архив/конфликты), два устройства, полный снимок и offline reload. Зафиксировать snapshot bytes, время блокировки/применения IndexedDB, потребление места. Response/timeout должны иметь двукратный запас до лимитов выбранного hosting. Это тестовый профиль, не обещание масштаба. Если не проходит — остановить расширение функций и согласовать изменение ADR-004.

Каждый инкремент проходит релевантные unit/SQL/E2E и визуальную проверку по дизайну. После успешных обязательных проверок не расширять тестирование без новой причины.

## Этап 6 — визуальный обзор

Реальные скриншоты ключевых потоков/состояний на desktop/mobile и ru/en. Проверить читабельность, плотность, клавиатуру/фокус/подписи, пустые/длинные данные, загрузку, ошибки, offline/conflicts. Исправить существенные отклонения и обновить согласованные эталоны.

## Этап 7 — технический обзор

- Критерии PRD и adversarial сценарии architecture.md, включая прямой Data API/RPC.
- Security/performance advisors, grants/RLS/definer-владельцы; исправить существенные замечания.
- Production headers, отсутствие персонального кэша и секретов в bundle/логах/export, callback allowlist.
- Реальные SMTP confirmation/recovery, backup restore, retry удаления и retention.
- Реальный Safari/iOS smoke: offline reload/хранение, Focus в фоне, mobile/keyboard.
- Зафиксировать browsers и ограничения хранения/фоновых уведомлений/удалённого стирания.
- Короткий релизный отчёт: рабочие сценарии, проведённые проверки, ограничения. Внешняя публикация — по отдельной команде владельца.

Next action: stop after the implemented and verified Authentication/User Profiles milestone; await approval before the next explicit scope. Today v1.0 is already approved. Other detailed page specifications must be defined before those pages are implemented; do not infer authorization for the functional increments above.
