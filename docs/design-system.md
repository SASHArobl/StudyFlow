# StudyFlow — Design System Foundation

Status: **Approved — visual foundation and Today v1.0 specification approved before Stage 4 initialization.**

This document records the existing Quiet Canvas / Things-refined foundation. It does not approve unreviewed page designs or start implementation. Detailed Today measurements, responsive rules and interactions are in [page-specifications.md](page-specifications.md).

## Binding visual decisions

- Calm native-productivity character, restrained surfaces, precise alignment and useful density.
- Quiet Canvas direction 2, refined with the user-provided Things collage and increased rounding.
- **Inter Variable** for typography; real **Font Awesome** icons, using the available Free Regular/Classic Solid assets. Do not imply that Pro/Rounded styles are included.
- R01 controls component placement only. R02–R06 supply scoped visual evidence; explicit user instructions take priority. See [reference mapping](design-references.md).
- Light and dark are themes of one system. Avoid source-01 serif/cream/forest-green styling, decorative gradients, excessive shadows, emoji navigation and gamification.

## Existing palette baseline

These values are recorded from the reviewed HTML artifact; use semantic names rather than copying literal values throughout future components. Context-specific contrast must be checked on the actual paired surface.

| Role | Light | Dark |
| --- | --- | --- |
| app.background | #EFF0F2 | #17181B |
| navigation.background | #F0F1F3 | #1C1D21 |
| surface.primary | #FFFFFF | #212226 |
| surface.subtle | #F7F8FA | #27292E |
| surface.hover | #F1F3F6 | #2C2E34 |
| navigation.selected | #E2E5E9 | #34363C |
| text.primary | #282C34 | #F0F1F3 |
| text.secondary | #535D6C | #C0C5CF |
| text.muted | #6B7380 | #A3A9B5 |
| action.primary | #3774C4 | #81ADEA |
| action.hover | #2D65AD | #9BBDF0 |
| action.tint | #EDF4FD | #29394E |
| action.tintBorder | #D5E4F9 | #3C5575 |
| border.separator | #E9EBEF | #303239 |
| border.surface | #E2E5EA | #3A3D45 |
| status.success | #62927D | #91BCA3 |
| status.warningText | #946137 | #D4AA7E |

Separators are decorative surface boundaries, not sufficient contrast for every input/control. Required control boundaries, errors, focus states and tinted text pairs must meet the accessibility target; do not use low-contrast separator tokens as a universal interactive border. In dark mode, primary blue buttons use a dark foreground such as #172334 instead of white.

## Shared shape and layout language

- Existing rounded baseline: workspace 21 px, panels 17 px, controls/nav selections 10–11 px, time badges 7 px, checkboxes 5 px.
- Spacing vocabulary: 4, 8, 12, 16, 20, 24, 32, 40 px. Apply through consistent component padding and group spacing.
- Thin borders, quiet gray navigation selection, restrained blue for primary actions/section emphasis. Color supplements names and explicit state labels.
- Rows belong to grouped surfaces; do not elevate every task into a separate card. Shadow is reserved for menus/dialogs and minimal shell separation.
- Inter Variable supports the required weight range. Use readable Cyrillic, optical sizing and tabular time numerals. The approved Today type scale is specified in the page contract, not inferred from screenshot pixel sizes.

## Accessibility and interaction foundation

Keyboard access, visible focus, labeled controls, status feedback, non-color state cues, reduced motion and responsive ru/en text are required. Target WCAG 2.2 AA; no full compliance claim is made from source screenshots or the exploratory HTML alone.

Task, Study Session and Topic mastery are separate concepts with different controls. Local save, sync confirmation and time confirmation are separate states. No component styling should hide those distinctions.

## Approval boundaries

The user explicitly approved requirements, architecture, design system, reference
mapping, implementation roadmap, and the Today specification before authorizing
Stage 4. The standalone HTML remains a supporting review artifact; the approved
Today contract prioritizes the daily plan and next action over dashboard widgets.
Other pages do not yet have detailed page specifications in this document.
