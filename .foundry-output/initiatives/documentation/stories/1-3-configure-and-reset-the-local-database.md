# Story 1.3: Configure and reset the local database

<!-- foundry-story: story_01a1e69c-2ca9-7a01-b041-b6c16ea462b3 -->

## Story

A developer can point the app at a different database, start again from an empty one, and know which database the tests use.

## Acceptance Criteria

- Given the documentation, when a reader looks for configuration, then it documents DATABASE_URL and its default of file:./.data/careers.db, used by both src/lib/db.ts and drizzle.config.ts. <!-- ac_01a1e69c-2ca9-7582-8393-19a0c0d664c5 -->
- Given the documentation, when a reader wants a clean database, then it says .data/ is gitignored and tells them to delete it and run npm run db:setup, which predev and prebuild also run. <!-- ac_01a1e69c-2ca9-724d-810e-27e0af9ddec7 -->
- Given the documentation, when a reader asks which database the end-to-end tests use, then it says playwright.config.ts sets DATABASE_URL to file:./.data/e2e.db for the server it starts. <!-- ac_01a1e69c-2ca9-7331-b430-6a39abfd47ca -->
- Given the documentation, when a reader changes db/schema.ts, then it says to run npm run db:generate for a migration and npm run db:migrate to apply it. <!-- ac_01a1e69c-2ca9-7876-8c68-cf69cf5aa2e4 -->
- Every command, path and variable the new text names exists in the repository as described. <!-- ac_01a1e69c-2ca9-710f-abea-844552154480 -->
- npm run lint still passes. <!-- ac_01a1e69c-2ca9-7b49-a5fc-3f915536e069 -->
