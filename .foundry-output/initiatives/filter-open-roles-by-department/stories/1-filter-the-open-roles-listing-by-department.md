# Story 1: Filter the open roles listing by department

<!-- foundry-story: story_01a1eb3e-2f29-7664-bd5c-257ab46b47d5 -->

Epic: 1

## Story

As a job seeker with a field in mind, I want to pick a department on the careers page and see only its open roles and how many there are, so that I find my roles without reading every card.

## Acceptance Criteria

- Given the listing has Postings, when it loads, then a labelled Department filter (data-testid department-filter, a native select) offers All departments, selected, followed by every Department exactly once in alphabetical order, as returned by listDepartments, and listDepartments is unit-tested for de-duplication and sort order, with the schema trimming each Department. <!-- ac_01a1eb3e-2f2a-7321-a423-a5d73235faf8 -->
- Given the listing, when a Department is chosen, then only Role cards of that Department are visible, the visible cards keep their newest-first order, and the page does not reload. <!-- ac_01a1eb3e-2f2a-7105-8fe0-0f4ec69c1912 -->
- Given a Department is chosen, when All departments is chosen, then every Role card is visible again. <!-- ac_01a1eb3e-2f2a-7169-9b0f-21a749f69845 -->
- Given any choice, when it changes, then the count line (data-testid roles-count, aria-live polite) matches the visible cards and reads like '2 open roles in Finance', '1 open role in Sales' or, for All departments, '14 open roles'. <!-- ac_01a1eb3e-2f2a-7cbc-a9c4-0a4781c8de0a -->
- Given JavaScript is disabled, when the listing loads, then every Role card is visible and neither the Department filter (label included) nor the count line is shown. <!-- ac_01a1eb6f-5dcc-70b1-9605-8a8965b20f09 -->
- Given there are no Postings, when the listing loads, then the existing empty state is shown and no Department filter, count line or filter script is rendered. <!-- ac_01a1eb3e-2f2a-76bb-b11a-bff6484deb8c -->
- Given the Department filter is present, when the existing axe test runs, then it reports no wcag2a or wcag2aa violations, the filter is operable by keyboard alone, and lint, typecheck, build, unit and e2e suites pass. <!-- ac_01a1eb6f-5dcc-7d52-a21d-5990eb863602 -->

## Notes

Covers: FR-1, FR-2, FR-3, NFR-1, NFR-2, NFR-3, NFR-4; binds AD-1, AD-2, AD-3, AD-4, AD-5

Read the Architecture Document first; its ADs are the contract this Story and Story 1.2 share.

Where the code is:
- `src/content.config.ts`: change `department: z.string()` to `z.string().trim()` (AD-1).
- `src/lib/jobs.ts`: add `listDepartments(jobs: Job[]): string[]` (de-duplicate, sort with `localeCompare(..., 'en')`) next to `sortByNewest`; test it in `src/lib/jobs.test.ts` (vitest).
- `src/pages/index.astro` (prerendered): inside the non-empty branch, render a wrapper with a visible `<label>` and native `<select data-testid="department-filter">` (All departments has value `""`), and a count line `<p data-testid="roles-count" aria-live="polite">`. Both wrapper and count line carry `hidden` in the HTML (AD-4).
- Directly after the roles grid, inside the same branch, one self-contained `<script is:inline>` (not a module script). It defines `apply(department: string | null)` (AD-3: the only writer of select, cards and count; `null` alone means All departments), the count formatter (AD-5), unhides wrapper and count line, calls `apply(null)`, and on `change` maps `""` to `null` and calls `apply`.
- `src/components/RoleCard.astro` already sets `data-department={job.department}`; filtering only toggles the `hidden` attribute (AD-2). Tailwind v4's base `[hidden]` rule beats the card's `block` class.

This Story does not touch the address: reading and writing `?department=` is Story 1.2. Keep `apply` taking the Department as an argument so 1.2 can call it from the address.

Verify with `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:unit`, `npm run test:e2e`. Extend `e2e-tests/home.spec.ts`: add one shared helper that reads each `src/content/jobs/*.md` `department:` line, trims it, and passes it through the imported `listDepartments` for expected options and counts (no test sorts or de-duplicates on its own). Assert `toBeVisible()`/`toBeHidden()`, not the attribute. Cover the no-JavaScript case with a context created with `javaScriptEnabled: false`.
