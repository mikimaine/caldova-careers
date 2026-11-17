# Story 1.2: Share and reopen a filtered view of open roles

<!-- foundry-story: story_01a1eb6f-5e97-7f60-9bb5-6f1341ea654a -->

Depends on: 1

## Story

As a hiring manager or a job seeker, I want the page address to keep the chosen department, so that a link, bookmark, reload or Back opens the same filtered view.

## Acceptance Criteria

- Given the listing, when a Department is chosen, then the address's department query parameter, read with searchParams.get, equals the Department exactly, including 'Research & Development', and when All departments is chosen, then the parameter is removed. <!-- ac_01a1eb6f-5e98-7b36-8c9b-5d8581eeac08 -->
- Given the choice has changed several times, when the visitor presses Back, then the browser leaves the listing, because changing the choice adds no history entries. <!-- ac_01a1eb6f-5e98-723a-bf86-882e7f68eadc -->
- Given an address with ?department=Finance, when the listing loads, then Finance is selected, only Finance Role cards are visible, the count line reads '2 open roles in Finance', and no non-Finance card is visible when the DOMContentLoaded event fires. <!-- ac_01a1eb6f-5e98-70fa-9d36-77e472517fc7 -->
- Given an address whose department is empty, unknown, or differs only in case (e.g. ?department=finance), when the listing loads, then All departments is selected and every Role card is visible. <!-- ac_01a1eb6f-5e98-7961-8ecc-b43aae52dec8 -->
- Given a Filtered view, when the visitor reloads, or opens a role and comes back with Back, then the Department filter, the visible Role cards and the address agree, whatever value the browser restores into the select. <!-- ac_01a1eb6f-5e98-7008-b90a-9af07a05bb16 -->
- Given JavaScript is disabled, when an address with ?department=Finance loads, then every Role card is visible and no filter or count line is shown. <!-- ac_01a1eb6f-5e98-71de-a41f-d0fd2607566a -->

## Notes

Covers: FR-4, FR-5; binds AD-3, AD-4

Builds on Story 1.1's inline script in `src/pages/index.astro`; do not add a second script or a second writer of the select, cards or count.

- On load, read `department` with `new URLSearchParams(location.search)`; a missing, empty or unmatched value (checked against the rendered non-empty option values, exact and case-sensitive) becomes `null`; then call `apply`.
- In the `change` handler, before `apply`, write the address with `history.replaceState` (`params.set('department', value)` or `params.delete('department')`). Only `URLSearchParams` writes the address, so spaces become `+`.
- Add a `pageshow` listener: when `event.persisted`, call `apply` again from the address (AD-3), so a back/forward-cache restore or restored form state cannot disagree with the address.
- The script already runs before first paint because it is `is:inline` right after the grid (AD-4); keep it that way.

Verify with `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`. In `e2e-tests/home.spec.ts`, read the address only via `new URL(page.url()).searchParams.get('department')`; get expected counts from Story 1.1's shared helper; for the no-flash criterion, use `page.goto(url, { waitUntil: 'domcontentloaded' })` and assert non-Finance cards are hidden.
