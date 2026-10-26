# StudyFlow — Page Specifications

## Today / Overview · UX and Visual Specification v1.0

Status: **Approved v1.0 — the user explicitly approved the design and authorized Stage 4 initialization.**

The latest user request confirms the existing visual foundation as the baseline for this work. Preserve Quiet Canvas direction 2, increased rounding, Inter Variable and Font Awesome. The composition, measurements, data rules, and interactions below are approved. The user has authorized foundation initialization only; product implementation remains a subsequent increment.

Scope: Today only. This document defines the page contract; it does not claim that the page or its backend has been implemented.

### 1. Sources and boundaries

- Product behavior: [approved PRD](requirements.md), especially FR-03–FR-08.
- Platform behavior: [approved architecture](architecture.md): local-first data, explicit sync states, Task/Study Session separation, UTC+4, one confirmed online Focus.
- Shared visual foundation: [design-system.md](design-system.md).
- Evidence and scope: [design-references.md](design-references.md).
- R01 controls placement only: sidebar, top bar/header, broad daily plan and a narrower contextual rail. None of its typography, colors or component decoration is adopted.
- R02 informs time clarity; R03/R04 neutral light surfaces/navigation; R05 dark surfaces; R06 Things informs list hierarchy, restrained blue accents and softened controls. Explicit user font/icon/rounding instructions take precedence.
- The HTML preview is supporting visual evidence, not the authority for metric definitions, production navigation or missing states. Intentional changes from that preview are identified in section 16.

### 2. Primary goal and hierarchy

Help the student answer: **What should I study next, and how do I start?**

Priority order:
1. Resume an existing Focus or resolve its interrupted-time confirmation when required.
2. Start the next useful planned session.
3. Read and adjust the remaining daily study plan.
4. Act on relevant assignments and deadlines, including overdue work.
5. Review completed work and concise factual daily progress.

The daily plan is the largest content area. The next-action panel contains one visually primary action. Task/session rows may have quiet contextual actions; do not repeat the large Start button in the toolbar.

No weekly chart, separate upcoming-deadlines widget, large statistic cards, study-time goal ring, streak, points, cognitive advice, AI planning, Exams or automatic repetition section on Today. Analytics and Planner own their deeper workflows. The right rail does not need filler when only one useful panel exists.

### 3. Page anatomy and data selection

| Region | Content and rules |
| --- | --- |
| Application shell | Search/command entry, Today, Subjects, Tasks, Planner, Focus, Analytics; subject shortcuts; Settings/account/sync status |
| Top bar | Small breadcrumb, secondary Add Task action; hamburger at narrow widths |
| Page header | Today, full local date, at most three concise daily facts |
| Daily plan | Subject groups with upcoming/active sessions whose planned start belongs to today; explicit time/duration and inline scheduling. Missed and completed sessions appear in their own subsections without duplicate rows |
| Next action | Existing Focus, explicitly selected session or a deterministic upcoming session; no AI recommendation |
| Tasks and deadlines | Relevant open assignments, grouped by overdue / due today / next seven days |
| Missed sessions | Separate visible subsection, with manual start-now/reschedule/cancel actions |
| Completed today | Collapsed-by-default disclosure with separate session and task item treatments |

Exclude archived/cancelled items from the current plan. Show their history in the appropriate archive/history view. Do not silently delete or complete them.

**Session grouping:** retain the selected direction's subject grouping. Sort sessions inside a group by planned start. Order groups by their earliest unfinished session, with stable ordering while the user is interacting; display the times prominently. This favors subject orientation over a perfectly interleaved timeline. Planner remains the chronological scheduling view.

**Task selection:** show all overdue open tasks first, then tasks due today, then the next seven calendar days. Within a bucket: earliest due date, then explicit priority, then stable creation order. Do not equate no priority with Normal. Initially show up to five task rows, with a clear remaining count and Show All link to Tasks. Always expose the overdue count, even if more rows are disclosed elsewhere.

Tasks without a deadline live in Tasks, not a second inbox on Today. Creating such a task succeeds and offers Open Task; do not fabricate a deadline or make the save appear to fail because the task is outside this view's filter.

**Missed sessions:** show a labeled count and the first three missed items below the upcoming plan, with Show More for the remainder. A missed session remains unresolved until explicitly handled; crossing its end time does not move it automatically. A past session can be started now while preserving its original plan and recording actual time separately.

The subject filter affects the main session/task/completed lists and shows an explicit result count. Header daily facts remain for the whole day and are labeled accordingly. An active Focus is never hidden by a filter. Clear a non-active manual session selection when its subject is filtered out.

### 4. Desktop layout and measurements

All values are CSS px at 100% zoom. Validate at 1280 × 900 and 1440 × 1000; also check a 1600 px-wide window. Do not use the tall exploration image as a required window height.

| Element | Specification |
| --- | --- |
| Shell | Neutral app background; fixed left navigation; near-white inset work surface |
| Sidebar | 248 px at 1280–1439; 264 px from 1440; own overflow only when navigation exceeds height |
| Outer inset | 16 px top/right/bottom; workspace radius 21 px; one 1 px border, minimal elevation |
| Top bar | 56 px high; 24–32 px horizontal inset; bottom divider |
| Content inset | 32 px at desktop; max content width 1280 px within the workspace; left aligned, not stretched indefinitely |
| Header → body | 24 px after the daily-facts line |
| Content columns | Main plan uses remaining width; context rail 300–360 px, 320 px preferred at 1440; 24 px gutter |
| Minimum main column | 560 px; collapse the context rail before compressing the plan below this |
| Plan/context surfaces | Radius 17 px; 24 px internal padding; 1 px low-emphasis boundary; no shadow on each list item |
| Sections | 24 px between related sections; 32 px between sessions and tasks; 16 px inside groups |
| Rows | Session minimum 64 px; task minimum 52 px; increase naturally for wrapping or metadata |
| Scrolling | Normal page scrolling; no nested scroll area inside the plan. Rail is not sticky in v1 |

The main panel and contextual panel begin on the same horizontal line, below the page header. Keep the sidebar/header/main/right placement from R01; simplify the rail's content rather than filling its original widget slots.

### 5. Mobile and intermediate layouts

| Width | Layout behavior |
| --- | --- |
| ≥1200 | Persistent full sidebar, main plan and context rail, 32 px content inset |
| 960–1199 | Sidebar 216 px, content inset 24 px. Keep two columns only if main ≥480 px and rail ≥280 px; otherwise move next action above the plan |
| 768–959 | Navigation becomes a modal drawer; top bar exposes menu/search. Single-column content, next action above the plan, 24 px inset |
| ≤767 | One column; 16 px page inset, 16 px panel padding, 16–20 px section gaps; no persistent sidebar or rail |
| 320–359 | Maintain readable type and 44 px touch areas; stack date, progress facts and filter controls as needed; no horizontal scrolling |

At 960–1199 the narrower allowance is a deliberate intermediate density; if localization or text zoom makes it unusable, use the single-column form instead. Breakpoints are layout budgets, not reasons to clip content.

Mobile order: top bar → title/date → daily facts → compact next action → daily plan → missed sessions → tasks → completed disclosure. This keeps starting a session easy without pushing the plan below a large dashboard module.

- Top bar: 56 px, sticky while scrolling; respect safe-area insets. It does not contain another large Start CTA.
- Next-action panel: compact title, subject, start time/duration and a full-width 44 px primary button. No large idle countdown or progress ring. At roughly 390 × 844, its main action and the beginning of the plan should be visible without scrolling, unless a required error banner is present.
- Session row: minimum 72 px; 44 px time column, flexible title/metadata, 44 px action hit area. Title may wrap to two lines; row height expands. Never shrink text to fit.
- Task checkbox: 16 px visible square within a 44 × 44 px hit area. Title and deadline remain readable; priority may wrap onto metadata line two.
- Filter: wrap under the section heading on small widths. No horizontally scrolling filter-chip strip is required.
- Drawer: up to 280 px or viewport minus 48 px; close button, outside-tap and Escape; focus stays inside while open and returns to the menu trigger on close.
- Create/edit forms: full-width modal sheet with a visible close control and scrollable content. Focus the first editable field. Keep submit reachable above the on-screen keyboard; input text at least 16 px on phones.
- Do not use swipe, hover or drag as the only way to complete, start, edit, reschedule or cancel.

Use one semantic copy of the next-action panel. Reading order after the header is next action → plan; desktop CSS places that panel in the right rail. Maintain the same logical keyboard/read order across layouts.

### 6. Typography, spacing and component styling

**Font:** genuine Inter Variable, locally hosted in the application. Use optical sizing and tabular numerals for times. No serif carry-over. The following Today-specific scale is approved; it replaces undersized metadata in the exploratory preview.

| Role | Desktop size / line height | Mobile size / line height | Weight |
| --- | --- | --- | --- |
| Page title | 28 / 36 | 26 / 34 | 620 |
| Next-session title | 20 / 28 | 18 / 26 | 600 |
| Section heading | 15 / 22 | 15 / 22 | 600 |
| Session/task title | 14 / 22 | 14 / 22 | 500; task 450 |
| Navigation | 13 / 20 | 14 / 22 | 450; active 550 |
| Metadata/date | 12 / 18 | 12 / 18 | 400 |
| Button label | 13 / 20 | 14 / 20 | 550 |
| Small status label | 11 / 16 | 12 / 18 | 450 |
| Active Focus time | 28 / 36 | 24 / 32 | 500, tabular |

Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40. Use 8 px icon/text gaps, 12 px row-column gaps and 4 px title/metadata gaps. Typography and content grouping provide hierarchy before extra boxes.

Retain rounded controls: workspace 21 px, panels 17 px, buttons/inputs/nav selection 11 px, small time badge 7 px, checkbox 5 px. Pill shapes are reserved for genuinely compact statuses; do not put every label in a pill.

**Colors:** use the shared semantic token roles in design-system.md. Neutral surfaces, dark primary text, readable secondary text, restrained blue action, gray active navigation. Subject colors supplement the subject name; they do not encode mastery. Dark mode changes surface/foreground tokens, not layout or icon geometry. Use orange/red for real deadline/error meaning, not routine decoration.

**Icons:** Font Awesome Free Regular where available; Classic Solid for the remaining icons. 16 px navigation/row icons, 12–14 px metadata icons, 18 px mobile action icons. Keep glyphs optically centered in stable boxes. No emoji, Lucide substitutions, synthetic stroke modifications or implied Pro/Rounded licensing. Hide decorative icons from assistive technology and label icon-only controls.

**Borders/elevation:** one 1 px separator per row/group where needed. Shadows only for transient dialogs/menus; avoid raised task cards and stacked cards within cards. Focus indicators must be clearly visible in both themes.

### 7. Session-list design and next action

A session row shows: planned start time, title/topic, subject grouping, duration, optional one-line instruction, status and a quiet Start control. An active/paused row instead exposes Return to Focus / Resume; a missed row exposes its explicit action menu. Never offer another Start for the same active result. If attached to a Task, include its title in details; avoid repeating a long task description in every row.

- Session titles select their preview in the contextual panel. Selection uses a pale blue surface and an accessible selected state.
- The separate play/Start button starts that specific session. Its accessible name includes the session title. It must not only select the row while appearing to start it.
- Use a semantic list with sibling title/select and Start controls; no nested buttons or completion checkbox masquerading as a session control.
- Row/body interaction must not create an accidental double Start. Disable only the pending start action while submitting.
- Desktop single-line titles may truncate only when full text is available on focus/details. Mobile uses two lines before truncation; important deadline/time text never disappears behind an ellipsis.
- A lightweight details form supports edit/reschedule/cancel. Preserve title, subject, topic, linked task, original plan and session notes according to PRD.

**Default next-action decision table:**

| Condition | Context and primary action |
| --- | --- |
| Existing running/paused Focus | Show the actual active session; Resume / Return to Focus. Starting another is not offered |
| Active result needs interrupted-time confirmation | Confirm recorded time / Review interrupted session; never silently credit the uncertain period |
| User explicitly selected an eligible session | Label Selected Session, show its details, Start Session |
| No manual selection, upcoming sessions exist | Earliest unstarted session today; Next Session, Start Session |
| Only missed sessions remain | Show the earliest missed one with explicit Start Now / Reschedule / Cancel choices; no automatic schedule movement |
| No sessions, relevant tasks exist | Schedule a Session; task context can prefill only after the user chooses that task |
| No remaining work | Calm completed-day state with a quiet planning action; no pressured streak or fabricated recommendation |

The primary Start action transitions to the existing Focus view (`/app?view=focus` with the selected session context); exact URL state follows approved architecture. The HTML prototype's modal is not a requirement for production Focus navigation. Returning to Today keeps an active-session context, not a second independent timer.

Before a start is confirmed online, show a short pending state and prevent duplicate submission. Offline starts are allowed but marked local/provisional. If another device already owns Focus, offer to continue that existing result according to the approved ownership rules.

### 8. Task-list design

Title: **Tasks and deadlines / Задачи и дедлайны**. Rows are visually distinct from sessions: completion checkbox instead of time/play, task title, subject, due date and optional priority/subtask count. Keep metadata quiet; avoid multiple saturated badges.

- Checkbox or its label area completes/reopens the Task; title/details control opens the Task detail interface. Keep these sibling targets; opening details never toggles completion.
- Space toggles a focused checkbox. Enter activates a focused details action. All required controls are reachable without hover.
- Optional subtask indicator uses factual `2/4` counts; Today does not expand a complete project hierarchy. Show subtask details in the Task interface.
- Completing all subtasks does not close the parent automatically. Completing a session does not close its Task.
- Completion is reflected immediately after successful local persistence. Announce it without moving keyboard focus unexpectedly. If the focused row will move, move it only after focus leaves or provide a stable completed representation.
- Completed task uses a checked state, muted but readable title and restrained strike-through. Move it to Completed Today after the interaction settles. Offer Undo in a status message; reopening remains possible in completed history after the toast disappears.
- Save failure retains the previous confirmed state and the attempted change/draft; show Retry. Never display a success checkmark before local storage has accepted the change.
- Overdue labels include date/text, not color alone. Do not repeat the same tasks in a second deadline widget in the rail.

### 9. Daily progress: display and definitions

Show a compact line below the page date, with up to three facts:

`40 мин подтверждённой учёбы · 1 задача выполнена · 1 из 4 занятий завершено`

Long labels wrap into a second line on mobile. Keep numbers at body size; no statistic tiles, oversized percentages or timer rings.

| Fact | Definition |
| --- | --- |
| Confirmed study time | Sum of confirmed, non-overlapping intervals belonging to completed results, clipped to today's UTC+4 boundaries; excludes pauses, unresolved time and discarded intervals |
| Tasks completed today | Tasks whose accepted completed_at falls within today; a task due on another day may still count here. Reopening removes it from this count |
| Planned sessions completed | Completed sessions whose planned start belongs to today / all non-cancelled, non-archived planned sessions starting today. Missed sessions remain in the denominator |
| Remaining plan estimate | Sum of planned durations of today's open/missed sessions; shown as secondary plan-section metadata, never called actual remaining effort |

Daily facts are factual activity indicators, not learning/mastery scores. No percentage is calculated from study minutes or Topic status. No task-completion denominator is invented from the seven-day deadline list.

When there are zero planned sessions, omit the fraction instead of showing 0/0 or 100%. A late-night session may contribute actual minutes to two days even though its planned-session count belongs to its starting day. An active session from yesterday remains visible in next-action context.

The header uses the accepted local snapshot of confirmed server data. Pending locally completed work remains visible in Completed Today with a Saved on This Device status; optional provisional increments such as `+12 мин на устройстве` are separate from the confirmed total. On acknowledgment they merge once, without a celebration animation. Pending/conflicted time must not inflate confirmed facts. Use the same distinction for pending Task/session completion counts.

An active Focus may show elapsed time in its context panel, labeled In Progress; it is not silently included in the completed-study total.

### 10. Navigation and keyboard behavior

- Today navigation has a gray rounded selected row and aria-current=page. Do not rely on its yellow/blue icon alone.
- Subject shortcuts open that subject's Today filter or the Subject view through an explicit consistent action; this page uses the filter behavior from the reviewed prototype.
- Search/command palette: Ctrl/Cmd+K. Add Task: Ctrl/Cmd+N. Display platform-appropriate key hints, retain explicit buttons when a browser reserves a shortcut, and do not intercept typing in editable fields. Scheduling remains reachable through an explicit button; no shortcut is mandatory.
- Escape closes the topmost non-destructive dialog/drawer and restores focus. It never completes a task, discards recorded time or ends Focus.
- Dialog title/description, focus trapping, keyboard close and focus restoration are required. Confirm destructive/cancel choices only when information would otherwise be lost.
- Preserve filter, selected-session context and scroll position when returning from Task/Focus within the same day. At a UTC+4 day change, update the date and announce availability of the new day; do not steal focus, cancel Focus or move the active control unexpectedly.
- A visible skip link reaches the main content. Avoid a page-wide single-key shortcut that competes with screen readers or input.

### 11. Interaction and feedback states

| State | Appearance | Behavior |
| --- | --- | --- |
| Default | Neutral surface, readable title, secondary metadata | No action appears disabled merely because it is quiet |
| Hover | Subtle surface tint; relevant menu affordance | No layout shift; essential controls remain discoverable by keyboard/touch |
| Focus-visible | 2–3 px blue outline with 2 px offset | Never removed without an equivalent indicator |
| Selected session | Pale blue background; selected title state | Selection changes preview, not completion or timer state |
| Pressed | Slight tonal change, no bounce | Reduced-motion preference respected |
| Start/save pending | Inline progress plus descriptive label | Prevent duplicate action; keep unrelated navigation usable |
| Completed task/session | Separate task-check and session-result treatments | Completion does not imply mastery |
| Missed/overdue | Text status and date; restrained warning color | Manual choices remain available |
| Offline/local | Calm status: saved locally, waiting for connection | Core actions stay available; no false Synced message |
| Conflict | Inline affected-row marker and Resolve action | Both versions preserved; unrelated work remains usable |
| Disabled | Readable muted control with reason available | Used only for a real unavailable action, not to simulate full-product links |

Feedback copy must distinguish local saving, synchronization and confirmed time. A spinner alone is not the status explanation. Status announcements use a polite live region; do not announce every timer second.

### 12. Loading, empty and failure states

| Situation | Required response |
| --- | --- |
| Local data opening | Stable shell/header plus three lightweight row placeholders; do not display zero totals as if loaded |
| Cached data plus background sync | Render cached plan immediately; quiet sync status; no full-page skeleton or UI reset |
| First use, no Subjects | One clear Create Subject action and short explanation; do not add fake sessions/charts |
| Subjects exist, no plan | Schedule First Session as the main action; retain relevant task list |
| No tasks in deadline window | One-line No upcoming task deadlines; keep plan dominant |
| No filter matches | Explain the active filter and offer Clear Filter; do not present this as an empty account |
| Everything finished | Completed-day message, completed disclosure, optional quiet Schedule action; no artificial 100% mastery |
| Offline with local data | Normal usable page with Saved on Device / Waiting for Connection status |
| First load offline, no cached account data | Connection-needed state with Retry; do not fabricate an empty account or wipe pending data |
| Server unavailable | Preserve local work; describe retry status. Do not block local planning |
| Local write/quota failure | Persistent inline error at affected action, draft retained, Retry; no saved/success claim |
| Session expired | Keep the current user's draft/queue; request reauthentication for sync. Never upload it under another account |
| Conflicting record/time | Affected item is marked; open resolution preserving both variants. Exclude unresolved time from totals |

Network status lives in the shell/account area by default. Put a banner above the plan only when the user's next action needs attention, such as a write failure or interrupted Focus. Do not give every routine offline event a large red card.

### 13. Motion and accessibility

- Hover/focus transitions 120–160 ms; row-state changes up to 180 ms; drawer/dialog transition up to 200 ms. No spring bounce, confetti or animated daily score.
- Respect reduced motion; preserve state changes without animation. No shimmer is necessary for skeletons.
- Target WCAG 2.2 AA: normal text contrast at least 4.5:1, large text 3:1; required non-text boundaries/state indicators 3:1. Check actual foreground/background pairs in both themes, including tinted selections.
- Touch target policy: 44 × 44 px for row actions, checkbox hit areas and mobile controls; compact desktop controls must meet at least the applicable 24 px target/spacing requirement. Visible icon size does not define hit area.
- Use semantic headings, lists, real buttons and labeled checkboxes. Do not turn the entire interface into an ARIA grid/listbox with nested action controls.
- At 200% text zoom and 320 px content width, reflow rather than clip or shrink type. No action depends solely on color, hover, an icon shape, drag or a tooltip.
- Full strings remain accessible when visible text is truncated. Due dates and session times have meaningful names, including day context when crossing midnight.
- Translations use ru/en strings and plural rules, 24-hour study time and Monday-first weeks; allow at least 30% copy expansion. Never encode UI labels into decorative imagery.

### 14. Text wireframes

Example only: Sunday October 25, 2026, 15:50 in UTC+4. Algebra was completed for 40 minutes; three future sessions remain. One Task was completed today. The example is not the runtime clock or a hard-coded production date.

**Desktop — main layout**

```text
+----------------------+----------------------------------------------------------+
| StudyFlow            | Study / Today                           [+ Add Task]     |
| [Search... Ctrl+K]    +----------------------------------------------------------+
|                      | Today                    Sunday, October 25               |
| > Today              | 40m confirmed · 1 task done · 1/4 sessions complete        |
|   Subjects           |                                                          |
|   Tasks              | +----------------------------------+ +-----------------+ |
|   Planner            | | DAILY PLAN · 3 ahead [Subject v] | | NEXT SESSION    | |
|   Focus              | | 2h 15m in the remaining plan     | | Mathematics     | |
|   Analytics          | | [+ Schedule a Session]          | | Derivatives     | |
|                      | |                                  | | 16:00 · 45 min  | |
| Subjects             | | Mathematics                      | |                 | |
|   Mathematics        | | 16:00  Derivatives       45m [>] | | [Start Session] | |
|   English            | |        Rules and practice        | | Edit schedule   | |
|   Russian            | | English                          | +-----------------+ |
|                      | | 17:00  IELTS Writing     60m [>] |                       |
|                      | | Russian                          | No filler widgets;    |
|                      | | 18:15  N / NN            30m [>] | daily plan dominates. |
|                      | |                                  |                       |
|                      | | TASKS AND DEADLINES              |                       |
|                      | | Overdue                          |                       |
|                      | | [ ] Finish report · Oct 23       |                       |
|                      | | Next seven days                  |                       |
|                      | | [ ] Prepare for test · Tomorrow  |                       |
|                      | | [ ] Write essay · Oct 28         |                       |
|                      | |                                  |                       |
| Settings             | | > Completed today · Sessions /  |                       |
| Account / sync       | |   Tasks, distinct result types  |                       |
+----------------------+----------------------------------+-----------------------+
```

In a different dataset with missed sessions, insert the labeled Missed subsection between the upcoming plan and Tasks; its rows expose Start Now / Reschedule / Cancel. Recompute the session denominator from that dataset. No missed session is included in the four-session example above.

**Mobile — compact next action, then plan**

```text
+------------------------------------+
| [Menu] Today           [+ Task]     |
+------------------------------------+
| Today                              |
| Sunday, October 25                  |
| 40m confirmed · 1 task done         |
| 1/4 sessions complete               |
|                                    |
| +--------------------------------+ |
| | NEXT SESSION                   | |
| | Derivatives · Mathematics      | |
| | 16:00 · 45 min                 | |
| | [       Start Session        ] | |
| +--------------------------------+ |
|                                    |
| DAILY PLAN · 3 ahead               |
| [All subjects v]                   |
| [+ Schedule a Session]             |
|                                    |
| Mathematics                        |
| 16:00  Derivatives           [>]   |
|        Rules and practice · 45m    |
|                                    |
| English                            |
| 17:00  IELTS Writing Task 2   [>]   |
|        Essay structure · 60m       |
|                                    |
| Russian                            |
| 18:15  N / NN                [>]   |
|        Rules and exercises · 30m   |
|                                    |
| TASKS AND DEADLINES                |
| [ ] Prepare for test               |
|     Mathematics · Tomorrow         |
| [ ] Write essay                    |
|     English · Oct 28               |
|                                    |
| > Completed today                  |
| Saved on device / Synced           |
+------------------------------------+
```

Wireframe boxes indicate placement, not extra card borders. Decorative phone frames and device controls from R06 are not part of the web page.

### 15. Review and acceptance checklist

- [ ] Daily plan is the largest region; one clearly primary next action is visible.
- [ ] Active Focus, explicit selection, upcoming, missed-only and empty states follow the decision table.
- [ ] Tasks and sessions have distinct controls and completion semantics.
- [ ] R01 influences placement only; latest Inter Variable / Font Awesome / rounding requirements are met.
- [ ] At 1440 × 1000, header, primary action and all three example sessions are visible; the main list is not compressed by widgets.
- [ ] At 390 × 844, compact next action and the beginning of the plan are visible; no horizontal overflow at 320/390/768 widths.
- [ ] Long ru/en titles, metadata and phone keyboards do not hide actions; keyboard order and focus remain usable.
- [ ] Confirmed daily totals use defined data; local pending work, active time and conflicts are identified separately.
- [ ] Overdue Tasks and missed Sessions remain discoverable until explicitly handled.
- [ ] Light/dark, hover, focus, selected, pending, local-save failure, empty and conflict states are specified and reviewed.
- [ ] No weekly chart, duplicated deadline widget, fabricated learning percentage, points or future product features appear.
- [ ] The user explicitly approves this Today specification before application implementation.

### 16. Changes to approve against the HTML exploration

1. Remove the weekly chart and duplicate deadline rail; keep a focused next-action panel.
2. Replace the large idle 45:00 readout with start time and duration; reserve live elapsed time for an existing Focus.
3. Use concise daily facts with exact definitions and readable metadata; no activity-to-mastery implication.
4. Make session selection and actual Start separate unambiguous controls.
5. Specify real overdue/missed/pending/conflict/loading states and mobile priority order, rather than inheriting prototype omissions.
6. Treat the dimensions and responsive/type scale above as the approved Today contract. The existing HTML has not been changed in this documentation pass.

Specification scope: Today UX/visual contract only. Stage 4 initialization was authorized separately; other page contracts must be specified before their implementation.
