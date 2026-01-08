/**
 * Test Suite for ABEMID Calculator
 * 
 * Tests: calculateAbemid, PROFESSIONAL_BASE_RATES
 * Coverage: 100% branches
 */

import { calculateAbemid, PROFESSIONAL_BASE_RATES, type AbemidResult } from '../abemidCalculator';
import type { AbemidData } from '@/types';

describe('calculateAbemid', () => {
    // ========================================
    // HAPPY PATH TESTS
    // ========================================

    describe('Happy Path', () => {
        test('returns caregiver for patient with no triggers and low score', () => {
            const data: Partial<AbemidData> = {
                consciousness: 1,
                breathing: 1,
                feeding: 1,
                medication: 1,
                skin: 1,
                elimination: 1,
                activeTriggers: [],
            };

            const result = calculateAbemid(data);

            expect(result.totalScore).toBe(6);
            expect(result.indicatedProfessional).toBe('caregiver');
            expect(result.professionalLabel).toBe('Cuidador(a)');
            expect(result.justification).toContain('sem necessidades técnicas');
        });

        test('returns tech_nurse for patient with tech triggers', () => {
            const data: Partial<AbemidData> = {
                consciousness: 1,
                breathing: 1,
                feeding: 2,
                medication: 2,
                skin: 1,
                elimination: 1,
                activeTriggers: ['oxygen', 'tube_feeding'],
            };

            const result = calculateAbemid(data);

            expect(result.indicatedProfessional).toBe('tech_nurse');
            expect(result.professionalLabel).toBe('Técnico(a) de Enfermagem');
            expect(result.justification).toContain('oxigenoterapia');
        });

        test('returns nurse for patient with nurse-required triggers', () => {
            const data: Partial<AbemidData> = {
                consciousness: 3,
                breathing: 3,
                feeding: 2,
                medication: 2,
                skin: 2,
                elimination: 2,
                activeTriggers: ['ventilation', 'tracheostomy'],
            };

            const result = calculateAbemid(data);

            expect(result.indicatedProfessional).toBe('nurse');
            expect(result.professionalLabel).toBe('Enfermeiro(a)');
            expect(result.justification).toContain('ventilação mecânica');
            expect(result.justification).toContain('traqueostomia');
        });
    });

    // ========================================
    // EDGE CASES
    // ========================================

    describe('Edge Cases', () => {
        test('handles empty data object', () => {
            const result = calculateAbemid({});

            expect(result.totalScore).toBe(0);
            expect(result.indicatedProfessional).toBe('caregiver');
            expect(result.activeTriggers).toEqual([]);
        });

        test('handles undefined activeTriggers', () => {
            const data = {
                consciousness: 2,
                breathing: 2,
            };

            const result = calculateAbemid(data);

            expect(result.activeTriggers).toEqual([]);
            expect(result.indicatedProfessional).toBe('caregiver');
        });

        test('nurse trigger takes priority over tech_nurse trigger', () => {
            const data: Partial<AbemidData> = {
                consciousness: 1,
                activeTriggers: ['oxygen', 'iv_medication'], // Both triggers present
            };

            const result = calculateAbemid(data);

            // Nurse trigger should win
            expect(result.indicatedProfessional).toBe('nurse');
        });

        test('unknown triggers are included in activeTriggers but do not affect professional', () => {
            const data: Partial<AbemidData> = {
                consciousness: 1,
                activeTriggers: ['unknown_trigger', 'another_unknown'],
            };

            const result = calculateAbemid(data);

            expect(result.activeTriggers).toContain('unknown_trigger');
            expect(result.indicatedProfessional).toBe('caregiver');
        });
    });

    // ========================================
    // BOUNDARY VALUES
    // ========================================

    describe('Boundary Values', () => {
        test('score of 9 still indicates caregiver (just below tech_nurse threshold)', () => {
            const data: Partial<AbemidData> = {
                consciousness: 2,
                breathing: 2,
                feeding: 2,
                medication: 1,
                skin: 1,
                elimination: 1,
                activeTriggers: [],
            };

            const result = calculateAbemid(data);

            expect(result.totalScore).toBe(9);
            expect(result.indicatedProfessional).toBe('caregiver');
        });

        test('score of 10 indicates tech_nurse (threshold)', () => {
            const data: Partial<AbemidData> = {
                consciousness: 2,
                breathing: 2,
                feeding: 2,
                medication: 2,
                skin: 1,
                elimination: 1,
                activeTriggers: [],
            };

            const result = calculateAbemid(data);

            expect(result.totalScore).toBe(10);
            expect(result.indicatedProfessional).toBe('tech_nurse');
            expect(result.justification).toContain('alta complexidade clínica');
        });

        test('maximum score of 18 (6 dimensions × 3 points)', () => {
            const data: Partial<AbemidData> = {
                consciousness: 3,
                breathing: 3,
                feeding: 3,
                medication: 3,
                skin: 3,
                elimination: 3,
                activeTriggers: [],
            };

            const result = calculateAbemid(data);

            expect(result.totalScore).toBe(18);
            expect(result.indicatedProfessional).toBe('tech_nurse');
        });

        test('minimum score of 0', () => {
            const data: Partial<AbemidData> = {
                consciousness: 0,
                breathing: 0,
                feeding: 0,
                medication: 0,
                skin: 0,
                elimination: 0,
                activeTriggers: [],
            };

            const result = calculateAbemid(data);

            expect(result.totalScore).toBe(0);
        });
    });

    // ========================================
    // ALL NURSE TRIGGERS
    // ========================================

    describe('Nurse Triggers', () => {
        const nurseTriggers = [
            'ventilation',
            'tracheostomy',
            'iv_medication',
            'picc_catheter',
            'complex_wounds',
            'intermittent_catheter',
            'tube_placement',
        ];

        test.each(nurseTriggers)('trigger "%s" indicates nurse', (trigger) => {
            const result = calculateAbemid({ activeTriggers: [trigger] });
            expect(result.indicatedProfessional).toBe('nurse');
        });
    });

    // ========================================
    // ALL TECH NURSE TRIGGERS
    // ========================================

    describe('Tech Nurse Triggers', () => {
        const techNurseTriggers = [
            'oxygen',
            'tube_feeding',
            'subcutaneous_injection',
        ];

        test.each(techNurseTriggers)('trigger "%s" indicates tech_nurse', (trigger) => {
            const result = calculateAbemid({ activeTriggers: [trigger] });
            expect(result.indicatedProfessional).toBe('tech_nurse');
        });
    });

    // ========================================
    // SNAPSHOT TESTS
    // ========================================

    describe('Snapshots', () => {
        test('matches snapshot for typical caregiver case', () => {
            const result = calculateAbemid({
                consciousness: 1,
                breathing: 1,
                feeding: 1,
                medication: 1,
                skin: 1,
                elimination: 1,
                activeTriggers: [],
            });

            expect(result).toMatchSnapshot();
        });

        test('matches snapshot for complex nurse case', () => {
            const result = calculateAbemid({
                consciousness: 3,
                breathing: 3,
                feeding: 2,
                medication: 2,
                skin: 2,
                elimination: 2,
                activeTriggers: ['ventilation', 'iv_medication', 'complex_wounds'],
            });

            expect(result).toMatchSnapshot();
        });
    });
});

// ========================================
// PROFESSIONAL_BASE_RATES TESTS
// ========================================

describe('PROFESSIONAL_BASE_RATES', () => {
    test('caregiver rate is defined', () => {
        expect(PROFESSIONAL_BASE_RATES.caregiver).toBe(220);
    });

    test('tech_nurse rate is higher than caregiver', () => {
        expect(PROFESSIONAL_BASE_RATES.tech_nurse).toBeGreaterThan(PROFESSIONAL_BASE_RATES.caregiver);
        expect(PROFESSIONAL_BASE_RATES.tech_nurse).toBe(280);
    });

    test('nurse rate is highest', () => {
        expect(PROFESSIONAL_BASE_RATES.nurse).toBeGreaterThan(PROFESSIONAL_BASE_RATES.tech_nurse);
        expect(PROFESSIONAL_BASE_RATES.nurse).toBe(380);
    });

    test('all rates are positive numbers', () => {
        Object.values(PROFESSIONAL_BASE_RATES).forEach((rate) => {
            expect(rate).toBeGreaterThan(0);
            expect(typeof rate).toBe('number');
        });
    });
});
