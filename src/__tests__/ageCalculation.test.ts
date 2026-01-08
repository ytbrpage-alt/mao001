// src/__tests__/ageCalculation.test.ts
// Unit tests for age calculation functionality

import { describe, it, expect, beforeEach } from 'vitest';

// Standalone age calculation function for testing
function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

describe('Age Calculation', () => {
    it('should calculate age correctly for date in past', () => {
        const birthDate = new Date('1980-01-01');
        const age = calculateAge(birthDate);
        const expectedAge = new Date().getFullYear() - 1980;
        expect(age).toBeGreaterThanOrEqual(expectedAge - 1);
        expect(age).toBeLessThanOrEqual(expectedAge);
    });

    it('should return 0 for current year birth', () => {
        const thisYear = new Date().getFullYear();
        const birthDate = new Date(`${thisYear}-01-01`);
        const age = calculateAge(birthDate);
        expect(age).toBeLessThanOrEqual(1);
        expect(age).toBeGreaterThanOrEqual(0);
    });

    it('should handle leap year birthdays', () => {
        const birthDate = new Date('2000-02-29');
        const age = calculateAge(birthDate);
        expect(age).toBeGreaterThan(20);
    });

    it('should subtract 1 if birthday has not occurred this year', () => {
        // Create a birth date that is definitely in the future this year
        const today = new Date();
        const nextMonth = new Date(today.getFullYear() - 30, today.getMonth() + 1, 15);
        const age = calculateAge(nextMonth);
        // If next month hasn't happened, age should be 29
        if (today.getMonth() < nextMonth.getMonth()) {
            expect(age).toBe(29);
        } else {
            expect(age).toBe(30);
        }
    });

    it('should return negative for future dates', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 5);
        const age = calculateAge(futureDate);
        expect(age).toBeLessThan(0);
    });
});

describe('Edge Cases', () => {
    it('should handle very old dates (120 years)', () => {
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 120);
        const age = calculateAge(birthDate);
        expect(age).toBe(120);
    });

    it('should handle newborn (same day)', () => {
        const birthDate = new Date();
        const age = calculateAge(birthDate);
        expect(age).toBe(0);
    });

    it('should handle yesterday birthday', () => {
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 50);
        birthDate.setDate(birthDate.getDate() - 1);
        const age = calculateAge(birthDate);
        expect(age).toBe(50);
    });

    it('should handle tomorrow birthday', () => {
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 50);
        birthDate.setDate(birthDate.getDate() + 1);
        const age = calculateAge(birthDate);
        expect(age).toBe(49);
    });
});
