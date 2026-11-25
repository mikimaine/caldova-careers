# Implementation Readiness Assessment Report

**Date:** 2026-11-17
**Initiative:** Filter open roles by department
**Project:** mikimaine/caldova-careers
**Assessed by:** an agent of this Thread, in the Fast pace

## Document Inventory

- **PRD:** "PRD" (kind `prd`, 2 versions, final 2026-11-17)
- **Architecture:** "Architecture" (kind `architecture`, 2 versions, final 2026-11-17)
- **Epics:** "Epics and coverage" (kind `epics`, 2 versions, 2026-11-17)
- **UX:** none (normal for a Feature; see UX Alignment)
- **Logs (not assessed):** "PRD log", "Architecture log"
- **Records:** 1 epic, 2 Stories (2 in backlog, 0 ready, 0 with a Run, 0 done)

No duplicates; no split Documents.

## PRD Analysis

### Functional Requirements

FR-1: A visitor can see a Department filter listing All departments and every Department with at least one Posting, exactly once each, alphabetically; All departments is selected by default; no filter when there are no Postings.
FR-2: A visitor can choose a Department and see only its Role cards, in unchanged newest-first order, without a page load; All departments shows every card again.
FR-3: A visible, polite live-region line states how many roles are shown ("2 open roles in Finance", "1 open role in Sales", "14 open roles").
FR-4: The choice is reflected in the `department` query parameter (set, or removed for All departments), adding no history entries.
FR-5: An address with `department` opens that Filtered view; unknown values show all; matching is exact and case-sensitive; the address decides the choice on every load including reload and Back/Forward; non-matching cards never flash on load.

Total FRs: 5

### Non-Functional Requirements

NFR-1: Visible label, keyboard-operable, existing axe check (WCAG 2 A/AA) passes.
NFR-2: Listing stays prerendered; no server endpoint, table or runtime dependency added.
NFR-3: Without JavaScript the listing is exactly today's, with no filter or count line.
NFR-4: Lint, typecheck, build, unit and e2e suites stay green.

Total NFRs: 4

### Additional Requirements

Architecture decisions AD-1 to AD-5 (single Department derivation; hide-only filtering on `data-department`; address as single source of truth with `null` for All departments; hidden-until-enhanced filter with an inline script after the grid; one count formatter).

### PRD Completeness Assessment

Complete for a Feature of this size. Every FR has testable consequences. Seven assumptions are indexed for confirmation; two Open Questions (detail-page back link keeping the filter, per-option counts) are deferred and non-blocking.

## Epic Coverage Validation

### Coverage Matrix

| FR | PRD Requirement | Epic Coverage | Status |
| --- | --- | --- | --- |
| FR-1 | Offer the Departments | Epic 1, Story 1 | Covered |
| FR-2 | Narrow the listing | Epic 1, Story 1 | Covered |
| FR-3 | State how many roles are shown | Epic 1, Story 1 | Covered |
| FR-4 | Reflect the choice in the address | Epic 1, Story 1.2 | Covered |
| FR-5 | Open a Filtered view from its address | Epic 1, Story 1.2 | Covered |

| NFR | Coverage | Status |
| --- | --- | --- |
| NFR-1 | Story 1 | Covered |
| NFR-2 | Story 1 | Covered |
| NFR-3 | Story 1 (and Story 1.2's no-JavaScript criterion) | Covered |
| NFR-4 | Story 1 | Covered |

### Missing Requirements

None.

### Broken Traces

None. Both Stories' notes begin with a `Covers:` line; every FR, NFR and AD id named exists.

### Coverage Statistics

- Total PRD FRs: 5
- FRs covered in epics: 5
- Coverage percentage: 100%

## UX Alignment Assessment

### UX Document Status

Not found.

### Alignment Issues

None. The feature extends an existing screen: the Open roles listing in `src/pages/index.astro`, with `src/components/RoleCard.astro` and the slate/blue Tailwind styling, is the design. The PRD specifies the interaction (labelled native select, keyboard use, live count) and the architecture's conventions fix test ids and styling.

### Warnings

None.

## Epic Quality Review

### Critical Violations

None.

### Major Issues

None.

### Minor Concerns

- Story 1 (Filter the open roles listing by department) keeps the key `1` from the Small plan instead of `1.1`; the Host does not allow renumbering. The Epics and coverage Document records it as the epic's first Story.
- Story 1's first and last criteria each bundle several checks (options plus the unit test; axe plus keyboard plus every suite). Each part is still separately testable.

### Best Practices Compliance

Epic 1, Find open roles by department:

- [x] Epic delivers user value
- [x] Epic can function independently
- [x] Stories appropriately sized (one page, one script, one Run each)
- [x] No forward dependencies (Story 1.2 depends on Story 1, recorded)
- [x] Database tables created when needed (none needed)
- [x] Clear acceptance criteria (Given/When/Then)
- [x] Traceability to FRs maintained

## Summary and Recommendations

### Overall Readiness Status

READY

### Critical Issues Requiring Immediate Action

None.

### Recommended Next Steps

1. Run Story 1 (Filter the open roles listing by department).
2. After it merges, run the ready check again to move Story 1.2 to Ready, then run it.
3. Confirm or correct the PRD's seven assumptions, especially that the department in the address is case-sensitive and that "← All open roles" keeps going to the full listing.

### Final Note

This assessment identified 2 issues across 1 category, both minor. Nothing blocks implementation. These findings can be used to improve the artifacts or you may choose to proceed as-is.
