# Documentation: PRD

## Who it is for

Contributors to Caldova Careers, and workshop learners working in a copy of the template, who need to change the product rather than just run it. Three tasks matter most:

- **Content editors** add or change a job posting.
- **Developers** change the apply flow: the form, its validation, or what gets stored.
- **Developers and CI users** work with the local database: point it elsewhere, reset it, change its schema.

## Problem

The README says *where* things are (a project structure list, a data model summary, a scripts list) but not *how to do* any of these tasks. To add a role today you have to read `src/content.config.ts` to find the frontmatter contract. To change the apply flow you have to read four files (`src/components/ApplyForm.astro`, `src/pages/api/apply.ts`, `src/lib/applications.ts`, `db/schema.ts`) to learn what is validated, what each failure does, and why one route is server-rendered when all the others are static. `DATABASE_URL` is not mentioned anywhere outside the code, nor is how to reset the database or which one the end-to-end tests use.

The code is small and well commented, so the facts exist. They are just scattered, and finding them costs every newcomer the same half hour.

## Goal

A contributor can add a role, change the apply flow, or reset the database from the documentation alone, without opening the schema, the endpoint or the config files first.

## In scope

1. **Adding a job posting.** Where role files live, that one file is one role, how the filename becomes the slug and the `jobId`, the full frontmatter contract, a working example, and what happens when frontmatter is invalid.
2. **The apply flow, end to end.** Form to endpoint to validation to insert to redirect; the validation rules; what each failure returns; why `/api/apply` is the only on-demand route; that `jobId` is a logical reference, not a foreign key.
3. **Local database configuration.** `DATABASE_URL` and its default, resetting the database, the separate end-to-end database, and the migration workflow after a schema change.
4. A link from the README to the new documentation, so it can be found from the front page.

## Out of scope

- Setup, prerequisites and running the test suites. The README already covers getting started and scripts, and a separate "Improve the README" Initiative exists for the upstream sample; this work must not rewrite those sections.
- Workshop and template material (bootstrap issues, Copilot instructions, the `quality-checks` skill).
- Deployment or production hosting. The README states the app is not intended for production.
- Generated API reference, TSDoc changes, or any change to application code, schema or tests.
- Contribution process (`CONTRIBUTING.md` workflow, PR guidelines), beyond linking if useful.

## Requirements

Each requirement is something a reviewer can check against the repository.

### R1. Job postings (Story 1.1)

- R1.1 Names `src/content/jobs/`, says one Markdown file is one role, and says the filename becomes the slug in `/roles/<slug>` and the `jobId` stored on an application.
- R1.2 Lists every field of the `jobs` collection in `src/content.config.ts`: `title`, `department`, `location`, `type`, `remote`, `postedDate`, `summary`. States `type` is one of `Full-time`, `Part-time`, `Contract`, and `remote` defaults to `false`.
- R1.3 Shows a complete frontmatter block and body that matches a file already in `src/content/jobs/`.
- R1.4 Says Astro validates frontmatter against the collection schema and the dev server or build fails until it is fixed.

### R2. Apply flow (Story 1.2)

- R2.1 Names the path end to end: `ApplyForm.astro` on `/roles/[slug]`, POST to `src/pages/api/apply.ts`, `applicationSchema` in `src/lib/applications.ts`, insert into the `applications` table, redirect to `/thanks`.
- R2.2 Lists the validated fields and limits: `jobId` required; `name` required, at most 200 characters; `email` a valid address, at most 320; `note` optional, at most 2000; `links` optional, at most 500.
- R2.3 States failures: invalid input redirects to `/?error=invalid`, an unknown `jobId` to `/?error=unknown-role`, both with status 303.
- R2.4 Explains that `/api/apply` sets `prerender = false` and needs the `@astrojs/node` adapter, while every other route is prerendered.
- R2.5 States `jobId` is a logical reference to a Markdown posting, checked by the endpoint, not a database foreign key.

### R3. Local database (Story 1.3)

- R3.1 Documents `DATABASE_URL`, its default `file:./.data/careers.db`, and that both `src/lib/db.ts` and `drizzle.config.ts` read it.
- R3.2 Says `.data/` is gitignored, and to reset you delete it and run `npm run db:setup`, which `predev` and `prebuild` also run.
- R3.3 Says `playwright.config.ts` sets `DATABASE_URL` to `file:./.data/e2e.db` for the server it starts, so end-to-end runs do not touch the dev database.
- R3.4 After a change to `db/schema.ts`: `npm run db:generate` creates a migration and `npm run db:migrate` applies it.

### R4. Across all documentation

- R4.1 Every command, path, field, variable and table name in the new text exists in the repository as described at the time of merge.
- R4.2 The README links to the new documentation.
- R4.3 `npm run lint` still passes. No application code, schema, migration or test changes.
- R4.4 Plain Markdown that renders on GitHub, in the same voice as the existing README. Where the new docs live (a `docs/` folder or new README sections) is the implementer's choice, as long as R4.2 holds.

## Success measures

- A reviewer can complete each of the three tasks using only the new documentation, and every fact they relied on checks out against the code.
- No requirement above needs the reader to open `src/content.config.ts`, `src/pages/api/apply.ts`, `src/lib/applications.ts`, `src/lib/db.ts`, `drizzle.config.ts` or `playwright.config.ts` to answer it.

## Delivery

One epic, "A contributor can add a role and change the apply flow from the docs alone", with three independent Stories (1.1, 1.2, 1.3). They have no dependencies on each other and can run in parallel. If two of them add to the same new file, the later one rebases on the earlier.

## Risks

- **Drift.** Docs that quote limits and URLs go stale when the code changes. Mitigation: R4.1 is checked at review, and the docs name the source file for each fact so a future change knows where to look.
- **Overlap with the upstream README Initiative.** That work targets the upstream Project, not this fork. Keep this Initiative to the three task guides and a README link, so merging upstream changes stays easy.
