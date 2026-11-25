/**
 * Pure, side-effect-free helpers for working with job postings.
 *
 * These operate on plain `Job[]` arrays (already loaded from the content
 * collection by the calling page) so they can be unit tested without the Astro
 * content runtime or a database.
 */
import type { Job } from '../types/job';

/** Return jobs sorted by posted date, newest first (does not mutate input). */
export function sortByNewest(jobs: Job[]): Job[] {
    return [...jobs].sort(
        (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
    );
}

/**
 * Return every Department among the jobs exactly once, in alphabetical order
 * (does not mutate input).
 */
export function listDepartments(jobs: Job[]): string[] {
    return [...new Set(jobs.map((job) => job.department))].sort((a, b) =>
        a.localeCompare(b, 'en'),
    );
}

/** A Department and the number of open roles it has. */
export interface DepartmentCount {
    department: string;
    count: number;
}

/**
 * Return every Department among the jobs exactly once, in the same
 * alphabetical order as `listDepartments`, with its number of open roles
 * (does not mutate input).
 */
export function listDepartmentCounts(jobs: Job[]): DepartmentCount[] {
    const counts = new Map<string, number>();
    for (const job of jobs) {
        counts.set(job.department, (counts.get(job.department) ?? 0) + 1);
    }
    return listDepartments(jobs).map((department) => ({
        department,
        count: counts.get(department) ?? 0,
    }));
}

/** Label a filter option with its open role count, e.g. "Finance (2)". */
export function formatFilterOption(label: string, count: number): string {
    return `${label} (${count})`;
}

/**
 * Format an ISO-8601 date as a human-readable posted date,
 * e.g. "January 5, 2027". Falls back to the raw value if unparseable.
 */
export function formatPostedDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}
