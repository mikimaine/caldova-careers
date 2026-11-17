# Story 1: Filter open roles by department

<!-- foundry-story: story_01a1eb3e-2f29-7664-bd5c-257ab46b47d5 -->

## Story

A visitor on the careers page picks a department and sees only the open roles in it, and can share or bookmark that filtered view.

## Acceptance Criteria

- Given the careers page, when it loads, then a labelled department control above the roles grid offers "All departments" (selected by default) plus each department that has at least one posting, listed once each in alphabetical order. <!-- ac_01a1eb3e-2f2a-7321-a423-a5d73235faf8 -->
- Given a department is chosen, when the selection changes, then only role cards whose department matches stay visible, the page does not reload, and the URL query becomes ?department=<name>. <!-- ac_01a1eb3e-2f2a-7105-8fe0-0f4ec69c1912 -->
- Given a URL with ?department=<name> for a listed department, when the page loads, then that department is preselected and only its roles are shown; given a value that matches no department, then all roles are shown and "All departments" is selected. <!-- ac_01a1eb3e-2f2a-70db-988f-59982d786f48 -->
- Given "All departments" is chosen, when the selection changes, then every role card is visible again and the department query parameter is removed. <!-- ac_01a1eb3e-2f2a-7169-9b0f-21a749f69845 -->
- Given any selection, when the visible set changes, then a polite live region states how many roles are shown (e.g. "3 open roles in Finance"), and the page still has no axe wcag2a/wcag2aa violations. <!-- ac_01a1eb3e-2f2a-7cbc-a9c4-0a4781c8de0a -->
- Given there are no postings at all, when the page loads, then the existing empty state is shown and no department control is rendered. <!-- ac_01a1eb3e-2f2a-76bb-b11a-bff6484deb8c -->

## Notes

Covers: none

Where the code is:
- `src/pages/index.astro` renders the listing. It is prerendered (`export const prerender = true`, `output: static` in `astro.config.mjs`), so filtering must happen client-side in a small inline `<script>` on this page; do not make the page on-demand.
- `src/components/RoleCard.astro` already sets `data-department={job.department}` and `data-testid="role-card"` on each card: filter on that attribute (toggle `hidden`), do not re-render.
- Department names come from front matter `department` (schema in `src/content.config.ts`); several contain `&` ("Contact Center & Sales Enablement", "Manufacturing & Field Service", "Research & Development"), so use `URLSearchParams` for encoding and compare exact strings.
- Add a pure helper (e.g. `listDepartments(jobs: Job[]): string[]`, unique and sorted) to `src/lib/jobs.ts` next to `sortByNewest`, with unit tests in `src/lib/jobs.test.ts` (vitest).

Approach: a native `<select>` with a visible `<label>` keeps it accessible with no extra JS for keyboard support. Update the URL with `history.replaceState`. Match the existing Tailwind slate/blue styling. Give the control `data-testid="department-filter"` and the live region `data-testid="roles-count"`.

Verify: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:unit`, and `npm run test:e2e`. Extend `e2e-tests/home.spec.ts` (it derives the role count from `src/content/jobs`) with tests for choosing a department, loading with `?department=Finance` (two Finance roles today), an unknown value, resetting to all, and keep the axe test passing with the control present.
