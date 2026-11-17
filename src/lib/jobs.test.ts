import { describe, it, expect } from 'vitest';
import { sortByNewest, formatPostedDate, listDepartments } from './jobs';
import type { Job } from '../types/job';

function makeJob(slug: string, postedDate: string, department = 'Technology'): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department,
        location: 'Remote',
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('listDepartments', () => {
    it('[ac_01a1eb3e-2f2a-7321-a423-a5d73235faf8] lists each Department exactly once', () => {
        const jobs = [
            makeJob('a', '2027-01-01', 'Finance'),
            makeJob('b', '2027-01-02', 'Sales'),
            makeJob('c', '2027-01-03', 'Finance'),
            makeJob('d', '2027-01-04', 'Sales'),
            makeJob('e', '2027-01-05', 'Finance'),
        ];
        expect(listDepartments(jobs)).toEqual(['Finance', 'Sales']);
    });

    it('[ac_01a1eb3e-2f2a-7321-a423-a5d73235faf8] sorts Departments alphabetically', () => {
        const jobs = [
            makeJob('a', '2027-01-01', 'Technology'),
            makeJob('b', '2027-01-02', 'Contact Center & Sales Enablement'),
            makeJob('c', '2027-01-03', 'Research & Development'),
            makeJob('d', '2027-01-04', 'compliance'),
            makeJob('e', '2027-01-05', 'Finance'),
        ];
        expect(listDepartments(jobs)).toEqual([
            'compliance',
            'Contact Center & Sales Enablement',
            'Finance',
            'Research & Development',
            'Technology',
        ]);
    });

    it('[ac_01a1eb3e-2f2a-7321-a423-a5d73235faf8] returns no Departments for no jobs', () => {
        expect(listDepartments([])).toEqual([]);
    });

    it('[ac_01a1eb3e-2f2a-7321-a423-a5d73235faf8] does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01', 'Sales'), makeJob('b', '2027-01-02', 'Finance')];
        const original = jobs.map((j) => j.slug);
        listDepartments(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});
