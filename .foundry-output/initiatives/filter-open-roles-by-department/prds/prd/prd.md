---
title: Filter open roles by department
status: final
created: 2026-11-17
updated: 2026-11-17
---

# PRD: Filter open roles by department

## 0. Document Purpose

For the Caldova Careers maintainers and the architecture and Stories stages that follow. It adds one capability to the existing open roles listing (`/`): narrowing it to one department. Vocabulary is fixed by the Glossary (§3); features carry globally numbered FRs; inferences are tagged `[ASSUMPTION]` and indexed in §9.

## 1. Vision

Caldova lists every open role on one page, newest first. Today that is 14 roles across 10 departments, and a visitor who only cares about Finance or Technology has to scan every card to find theirs. As postings grow, the page gets harder to use for exactly the people most likely to apply.

A department filter lets a visitor say "show me Finance" and see only those roles, instantly, on the same page. The filtered view has its own address, so a recruiter can send a candidate a link to "all our Technology roles" and the candidate lands on exactly that.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** as a job seeker with a field in mind, see only the roles in my field without reading every card.
- **Functional:** as a recruiter or hiring manager, send someone a link that opens on my department's roles.
- **Contextual:** do it on a phone or with a keyboard or screen reader as easily as with a mouse.

### 2.2 Key User Journeys

- **UJ-1. Marta narrows the listing to Finance.** `[ASSUMPTION]` Marta, a financial analyst browsing on her phone, opens the careers site from a search result. She lands on the open roles listing, picks "Finance" in the department filter, and the listing immediately shows only the two Finance roles, with a line saying how many roles are shown. She opens one, reads it, uses "← All open roles" to go back, and sees every role again. **Edge case:** she wants to look wider, picks "All departments", and every role is back.
- **UJ-2. Jonah shares his department's roles.** `[ASSUMPTION]` Jonah, a hiring manager in Technology, filters the listing to Technology, copies the address from the browser, and posts it in a community chat. A candidate opens the link and lands on the listing already filtered to Technology. **Edge case:** months later Technology has no open roles; the old link opens the full listing instead of an empty page.

## 3. Glossary

- **Open roles listing** — the page at `/` that shows every Posting as a Role card, newest first.
- **Posting** — one open role, defined by one Markdown file in the jobs content collection. Each Posting has exactly one Department.
- **Open role** — the visitor-facing name for a Posting, used in page text ("2 open roles in Finance").
- **Role card** — a Posting's summary card in the Open roles listing, linking to its detail page.
- **Department** — the `department` value of a Posting's front matter, with surrounding whitespace trimmed and compared as an exact, case-sensitive string; spelling Departments consistently is the content author's job. The set of Departments is the set of distinct values across current Postings.
- **Department filter** — the control on the Open roles listing that selects one Department or All departments.
- **All departments** — the Department filter's default choice: no narrowing.
- **Filtered view** — the Open roles listing narrowed to one Department, identified by its address.

## 4. Features

### 4.1 Narrow the Open roles listing by Department

**Description:** Above the Role cards, a labelled Department filter offers All departments followed by each Department that has at least one Posting. Choosing a Department hides every Role card from other Departments at once, without a page load; choosing All departments shows them all again. A short line states how many roles are shown, and assistive technology announces it when it changes. Order of the remaining Role cards is unchanged (newest first). Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Offer the Departments that have Postings

A visitor can see a Department filter listing All departments and every Department with at least one Posting. Realizes UJ-1.

**Consequences (testable):**
- The options are All departments, then each Department exactly once, in alphabetical order.
- A Department appears if and only if at least one Posting has it; adding or removing a Posting file changes the options at the next build with no other edit.
- All departments is selected when the page loads with no Department in its address.
- When there are no Postings, the existing empty state shows and no Department filter is rendered.

#### FR-2: Narrow the listing to one Department

A visitor can choose a Department and see only that Department's Role cards. Realizes UJ-1.

**Consequences (testable):**
- After choosing a Department, every visible Role card has that Department and no Role card with that Department is hidden.
- Visible Role cards keep their newest-first order.
- The change happens without a full page load.
- Choosing All departments shows every Role card again.

#### FR-3: State how many roles are shown

A visitor can tell how many roles match the current choice, including with a screen reader. Realizes UJ-1.

**Consequences (testable):**
- A visible line states the count and the Department, e.g. "2 open roles in Finance" or "1 open role in Sales", or the total for All departments, e.g. "14 open roles". The noun is singular for a count of one.
- The line is a polite live region, so the new count is announced after each change without moving focus.

**Feature-specific NFRs:**
- The Department filter has a visible label, is fully operable by keyboard, and the page passes the existing automated axe check (WCAG 2 A and AA rules) with it present.

### 4.2 Shareable Filtered view

**Description:** The chosen Department is kept in the page address, so a Filtered view can be copied, bookmarked, reloaded or shared and opens the same way. An address naming a Department that no longer has Postings opens the full listing rather than an empty one. Realizes UJ-2.

**Functional Requirements:**

#### FR-4: Reflect the choice in the address

A visitor's current choice is reflected in the address of the page. Realizes UJ-2.

**Consequences (testable):**
- Choosing a Department sets the `department` query parameter to its exact name, URL-encoded (Departments such as "Research & Development" round-trip intact).
- Choosing All departments removes the `department` query parameter.
- Changing the choice does not add browser history entries; Back leaves the listing. `[ASSUMPTION]`

#### FR-5: Open a Filtered view from its address

A visitor who opens an address with a `department` query parameter lands on that Filtered view. Realizes UJ-2.

**Consequences (testable):**
- An address naming a current Department opens with that Department selected and only its Role cards visible.
- An address naming no current Department (misspelt, or its last Posting removed) opens with All departments selected and every Role card visible.
- Matching is exact and case-sensitive. `[ASSUMPTION]`
- The address decides the choice on every load, including reload and Back/Forward: the Department filter always shows the same choice as the visible Role cards, whatever value the browser restores into the control.
- Non-matching Role cards are hidden before the listing is first painted; they do not flash visible and then disappear.

## 5. Cross-Cutting NFRs

- **Static site kept:** the Open roles listing stays prerendered; filtering happens in the browser on the cards already on the page. No server endpoint, database table or new runtime dependency is added.
- **Works without JavaScript:** with scripts disabled or failed, the listing is exactly today's: every Role card visible, and neither the Department filter nor the count line shown. `[ASSUMPTION]`
- **Existing checks stay green:** lint, typecheck, build, unit and end-to-end suites, including the existing listing tests.

## 6. Non-Goals (Explicit)

- Filtering by anything other than Department (location, employment type, remote) or keyword search.
- Choosing several Departments at once.
- A curated Department catalogue, renaming or grouping Departments; Departments are whatever the Postings say.
- Remembering a visitor's last choice across visits.
- Changes to role detail pages or the apply flow.

## 7. MVP Scope

### 7.1 In Scope

- FR-1 to FR-5 on the Open roles listing.
- Unit tests for deriving Departments and end-to-end tests for each FR.

### 7.2 Out of Scope for MVP

- "← All open roles" on a role detail page returning to the Filtered view the visitor came from: it keeps going to the full listing. `[ASSUMPTION]`
- Showing a per-Department role count inside each option: a candidate for later, not needed to find roles.
- Usage analytics for the Department filter: the site has none today.

## 8. Success Metrics

The site has no analytics, so success is judged by acceptance, not measurement. `[ASSUMPTION]`

- **SM-1:** Every FR's consequences are covered by an automated test that passes in CI. Validates FR-1 to FR-5.
- **SM-2:** The existing axe accessibility test passes with the Department filter present. Validates FR-1, FR-3.
- **SM-C1 (counter-metric):** Do not make the tests pass by giving up the static, dependency-free listing (an on-demand page, a server filter endpoint, a UI library). Counterbalances SM-1.

## 9. Open Questions

1. Should "← All open roles" on a role detail page return to the Filtered view the visitor came from? Deferred (§7.2); owner: maintainers; revisit if visitors report losing their filter.
2. Should options show a per-Department count, e.g. "Finance (2)"? Deferred; revisit when Postings exceed about 30.

## 10. Assumptions Index

- §2.2 UJ-1, UJ-2 — personas and journeys inferred from the request and the site, not narrated by a user.
- §4.2 FR-4 — changing the choice replaces the history entry instead of adding one.
- §4.2 FR-5 — Department matching in the address is exact and case-sensitive.
- §5 — without JavaScript the listing is exactly today's, with no Department filter or count line.
- §7.2 — "← All open roles" keeps going to the full listing.
- §8 — success is judged by passing tests, as the site has no analytics.
