# StudyFlow — Design References

Status: **Approved reference mapping — Stage 4 initialization authorized by the user.** This document records evidence and scope; the design system and Today contract are maintained separately. User-provided screenshots were inspected directly in the conversation; local PNG files were accessible and copied unchanged into the project. No live product interaction or responsive behavior was tested.

## 1. Binding scope and priority

Explicit user instructions > scoped component references > scoped page references > approved global design system > general inspiration.

**Reference 01 is LAYOUT ONLY. It must never supply visual component design.** Its fonts, palette, backgrounds, buttons, badges, corner treatment, shadows, timer ring and other component styling are excluded. References 02–05 provide visual evidence. This separation applies to image prompts, design documentation and later implementation.

Original source files are unchanged. Local copies below preserve evidence; do not publish source screenshots or reproduce visible personal information. The desktop environment and browser frames are outside the reference scope.

## 2. Evidence inventory

| ID | Source | Dimensions | Role and fidelity |
| --- | --- | --- | --- |
| R01 | [Today layout](design/references/ref-01-today-layout-only.png) | 1600 × 1469 | Structural reference for Today: sidebar, toolbar/header, main list and contextual right rail. Preserve relative placement; adapt content to approved MVP. Zero visual-style authority |
| R02 | [Calendar light](design/references/ref-02-calendar-light.png) | 2672 × 1438 | Planner visual reference: neutral surfaces, fine grid, compact controls, time/date hierarchy. Screenshot-grounded adaptation, not a clone of integrations or exact content |
| R03 | [Linear light](design/references/ref-03-linear-light.png) | 2672 × 1438 | Primary light-theme component/surface reference: sidebar, active row, icons, typography, borders, inset work surface |
| R04 | [Linear light with desktop context](design/references/ref-04-linear-light-context.png) | 2560 × 1440 | Corroborates R03; essentially the same product screen, not an independent visual direction. Ignore OS menu, wallpaper, dock and browser framing |
| R05 | [Linear dark](design/references/ref-05-linear-dark.png) | 1336 × 742 | Primary dark-theme visual evidence: charcoal surfaces, restrained tonal hierarchy, outline controls, thin borders and limited semantic accents. Do not import the agent feature or promotional texture |

Source filenames: screen.png; Screenshot 2026-10-25 at 20.34.57.png; Screenshot 2026-10-25 at 20.31.38.png; Screenshot 2026-10-25 at 20.31.24.png; Screenshot 2026-10-25 at 20.29.45.png, respectively.

## 3. Per-reference analysis

### R01 — Today placement only

- **Layout/proportions:** persistent full-height sidebar about 19% of source width; remaining content has a global toolbar, full-width page header, a broad main list and narrower stacked right rail. At source size, list/rail split is approximately 2:1, excluding sidebar/gutters. These are observations, not approved responsive tokens.
- **Placement to preserve:** search/navigation/subjects in sidebar; settings/account state at its foot; title/date/summary above work; daily items and completed section in main column; next Focus, weekly activity and upcoming deadlines stacked on the right.
- **Typography/spacing/color/hierarchy:** source component styling is explicitly disallowed. Reinterpret hierarchy using R02–R05 sans-serif type and neutral surfaces. Do not carry over the large serif greeting, cream background, forest-green CTA or subject-chip treatment.
- **Patterns:** structural locations of list, quick add and contextual information are usable; this does not approve every illustrated control or feature.
- **Behavior:** screenshot depicts controls but does not prove their behavior. Duplicate Start actions, checkbox use for sessions, filter behavior and sorting are not approved interaction specifications.
- **Responsive evidence:** desktop only; no mobile layout or collapse behavior is established.

### R02 — Calendar visual language

- **Layout/proportions:** slim left navigation, dominant seven-column time grid, compact header controls, a narrow right utility area. Carry calendar-specific structure into Planner, not every page.
- **Typography:** restrained sans-serif; date/month stronger than day labels; hours and auxiliary labels secondary. Exact font family, rendered CSS sizes and weights cannot be established from the raster alone.
- **Spacing:** tight control groups; generous calendar canvas; thin repeated grid intervals establish rhythm. Do not copy tiny screenshot-scaled labels as actual mobile/body sizes.
- **Color:** white/off-white grid, light neutral sidebar, low-contrast grid lines; red highlights current date/time; event/calendar colors are supplementary.
- **Hierarchy/patterns:** month/date navigation and view selection precede the grid; current-day/current-time indicators help orientation. Small month picker and subject filters are candidates, not requirements for all pages.
- **Behavior:** visible Week/Today/arrows/search controls; no drag, resize, edit dialog or keyboard interaction observed. Grid contains no populated study events, so block design is not evidenced.
- **Responsive evidence:** wide desktop only. StudyFlow mobile/day behavior must be designed separately.
- **Adaptation:** use Monday-first weeks and 24-hour time from PRD even though the screenshot shows different date/time conventions. Do not add calendar connections, meeting scheduling or database integrations to MVP.

### R03 — Linear light application surface

- **Layout/proportions:** narrow gray navigation beside a large near-white inset workspace, slim top identity row and compact pill-like view controls. The almost empty page has a small centered information group and contextual links.
- **Typography:** sans-serif; medium-weight titles, compact navigation/body labels, muted secondary descriptions. Exact font is not verified.
- **Spacing:** dense sidebar rows and grouped navigation; substantial empty page space is caused by the captured content state, not a requirement to underfill Today.
- **Color:** tonal gray surfaces, charcoal text, softer secondary text, gray selected navigation row; limited mint/teal and blue identifying accents.
- **Hierarchy/patterns:** small outline icons, subtle selected row, quiet outlined/pill controls, thin surface boundaries. Avoid making every item a raised card.
- **Behavior:** control affordances visible; hover, focus, command palette and click outcomes unobserved.
- **Responsive evidence:** desktop only.
- **Integration:** visual language for shell, lists, topic controls, forms and settings; R01 still owns Today component placement. Do not add teams, members, workspaces or integrations.

### R04 — Same light screen in desktop context

- **Layout/typography/spacing/color:** same basic composition as R03 at another capture size. Confirms the inset workspace and gray navigation relationship; offers no independent evidence for a different component system.
- **Hierarchy/patterns:** same navigation/selected row and minimal workspace content. OS chrome, wallpaper and dock are excluded from StudyFlow.
- **Behavior/responsiveness:** a second desktop capture is not proof of mobile breakpoints or adaptive rules; no interaction observed.
- **Integration/fidelity:** supporting evidence only. Do not count the two captures as two separate style preferences.

### R05 — Linear dark detail surface

- **Layout/proportions:** persistent left navigation; slim context header; main detail/activity column; right contextual content and an overlapping agent window.
- **Typography:** sans-serif with compact navigation, medium detail headings, secondary metadata; strong text contrast hierarchy. Code chips are content-specific, not a general typography direction.
- **Spacing:** compact navigation/action groups; separated activity entries; larger spacing around detail headings. Overlay is a contextual element, not justification for permanent overlapping panels.
- **Color:** near-black/charcoal layers differentiated by small tonal changes and thin gray borders; off-white main text; subdued secondary text; yellow/purple semantic accents.
- **Patterns:** small outline icon buttons, subtle active nav surface, restrained outlined groups. Visible texture/ambient lighting is not adopted as a StudyFlow background treatment.
- **Behavior:** static detail/overlay composition only. No hover, modal focus handling or drag behavior is verified.
- **Responsive evidence:** desktop only.
- **Integration:** dark counterparts of shared surfaces/controls for all pages; no AI window, code review, team activity or development workflow in MVP. Exact contrast compliance must be measured later; screenshot alone does not establish it.

## 4. Mapping to StudyFlow

| Scope | Placement authority | Visual authority | Evidence gaps |
| --- | --- | --- | --- |
| Today | R01 | R03/R04 light; R05 dark; R02 for time labels | Final priority rules, row states, empty/loading/offline states |
| Shell/navigation | R01 placement on Today; approved architecture elsewhere | R03/R04/R05 | Mobile navigation, long Russian labels, keyboard focus |
| Subjects / subject detail | PRD and future page specification | R03/R04/R05 | No direct topic-status or subject-progress screenshot supplied |
| Tasks | PRD; Today tasks occupy main column | R03/R04/R05 | No populated task-list/subtask interaction reference supplied |
| Planner | Planner day/week requirements; R02 calendar structure | R02 plus shared R03/R05 controls | Session block designs, edit form, overlaps and mobile day view |
| Focus | R01 next-session placement on Today; standalone Focus follows PRD | Shared R03/R05 visual language | Dedicated Focus screen, pause/recovery/result states |
| Analytics | R01 weekly activity location on Today; PRD elsewhere | Shared R03/R05 | Meaningful chart/detail states and insufficient-data behavior |
| Settings / data safety | PRD | Shared R03/R05 | Export barriers, account deletion, sync/time conflicts |

These gaps do not block choosing a direction. Propose the missing component/state designs after selection; ask only if a user-provided reference is needed to settle an actual conflict.

## 5. Scope exclusions and resolved conflicts

- R01 contributes geometry, never style. Explicit user scoping resolves any visual conflict with R02–R05.
- Task checkbox means completion; Session time/play means planned study. Source visuals do not override the Task/Session distinction.
- R01's semester/workspace controls, points, cognitive-window coaching, free-standing scratchpad, exam objects and weekly percentage target are not approved MVP features. Preserve useful grid slots without importing that feature inventory.
- Upcoming deadlines represent Tasks, not a new Exams section. Existing Session notes do not imply a global notes product.
- Calendar Sunday-first/12-hour labels are adapted to approved Monday-first/24-hour/UTC+4 rules.
- Sparse source content is not a reason for empty StudyFlow pages; low-contrast source text is not a contrast target.
- Light and dark screenshots establish two themes within one eventual system, not two competing product directions.
- Future Exams/Spaced Repetition remain future scope. Anki may inform future review feedback, not MVP scheduling or topic mastery claims.

## 6. General inspirations: evidence status

Linear and Notion Calendar are represented by the supplied screenshots above. Their current live websites/app behavior were not inspected in this pass. Things 3, Raycast and Anki remain general sources named by the user; their live UI, interactions and responsive behavior have not been visually inspected. Do not attribute observed patterns or exact measurements to these uninspected sources. Scoped user references take precedence over general inspiration.

## 7. Visual direction selection

Both directions use R01's sidebar/header/main-list/right-rail structure and R02–R05's visual language. Both previews are light-theme Today screens to keep comparison fair; R05 will inform dark counterparts after direction selection. Neither is a final design-system approval.

| Direction | Proposed emphasis | Trade-off | Preview |
| --- | --- | --- | --- |
| Compact Workspace | Chronological session rows on a unified main surface; compact separators; individual contextual sections in right rail | Faster time-based scanning and better long-list capacity; can feel denser | [Preview](design/explorations/compact-workspace.png) |
| Quiet Canvas | More spacing and subject grouping; more visibly bounded shared main/context surfaces | Easier subject-oriented orientation; fewer sessions fit above the fold, more vertical scanning | [Preview](design/explorations/quiet-canvas.png) |

Generated with the built-in Image Gen tool, using all five supplied images with explicit layout-only/style-only roles. Target: 1600 × 1472, matching R01's tall desktop proportions approximately. Mock date anchor: Sunday, October 25, 2026. No application code or UI components were created. Prompts are preserved alongside the previews.

### Preview QA and limits

- Both show the requested positional regions with sans-serif typography and neutral component styling; no source serif/cream/forest-green button style was intentionally adopted.
- They are raster exploration, not measured layout specs. Exact vertical alignment, typography sizes, surface boundaries, contrast, icon consistency and mobile behavior still require definition.
- Compact preview weekly bar labels sum to 5 h 20 min while its headline says 4 h 20 min; Sunday bar also disagrees with the daily total. These are generation errors, not accepted metric definitions. Use the consistent 260-minute dataset from the Quiet Canvas prompt when specifying actual charts.
- Quiet preview includes a duplicate primary Start action in the global toolbar and the contextual panel; remove the redundant primary action in the approved design.
- Completed activity must distinguish a completed session from task completion; generated completion-checkbox treatments are not approved semantics.
- Do not extract final tokens from either generated bitmap. Final tokens and page specifications follow explicit direction selection and design review.

Selection: the user chose the second displayed direction, Quiet Canvas, with requested revisions below. The HTML review artifact is an explicit user-authorized Stage 3 prototype, not production implementation. The subsequent explicit design approval authorized Stage 4.


## 8. R06 — Things collage and explicit revision brief

Source: [Things App Collage](design/references/ref-06-things-collage.png), 2000 × 2000. Inspected directly; includes desktop, phone, tablet and watch depictions. It is a collage, not a single measured viewport.

- **Scope:** task-list hierarchy, gentle surfaces, softly rounded controls, compact checkboxes, blue section labels, calm spacing, gray active navigation, limited functional color. This refines direction 2; R01 remains placement-only.
- **Typography:** compact readable sans-serif; stronger title and section weights. Exact source font is not asserted. The user explicitly requires **Inter Variable**, overriding font inference from every raster.
- **Layout/proportions:** desktop uses a pale navigation column and broad white detail/list surface. Mobile/tablet examples group list items under headings with small secondary context and a prominent add action. Retain StudyFlow's grid; do not transplant the collage composition.
- **Spacing/hierarchy:** meaningful gaps between task groups, thin dividers, small completion controls and secondary subject/context lines. Avoid individual elevated task cards.
- **Color:** neutral white/gray surfaces, blue actions/section labels, semantic colored navigation icons. The collage's green background, device black silhouettes, shadows and OS chrome are excluded.
- **Icons:** source has its own iconography; user explicitly requires **Font Awesome**. Use genuine Font Awesome Free 6.7.2 Regular/Solid glyphs, not custom SVG approximations, Lucide, emojis, or a claim that proprietary Rounded/Pro styles are included.
- **Radii:** increase application/surface/control radii. Current review candidate uses approximately 21 px workspace, 17 px panels, 10–11 px controls, 5 px checkboxes. These are prototype choices for review, not final approved tokens.
- **Behavior:** static imagery does not prove drag, gesture, completion animation or keyboard behavior. Keep task completion separate from session completion. Do not add Things areas/projects, Someday/Anytime, reminders or watch integration to MVP.
- **Responsive evidence:** mobile/tablet list composition is visible, but breakpoints and transition behavior are not. The prototype's narrow layout is a proposed StudyFlow adaptation, not an observed behavior of Things.
- **Fidelity:** high fidelity to the scoped visual relationships and explicit revision instructions. This is a composite StudyFlow target, not a pixel-identical copy of a device collage. Mobile bounds and text readability are checked on the rendered prototype.

## 9. Revised HTML review artifact

[Standalone Today prototype](design/prototypes/studyflow-today.html), with [notes](design/prototypes/README.md).

- Preserves the broad center/right-rail placement and subject grouping from the selected direction; applies more rounding and Things-informed list density.
- Embeds Inter Variable and licensed Font Awesome Free fonts in the HTML. No CDN, installation, API key, build tool or network connection is needed to open the delivered file.
- Includes light/dark appearance, a responsive menu, task create/check, subject filter, session selection/planning/editing, command search, Focus pause/finish/result review using demo data.
- Fixes the duplicate primary CTA, inconsistent weekly chart totals, and session/task completion ambiguity from image exploration.
- Intentional deviations from the earlier raster: required font/icons; more rounding; Things blue functional accent; flatter timer surface; aligned right rail below the page header; readable text; completed-session indicator rather than task checkbox.
- This prototype has no real account, persistence, sync, offline data engine or other production screens. Reload resets demo edits. Other sidebar destinations are intentionally unavailable; Focus opens the demo flow.
- No new Image Gen output was used in this revision. The subsequent explicit approval covers the design system and Today specification.


## 10. Approved Today specification

The user requested a detailed Today specification before implementation and referred to the shared visual system as approved. Retain that foundation and reference hierarchy; do not reopen the chosen Inter Variable / Font Awesome / rounded Quiet Canvas direction.

[Today specification v1.0](page-specifications.md) prioritizes the daily plan and next action. Compared with the exploratory HTML, it removes the weekly-chart and duplicate-deadlines widgets, uses compact factual daily progress, and defines desktop/mobile/interaction states. R01 remains a placement reference: its optional rail slots do not mandate adding widgets. These page-specific refinements are approved. The HTML has not been modified in this pass.
