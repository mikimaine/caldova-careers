# Story 1.2: Follow an application from the form to the database

<!-- foundry-story: story_01a1e69c-2c11-75dc-8b5b-50f35ee69556 -->

## Story

A developer changing the apply flow can see the whole path it takes, and what each step rejects, before touching the code.

## Acceptance Criteria

- Given the documentation, when a reader traces a submission, then the path is named end to end: the form in src/components/ApplyForm.astro on /roles/[slug], the POST endpoint src/pages/api/apply.ts, the validation in src/lib/applications.ts, the insert into the applications table, and the redirect to /thanks. <!-- ac_01a1e69c-2c11-7e49-9300-b0bd813765f5 -->
- Given the documentation, when a reader checks what is validated, then the fields and limits of applicationSchema are listed, including that note and links are optional and that email must be a valid address. <!-- ac_01a1e69c-2c11-7d3d-be7f-c7e890cb20c5 -->
- Given the documentation, when a reader asks what happens to a bad submission, then it says invalid input redirects to /?error=invalid and an unknown jobId to /?error=unknown-role, both with status 303. <!-- ac_01a1e69c-2c11-7de9-8cdf-a34da08dc84c -->
- Given the documentation, when a reader wonders why this one route is server-rendered, then it says /api/apply sets prerender = false and needs the Node adapter, while every other route is prerendered. <!-- ac_01a1e69c-2c11-76d2-a1eb-0b2ab0072544 -->
- Given the documentation, when a reader looks at the stored row, then it says jobId is a logical reference to a Markdown posting and not a foreign key. <!-- ac_01a1e69c-2c11-7b9a-99c1-10279d2e3c91 -->
- Every command, path and table name the new text names exists in the repository as described. <!-- ac_01a1e69c-2c11-7b9d-952b-209b71f38804 -->
- npm run lint still passes. <!-- ac_01a1e69c-2c11-7579-986a-008ebddf6329 -->
