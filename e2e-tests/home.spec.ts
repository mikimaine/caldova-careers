import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listDepartments } from '../src/lib/jobs';
import type { Job } from '../src/types/job';

// Derive the expected posting count from the job content collection so this
// assertion stays correct as roles are added or removed.
const jobsDir = fileURLToPath(new URL('../src/content/jobs', import.meta.url));
const expectedRoleCount = readdirSync(jobsDir).filter((f) => f.endsWith('.md')).length;

/**
 * Read each posting's `department:` frontmatter line, trimmed like the content
 * schema does, and derive the expected filter options through the app's own
 * `listDepartments` plus the number of postings per Department.
 */
function readExpectedDepartments(): {
    departments: string[];
    countFor: (department: string) => number;
} {
    const postingDepartments = readdirSync(jobsDir)
        .filter((f) => f.endsWith('.md'))
        .map((file) => {
            const source = readFileSync(join(jobsDir, file), 'utf8');
            const match = source.match(/^department:(.*)$/m);
            if (!match) throw new Error(`${file} has no department line`);
            return match[1].trim().replace(/^(["'])(.*)\1$/, '$2').trim();
        });
    const departments = listDepartments(
        postingDepartments.map((department) => ({ department }) as Job),
    );
    return {
        departments,
        countFor: (department) =>
            postingDepartments.filter((d) => d === department).length,
    };
}

const expected = readExpectedDepartments();

function countLine(visible: number, department: string | null): string {
    const noun = visible === 1 ? 'open role' : 'open roles';
    return department === null ? `${visible} ${noun}` : `${visible} ${noun} in ${department}`;
}

test.describe('Open roles listing', () => {
    test('shows the roles grid with all postings', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Open roles' })).toBeVisible();

        const grid = page.getByTestId('roles-grid');
        await expect(grid).toBeVisible();
        await expect(page.getByTestId('role-card')).toHaveCount(expectedRoleCount);
    });

    test('links through to a role detail page', async ({ page }) => {
        await page.goto('/');
        const firstCard = page.getByTestId('role-card').first();
        const title = await firstCard.getByTestId('role-title').textContent();
        await firstCard.click();
        await expect(page.getByTestId('role-detail-title')).toHaveText(title!.trim());
        await expect(page.getByTestId('apply-form')).toBeVisible();
    });

    for (const { title, location } of [
        { title: 'Senior Frontend Engineer', location: 'Remote (US & Canada)' },
        { title: 'Financial Analyst', location: 'Woodinville, WA, USA' },
    ]) {
        test(`keeps ${title} location on details, not starter cards`, async ({ page }) => {
            await page.goto('/');
            const card = page.getByTestId('role-card').filter({
                has: page.getByRole('heading', { name: title, exact: true }),
            });

            await expect(card).toBeVisible();
            await expect(card.getByText(location, { exact: true })).toHaveCount(0);
            await card.click();
            await expect(page.getByText(location, { exact: true })).toBeVisible();
        });
    }

    test('[ac_01a1eb6f-5dcc-7d52-a21d-5990eb863602] has no automatically detectable accessibility violations', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByTestId('department-filter')).toBeVisible();
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();
        expect(results.violations).toEqual([]);
    });
});

test.describe('Department filter', () => {
    test('[ac_01a1eb3e-2f2a-7321-a423-a5d73235faf8] offers All departments then every Department once, alphabetically', async ({ page }) => {
        await page.goto('/');
        const filter = page.getByLabel('Department', { exact: true });
        await expect(filter).toBeVisible();
        await expect(filter).toHaveAttribute('data-testid', 'department-filter');
        await expect(filter).toHaveValue('');
        await expect(filter.locator('option')).toHaveText([
            'All departments',
            ...expected.departments,
        ]);
        await expect(filter.locator('option:checked')).toHaveText('All departments');
    });

    test('[ac_01a1eb3e-2f2a-7105-8fe0-0f4ec69c1912] shows only the chosen Department, newest first, without reloading', async ({ page }) => {
        await page.goto('/');
        const cards = page.getByTestId('role-card');
        await expect(cards).toHaveCount(expectedRoleCount);
        const allCards = await cards.evaluateAll((els) =>
            els.map((el) => ({
                id: el.getAttribute('data-job-id'),
                department: el.getAttribute('data-department'),
            })),
        );
        await page.evaluate(() => {
            (window as unknown as { filterMarker?: boolean }).filterMarker = true;
        });

        const filter = page.getByTestId('department-filter');
        for (const department of expected.departments) {
            await test.step(`choose ${department}`, async () => {
                await filter.selectOption(department);
                const visibleCards = cards.filter({ visible: true });
                await expect(visibleCards).toHaveCount(expected.countFor(department));
                const expectedIds = allCards
                    .filter((card) => card.department === department)
                    .map((card) => card.id);
                expect(
                    await visibleCards.evaluateAll((els) =>
                        els.map((el) => el.getAttribute('data-job-id')),
                    ),
                ).toEqual(expectedIds);
                for (const [index, card] of allCards.entries()) {
                    const locator = cards.nth(index);
                    if (card.department === department) {
                        await expect(locator).toBeVisible();
                    } else {
                        await expect(locator).toBeHidden();
                    }
                }
            });
        }

        expect(
            await page.evaluate(
                () => (window as unknown as { filterMarker?: boolean }).filterMarker,
            ),
        ).toBe(true);
    });

    test('[ac_01a1eb3e-2f2a-7169-9b0f-21a749f69845] shows every card again when All departments is chosen', async ({ page }) => {
        await page.goto('/');
        const filter = page.getByTestId('department-filter');
        const cards = page.getByTestId('role-card');
        const [department] = expected.departments;

        await filter.selectOption(department);
        await expect(cards.filter({ visible: true })).toHaveCount(expected.countFor(department));

        await filter.selectOption({ label: 'All departments' });
        await expect(filter).toHaveValue('');
        await expect(cards.filter({ visible: true })).toHaveCount(expectedRoleCount);
        for (let index = 0; index < expectedRoleCount; index++) {
            await expect(cards.nth(index)).toBeVisible();
        }
    });

    test('[ac_01a1eb3e-2f2a-7cbc-a9c4-0a4781c8de0a] count line matches the visible cards for every choice', async ({ page }) => {
        await page.goto('/');
        const filter = page.getByTestId('department-filter');
        const count = page.getByTestId('roles-count');
        const visibleCards = page.getByTestId('role-card').filter({ visible: true });

        await expect(count).toBeVisible();
        await expect(count).toHaveAttribute('aria-live', 'polite');
        await expect(count).toHaveText(countLine(expectedRoleCount, null));

        for (const department of expected.departments) {
            await filter.selectOption(department);
            const visible = expected.countFor(department);
            await expect(visibleCards).toHaveCount(visible);
            await expect(count).toHaveText(countLine(visible, department));
        }

        await filter.selectOption('');
        await expect(visibleCards).toHaveCount(expectedRoleCount);
        await expect(count).toHaveText(countLine(expectedRoleCount, null));
    });

    test('[ac_01a1eb6f-5dcc-70b1-9605-8a8965b20f09] without JavaScript shows every card and no filter or count', async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false });
        try {
            const page = await context.newPage();
            await page.goto('/');
            const cards = page.getByTestId('role-card');
            await expect(cards).toHaveCount(expectedRoleCount);
            for (let index = 0; index < expectedRoleCount; index++) {
                await expect(cards.nth(index)).toBeVisible();
            }
            await expect(page.getByTestId('department-filter')).toBeHidden();
            await expect(page.locator('label[for="department-filter"]')).toBeHidden();
            await expect(page.getByTestId('roles-count')).toBeHidden();
        } finally {
            await context.close();
        }
    });

    test('[ac_01a1eb6f-5dcc-7d52-a21d-5990eb863602] is operable by keyboard alone and passes axe when filtered', async ({ page }) => {
        await page.goto('/');
        const filter = page.getByTestId('department-filter');
        await expect(filter).toBeVisible();

        await test.step('reach the filter with Tab', async () => {
            for (let presses = 0; presses < 30; presses++) {
                if (await filter.evaluate((el) => el === document.activeElement)) break;
                await page.keyboard.press('Tab');
            }
            await expect(filter).toBeFocused();
        });

        await test.step('choose the first Department with the arrow key', async () => {
            const [department] = expected.departments;
            await page.keyboard.press('ArrowDown');
            await expect(filter).toHaveValue(department);
            await expect(page.getByTestId('roles-count')).toHaveText(
                countLine(expected.countFor(department), department),
            );
            await expect(page.getByTestId('role-card').filter({ visible: true })).toHaveCount(
                expected.countFor(department),
            );
        });

        await test.step('no wcag2a or wcag2aa violations while filtered', async () => {
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();
            expect(results.violations).toEqual([]);
        });
    });
});
