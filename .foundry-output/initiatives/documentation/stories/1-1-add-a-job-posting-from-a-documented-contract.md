# Story 1.1: Add a job posting from a documented contract

<!-- foundry-story: story_01a1e69c-2b64-7af0-976a-84e50d786128 -->

## Story

Someone adding a role writes the Markdown file, knows every frontmatter field it must carry, and sees it on the site without opening the collection schema or any page code.

## Acceptance Criteria

- Given the documentation, when a reader looks for how to add a role, then it names src/content/jobs/, says one Markdown file is one role, and says the filename becomes the slug in /roles/<slug> and the jobId recorded on an application. <!-- ac_01a1e69c-2b64-7c4b-8956-58900f4d2b9e -->
- Given the documentation, when a reader checks the frontmatter contract, then every field of the jobs collection in src/content.config.ts is listed, with type's allowed values (Full-time, Part-time, Contract) and remote's default of false. <!-- ac_01a1e69c-2b64-7637-8af5-057396a2d26d -->
- Given the documentation, when a reader wants an example, then it shows a complete frontmatter block and body that matches a file already in src/content/jobs/. <!-- ac_01a1e69c-2b64-7a23-b8b5-3753764ecec5 -->
- Given a role file whose frontmatter breaks the schema, when the documentation explains validation, then it says Astro checks frontmatter against the collection schema and the dev server or build fails until it is fixed. <!-- ac_01a1e69c-2b64-7043-82ba-667a30f4de6c -->
- Given the README, when a reader looks for how to add content, then it links to this guide. <!-- ac_01a1e69c-2b64-75c8-8151-ea5b1b09ce10 -->
- Every command, path and field name the new text names exists in the repository as described. <!-- ac_01a1e69c-2b64-7ffc-9a7c-687f0732242b -->
- npm run lint still passes. <!-- ac_01a1e69c-2b64-75da-b558-58b6eec4fa9a -->
