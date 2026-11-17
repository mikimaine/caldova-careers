# Filter open roles by department - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Filter open roles by department, decomposing the requirements from the PRD and the Architecture into implementable stories.

**Inputs:** "PRD" (kind `prd`), "Architecture" (kind `architecture`), and the repository.

## Requirements Inventory

### Functional Requirements

FR-1: A visitor can see a Department filter listing All departments, then every Department with at least one Posting exactly once, alphabetically; All departments is selected when the address names no Department; no filter is rendered when there are no Postings.
FR-2: A visitor can choose a Department and see only that Department's Role cards, in unchanged newest-first order, without a page load; choosing All departments shows every Role card again.
FR-3: A visible, polite live-region line states how many roles are shown ("2 open roles in Finance", "1 open role in Sales", "14 open roles").
FR-4: The current choice is reflected in the `department` query parameter (set for a Department, removed for All departments) without adding browser history entries.
FR-5: Opening an address with `department` lands on that Filtered view; an unknown value shows all; matching is exact and case-sensitive; the address decides the choice on every load including reload and Back/Forward; non-matching cards never flash visible on load.

### NonFunctional Requirements

NFR-1: The Department filter has a visible label, is fully keyboard-operable, and the page passes the existing axe check (WCAG 2 A and AA) with it present. (PRD §4.1)
NFR-2: The Open roles listing stays prerendered; no server endpoint, database table or runtime dependency is added. (PRD §5)
NFR-3: Without JavaScript the listing is exactly today's: every Role card visible, no Department filter or count line. (PRD §5)
NFR-4: Lint, typecheck, build, unit and end-to-end suites stay green, including the existing listing tests. (PRD §5)

### Additional Requirements

- AD-1: The content schema trims `department`; `listDepartments(jobs)` in `src/lib/jobs.ts` is the only place the Department set is computed, used by the page and by the e2e tests' shared helper.
- AD-2: Each Role card's `data-department` is its Department; filtering only toggles `hidden` and never removes, re-renders or reorders cards.
- AD-3: The address is the single source of truth: one `apply(department | null)` sets select, cards and count; `null` alone means All departments; the change handler writes with `history.replaceState`; `pageshow` with `persisted` re-applies.
- AD-4: The filter wrapper (label plus native select) and the count line ship `hidden`; one self-contained `<script is:inline>` right after the grid, inside the non-empty branch, unhides them and applies.
- AD-5: One formatter produces the count text; the count line is `aria-live="polite"`.
- Conventions: test ids `department-filter` and `roles-count`; only `URLSearchParams` writes the address, and tests read it with `searchParams.get`; e2e tests assert visibility, not the attribute. No starter template; no deployment change.

### UX Design Requirements

None: the Initiative has no UX Document.

### FR Coverage Map

Designed in step 2

## Epic List

Designed in step 2
