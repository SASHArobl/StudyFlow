# StudyFlow exploratory generation prompt

Status: Exploratory; not an approved design specification.
Tool: built-in Image Gen. Reference roles are explicitly scoped in the prompt below.

Use case: ui-mockup. Asset: independent visual direction named "Compact Workspace" for StudyFlow Today. Create a realistic production-quality desktop productivity application UI screenshot, crisp typography, restrained and precise. A single screen, 1600 x 1472 px, no browser chrome, no desktop OS, no external mockup frame or presentation headings. This is design exploration, not implementation.
INPUT IMAGES IN EXACT ORDER:
1 screen.png: STRICTLY A POSITIONAL GRID ONLY. Reuse only the positions/proportions of left sidebar, top toolbar/header, central daily list, and stacked right contextual column. It has NO authority over ANY visual styling. NEVER copy its serif fonts, cream/beige background, forest-green buttons, uppercase serif headings, colored rectangular subject chips, checkbox shapes, thick timer ring, individual card style, shadows or component appearance. Do not copy its text/content/features.
2 Calendar screenshot: visual inspiration ONLY for light neutral surfaces, thin grid lines, compact sans serif, functional color and calendar controls.
3 and 4 Linear light screenshots: PRIMARY light visual style: cool pale-gray sidebar, neutral near-white work surface, small regular sans serif labels, clear dark text, subtle dividers, gray active nav row, compact outline icons. Duplicate views of same reference, not two independent styles.
5 Linear dark screenshot: secondary grounding for restrained component language and future dark-theme compatibility ONLY. Render this concept LIGHT, not dark. Do not copy the AI agent overlay, promotion, wallpapers, grain, outer browser window, avatars, personal info, workspaces, team features.
TARGET PRODUCT: StudyFlow for students. Goal: see next study action, start a session, keep tasks separate from scheduled time. Language Russian. UI uses readable modern sans serif with Cyrillic like Inter; 14-15 px baseline, medium hierarchy, tabular time. No serif typography anywhere.
GRID inherited from input1 at 1600px: left sidebar about 270-285px, top toolbar across remaining width; content header full width with small date, Today title and concise plain-text daily summary. Main content below split about 68% central list, 32% contextual right rail, 24px gutter. Body roughly same tall aspect as input1. Sidebar stays full height, settings and sync at bottom. Keep the position of the right-rail Focus block, followed by week activity, followed by deadline list.
DIRECTION: dense, unified working surface inspired by Linear/Calendar. Flat white central canvas, very pale cool gray sidebar, 1px neutral row separators, no individual row cards. Small consistent 5-7px radii only controls, 8px restrained panel radius if needed. Dark charcoal primary action; neutral gray active nav. Very limited muted teal for subject dots only. No gradients, glows, glass, random shadows or emoji. Compact geometric outline icons.
SIDEBAR: StudyFlow wordmark in sans serif; search field 'Поиск' and shortcut '⌘K'; nav 'Сегодня', 'Предметы', 'Задачи', 'Планировщик', 'Фокус', 'Аналитика'; Сегодня selected with gray fill. Section 'Предметы': Математика, Английский, Русский язык, Информатика with tiny quiet dots. Bottom Настройки, 'Синхронизировано'.
TOP toolbar breadcrumb 'Учёба / Сегодня', quiet '+ Задача' secondary button.
HEADER: 'Сегодня', 'Воскресенье, 25 октября', plain small summary '3 занятия · 2 ч 15 мин по плану · 40 мин завершено'. Date anchor current date 2026-10-25 Sunday; no fabricated live clock.
CENTRAL: heading 'Занятия на сегодня' small supporting filter 'Все предметы'. Thin input row '+ Запланировать занятие'. Chronological list, each row uses a TIME column, title, subject text and duration; small subtle play action on right, NO completion checkbox for sessions.
Rows:
'16:00' 'Производные' metadata 'Математика · 45 мин' subtitle 'Правила дифференцирования и практика'
'17:00' 'IELTS Writing Task 2' metadata 'Английский · 60 мин' subtitle 'Структура эссе и аргументация'
'18:15' 'Н и НН' metadata 'Русский язык · 30 мин' subtitle 'Правила и упражнения'
Separate section below 'Задачи с дедлайном': these have empty completion checkboxes, no play icons:
'Подготовиться к контрольной' metadata 'Математика · завтра · высокий приоритет'
'Написать эссе' metadata 'Английский · 28 октября'
Then collapsed subdued section 'Завершено сегодня' with '40 мин · Практика по алгебре'. Plenty of quiet usable space below, no filler cognitive insight or streaks.
RIGHT RAIL top: compact 'Следующее занятие' panel, 'Производные', 'Математика · 45 мин', plain strong tabular digits '45:00' as ready countdown (no thick decorative ring), ONE clear primary dark button 'Начать занятие'. This is the page primary action.
Below: modest section 'На этой неделе', '4 ч 20 мин' 'подтверждённого времени', small factual seven-bar chart for Oct19-25 labels Пн Вт Ср Чт Пт Сб Вс. No percentages, weekly goal or large dashboard stat. Below 'Ближайшие дедлайны' with the same two real tasks (not Exams): Контрольная по математике — 26 октября; Эссе — 28 октября. Right rail remains useful and quiet.
Accessibility: text not ghost-light, visible button labels, distinguish session/time/play from task/checkbox; color is supplementary. No membership, subscription, AI, spaced repetition, exams, points, streaks, cognitive coaching, workspace switcher or scratchpad. Do not copy example personal names. All components visual styles MUST come from images2-5, never image1.

