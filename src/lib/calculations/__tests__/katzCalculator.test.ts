/**
 * Test Suite for KATZ Calculator
 * 
 * Tests: calculateKatz, checkHighPhysicalDemand
 * Coverage: 100% branches
 */

import { calculateKatz, checkHighPhysicalDemand, type KatzResult } from '../katzCalculator';
import type { KatzData } from '@/types';

describe('calculateKatz', () => {
    // ========================================
    // HAPPY PATH TESTS
    // ========================================

    describe('Happy Path', () => {
        test('independent patient (score 6) returns classification A', () => {
            const data: Partial<KatzData> = {
                bathing: 1,
                dressing: 1,
                toileting: 1,
                transferring: 1,
                continence: 1,
                feeding: 1,
            };

            const result = calculateKatz(data);

            expect(result.totalScore).toBe(6);
            expect(result.classification).toBe('A');
            expect(result.classificationLabel).toBe('Independente');
            expect(result.complexityMultiplier).toBe(1.0);
            expect(result.justification).toContain('independente');
        });

        test('totally dependent patient (score 0) returns classification G', () => {
            const data: Partial<KatzData> = {
                bathing: 0,
                dressing: 0,
                toileting: 0,
                transferring: 0,
                continence: 0,
                feeding: 0,
            };

            const result = calculateKatz(data);

            expect(result.totalScore).toBe(0);
            expect(result.classification).toBe('G');
            expect(result.classificationLabel).toBe('Dependência Total');
            expect(result.complexityMultiplier).toBe(1.35);
        });

        test('moderate dependency returns correct classification', () => {
            const data: Partial<KatzData> = {
                bathing: 0,
                dressing: 0,
                toileting: 1,
                transferring: 1,
                continence: 0,
                feeding: 1,
            };

            const result = calculateKatz(data);

            expect(result.totalScore).toBe(3);
            expect(result.classification).toBe('D');
            expect(result.classificationLabel).toBe('Dependência Moderada');
        });
    });

    // ========================================
    // BOUNDARY VALUES
    // ========================================

    describe('Boundary Values', () => {
        const boundaryTests = [
            { score: 6, expectedClass: 'A', label: 'Independente' },
            { score: 5, expectedClass: 'B', label: 'Dependência Leve' },
            { score: 4, expectedClass: 'C', label: 'Dependência Leve-Moderada' },
            { score: 3, expectedClass: 'D', label: 'Dependência Moderada' },
            { score: 2, expectedClass: 'E', label: 'Dependência Moderada-Grave' },
            { score: 1, expectedClass: 'F', label: 'Dependência Grave' },
            { score: 0, expectedClass: 'G', label: 'Dependência Total' },
        ];

        test.each(boundaryTests)(
            'score $score maps to classification $expectedClass ($label)',
            ({ score, expectedClass, label }) => {
                // Create data to achieve exact score
                const data: Partial<KatzData> = {
                    bathing: score >= 1 ? 1 : 0,
                    dressing: score >= 2 ? 1 : 0,
                    toileting: score >= 3 ? 1 : 0,
                    transferring: score >= 4 ? 1 : 0,
                    continence: score >= 5 ? 1 : 0,
                    feeding: score >= 6 ? 1 : 0,
                };

                const result = calculateKatz(data);

                expect(result.totalScore).toBe(score);
                expect(result.classification).toBe(expectedClass);
                expect(result.classificationLabel).toBe(label);
            }
        );
    });

    // ========================================
    // COMPLEXITY MULTIPLIERS
    // ========================================

    describe('Complexity Multipliers', () => {
        test('multipliers increase as dependency increases', () => {
            const scores = [6, 5, 4, 3, 2, 1, 0];
            const results = scores.map(score => {
                const data = {
                    bathing: score >= 1 ? 1 : 0,
                    dressing: score >= 2 ? 1 : 0,
                    toileting: score >= 3 ? 1 : 0,
                    transferring: score >= 4 ? 1 : 0,
                    continence: score >= 5 ? 1 : 0,
                    feeding: score >= 6 ? 1 : 0,
                };
                return calculateKatz(data).complexityMultiplier;
            });

            // Each subsequent multiplier should be >= previous
            for (let i = 1; i < results.length; i++) {
                expect(results[i]).toBeGreaterThanOrEqual(results[i - 1]);
            }
        });

        test('total dependency multiplier is 1.35', () => {
            const result = calculateKatz({
                bathing: 0,
                dressing: 0,
                toileting: 0,
                transferring: 0,
                continence: 0,
                feeding: 0,
            });

            expect(result.complexityMultiplier).toBe(1.35);
        });
    });

    // ========================================
    // EDGE CASES
    // ========================================

    describe('Edge Cases', () => {
        test('handles empty data object with defaults', () => {
            const result = calculateKatz({});

            // All default to 1 (independent)
            expect(result.totalScore).toBe(6);
            expect(result.classification).toBe('A');
        });

        test('handles partial data with defaults', () => {
            const result = calculateKatz({
                bathing: 0,
                // Others default to 1
            });

            expect(result.totalScore).toBe(5);
            expect(result.classification).toBe('B');
        });

        test('handles undefined values', () => {
            const data = {
                bathing: undefined,
                dressing: undefined,
                toileting: 0,
            } as unknown as Partial<KatzData>;

            const result = calculateKatz(data);

            // undefined values default to 1
            expect(result.totalScore).toBe(4); // 1 + 1 + 0 + 1 + 1 + 1
        });
    });

    // ========================================
    // JUSTIFICATION TESTS
    // ========================================

    describe('Justification', () => {
        test('lists single dependent area correctly', () => {
            const result = calculateKatz({
                bathing: 0,
                dressing: 1,
                toileting: 1,
                transferring: 1,
                continence: 1,
                feeding: 1,
            });

            expect(result.justification).toContain('banho');
            expect(result.justification).not.toContain(' e ');
        });

        test('lists multiple dependent areas with "e" connector', () => {
            const result = calculateKatz({
                bathing: 0,
                dressing: 0,
                toileting: 1,
                transferring: 1,
                continence: 1,
                feeding: 1,
            });

            expect(result.justification).toContain('banho');
            expect(result.justification).toContain('vestuário');
            expect(result.justification).toContain(' e ');
        });

        test('lists all six areas when fully dependent', () => {
            const result = calculateKatz({
                bathing: 0,
                dressing: 0,
                toileting: 0,
                transferring: 0,
                continence: 0,
                feeding: 0,
            });

            expect(result.justification).toContain('banho');
            expect(result.justification).toContain('vestuário');
            expect(result.justification).toContain('higiene');
            expect(result.justification).toContain('transferência');
            expect(result.justification).toContain('continência');
            expect(result.justification).toContain('alimentação');
        });
    });

    // ========================================
    // SNAPSHOT TESTS
    // ========================================

    describe('Snapshots', () => {
        test('matches snapshot for independent patient', () => {
            const result = calculateKatz({
                bathing: 1,
                dressing: 1,
                toileting: 1,
                transferring: 1,
                continence: 1,
                feeding: 1,
            });

            expect(result).toMatchSnapshot();
        });

        test('matches snapshot for fully dependent patient', () => {
            const result = calculateKatz({
                bathing: 0,
                dressing: 0,
                toileting: 0,
                transferring: 0,
                continence: 0,
                feeding: 0,
            });

            expect(result).toMatchSnapshot();
        });
    });
});

// ========================================
// checkHighPhysicalDemand TESTS
// ========================================

describe('checkHighPhysicalDemand', () => {
    describe('Happy Path', () => {
        test('returns true for bedridden heavy patient', () => {
            expect(checkHighPhysicalDemand(0, 100)).toBe(true);
        });

        test('returns false for mobile patient', () => {
            expect(checkHighPhysicalDemand(1, 100)).toBe(false);
        });

        test('returns false for bedridden light patient', () => {
            expect(checkHighPhysicalDemand(0, 70)).toBe(false);
        });
    });

    describe('Boundary Values', () => {
        test('weight of 90 exactly is not high demand', () => {
            expect(checkHighPhysicalDemand(0, 90)).toBe(false);
        });

        test('weight of 91 is high demand when bedridden', () => {
            expect(checkHighPhysicalDemand(0, 91)).toBe(true);
        });

        test('transferring of 0.5 (partial) is not bedridden', () => {
            expect(checkHighPhysicalDemand(0.5, 100)).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('handles undefined weight', () => {
            expect(checkHighPhysicalDemand(0, undefined)).toBe(false);
        });

        test('handles missing weight parameter', () => {
            expect(checkHighPhysicalDemand(0)).toBe(false);
        });
    });
});
