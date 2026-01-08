/**
 * Test Suite for Pricing Calculator
 * 
 * Tests: calculatePricing, generateFrequencyOptions, formatCurrency
 * Coverage: 100% branches
 */

import {
    calculatePricing,
    generateFrequencyOptions,
    formatCurrency,
    type PricingInput,
    type PricingResult,
} from '../pricingCalculator';
import { PROFESSIONAL_BASE_RATES } from '../abemidCalculator';

// Mock PROFESSIONAL_BASE_RATES if needed for isolation
jest.mock('../abemidCalculator', () => ({
    PROFESSIONAL_BASE_RATES: {
        caregiver: 220,
        tech_nurse: 280,
        nurse: 380,
    },
}));

describe('calculatePricing', () => {
    // ========================================
    // HAPPY PATH TESTS
    // ========================================

    describe('Happy Path', () => {
        test('calculates basic caregiver pricing for 5 days/week', () => {
            const input: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
                    totalHoursPerDay: 12,
                },
            };

            const result = calculatePricing(input);

            expect(result.shiftCost).toBe(220); // Base rate, no multipliers
            expect(result.shiftsPerMonth).toBe(22); // (5 * 52) / 12 ≈ 22
            expect(result.professionalLabel).toBe('Cuidador(a)');
        });

        test('calculates tech_nurse pricing with complexity multiplier', () => {
            const input: PricingInput = {
                professionalType: 'tech_nurse',
                complexityMultiplier: 1.2,
                schedule: {
                    weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
                    totalHoursPerDay: 12,
                },
            };

            const result = calculatePricing(input);

            // 280 * 1.2 = 336
            expect(result.shiftCost).toBe(336);
            expect(result.professionalLabel).toBe('Técnico(a) de Enfermagem');
        });

        test('calculates nurse pricing for 7 days/week', () => {
            const input: PricingInput = {
                professionalType: 'nurse',
                complexityMultiplier: 1.0,
                schedule: {
                    weekDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                    totalHoursPerDay: 12,
                },
            };

            const result = calculatePricing(input);

            expect(result.shiftCost).toBe(380);
            expect(result.shiftsPerMonth).toBe(30); // (7 * 52) / 12 ≈ 30
            expect(result.professionalLabel).toBe('Enfermeiro(a)');
        });
    });

    // ========================================
    // SHIFT TYPE TESTS
    // ========================================

    describe('Shift Types', () => {
        test('night shift adds 20% bonus for night hours', () => {
            const inputDay: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    shiftType: 'day',
                    totalHoursPerDay: 12,
                    weekDays: ['mon'],
                },
            };

            const inputNight: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    shiftType: 'night',
                    totalHoursPerDay: 12,
                    weekDays: ['mon'],
                },
            };

            const resultDay = calculatePricing(inputDay);
            const resultNight = calculatePricing(inputNight);

            expect(resultNight.shiftCost).toBeGreaterThan(resultDay.shiftCost);
            expect(resultNight.nightShiftMultiplier).toBeGreaterThan(1);
        });

        test('24h shift has night bonus', () => {
            const input: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    shiftType: '24h',
                    totalHoursPerDay: 24,
                    weekDays: ['mon'],
                },
            };

            const result = calculatePricing(input);

            expect(result.nightShiftMultiplier).toBeGreaterThan(1);
        });
    });

    // ========================================
    // HOUR VARIATIONS
    // ========================================

    describe('Hour Variations', () => {
        test('8-hour shift costs less than 12-hour', () => {
            const input8h: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    totalHoursPerDay: 8,
                    weekDays: ['mon'],
                },
            };

            const input12h: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    totalHoursPerDay: 12,
                    weekDays: ['mon'],
                },
            };

            const result8h = calculatePricing(input8h);
            const result12h = calculatePricing(input12h);

            expect(result8h.shiftCost).toBeLessThan(result12h.shiftCost);
            // 220 / 12 * 8 = 146.67 → 147 (ceil)
            expect(result8h.shiftCost).toBe(147);
        });

        test('defaults to 12 hours if not specified', () => {
            const input: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {},
            };

            const result = calculatePricing(input);

            expect(result.shiftCost).toBe(220); // Base 12h rate
        });
    });

    // ========================================
    // SUPPLIES TESTS
    // ========================================

    describe('Supplies', () => {
        test('adds supplies cost when included', () => {
            const inputWithSupplies: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
                },
                includeSupplies: true,
                suppliesCost: 500,
            };

            const inputWithoutSupplies: PricingInput = {
                ...inputWithSupplies,
                includeSupplies: false,
            };

            const withSupplies = calculatePricing(inputWithSupplies);
            const withoutSupplies = calculatePricing(inputWithoutSupplies);

            expect(withSupplies.totalMonthly).toBe(withoutSupplies.totalMonthly + 500);
        });

        test('supplies cost is 0 when not included', () => {
            const input: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {},
                includeSupplies: false,
                suppliesCost: 500,
            };

            const result = calculatePricing(input);

            // Supplies cost should not be added
            expect(result.totalMonthly).toBe(result.monthlyCost);
        });
    });

    // ========================================
    // EDGE CASES
    // ========================================

    describe('Edge Cases', () => {
        test('handles empty weekDays array', () => {
            const input: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    weekDays: [],
                },
            };

            const result = calculatePricing(input);

            expect(result.shiftsPerMonth).toBe(0);
            expect(result.monthlyCost).toBe(0);
        });

        test('handles missing weekDays (defaults to 5 days)', () => {
            const input: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {},
            };

            const result = calculatePricing(input);

            expect(result.shiftsPerMonth).toBe(22); // (5 * 52) / 12
        });

        test('rounds shift cost up', () => {
            const input: PricingInput = {
                professionalType: 'caregiver',
                complexityMultiplier: 1.01, // Slight increase
                schedule: {
                    totalHoursPerDay: 12,
                },
            };

            const result = calculatePricing(input);

            // 220 * 1.01 = 222.2 → 223 (ceil)
            expect(result.shiftCost).toBe(223);
        });
    });

    // ========================================
    // SNAPSHOT TESTS
    // ========================================

    describe('Snapshots', () => {
        test('matches snapshot for standard caregiver configuration', () => {
            const result = calculatePricing({
                professionalType: 'caregiver',
                complexityMultiplier: 1.0,
                schedule: {
                    weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
                    totalHoursPerDay: 12,
                },
            });

            expect(result).toMatchSnapshot();
        });

        test('matches snapshot for complex nurse configuration', () => {
            const result = calculatePricing({
                professionalType: 'nurse',
                complexityMultiplier: 1.35,
                schedule: {
                    weekDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                    totalHoursPerDay: 12,
                    shiftType: 'night',
                },
                includeSupplies: true,
                suppliesCost: 800,
            });

            expect(result).toMatchSnapshot();
        });
    });
});

// ========================================
// generateFrequencyOptions TESTS
// ========================================

describe('generateFrequencyOptions', () => {
    test('returns 4 frequency options', () => {
        const options = generateFrequencyOptions(200);

        expect(options).toHaveLength(4);
    });

    test('calculates correct monthly costs', () => {
        const baseShiftCost = 200;
        const options = generateFrequencyOptions(baseShiftCost);

        expect(options[0].monthlyCost).toBe(200 * 12); // 3 days
        expect(options[1].monthlyCost).toBe(200 * 20); // 5 days
        expect(options[2].monthlyCost).toBe(200 * 24); // 6 days
        expect(options[3].monthlyCost).toBe(200 * 28); // 7 days
    });

    test('returns correct labels', () => {
        const options = generateFrequencyOptions(100);

        expect(options[0].label).toBe('3 dias (alternados)');
        expect(options[1].label).toBe('5 dias (Seg-Sex)');
        expect(options[2].label).toBe('6 dias (Seg-Sáb)');
        expect(options[3].label).toBe('7 dias (todos)');
    });

    test('returns correct shift counts', () => {
        const options = generateFrequencyOptions(100);

        expect(options[0].shiftsPerMonth).toBe(12);
        expect(options[1].shiftsPerMonth).toBe(20);
        expect(options[2].shiftsPerMonth).toBe(24);
        expect(options[3].shiftsPerMonth).toBe(28);
    });

    test('handles zero base cost', () => {
        const options = generateFrequencyOptions(0);

        expect(options[0].monthlyCost).toBe(0);
        expect(options[3].monthlyCost).toBe(0);
    });
});

// ========================================
// formatCurrency TESTS
// ========================================

describe('formatCurrency', () => {
    test('formats positive numbers correctly', () => {
        expect(formatCurrency(1000)).toBe('R$ 1.000,00');
        expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    test('formats zero', () => {
        expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    test('formats negative numbers', () => {
        expect(formatCurrency(-500)).toBe('-R$ 500,00');
    });

    test('handles decimal precision', () => {
        expect(formatCurrency(99.999)).toBe('R$ 100,00'); // Rounds
        expect(formatCurrency(99.994)).toBe('R$ 99,99');
    });

    test('handles large numbers', () => {
        expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00');
    });
});

// ========================================
// INTEGRATION TESTS
// ========================================

describe('Integration Tests', () => {
    test('full pricing flow with frequency options', () => {
        const pricingResult = calculatePricing({
            professionalType: 'caregiver',
            complexityMultiplier: 1.0,
            schedule: {
                weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
                totalHoursPerDay: 12,
            },
        });

        const frequencyOptions = generateFrequencyOptions(pricingResult.shiftCost);
        const formattedTotal = formatCurrency(pricingResult.totalMonthly);

        expect(pricingResult.shiftCost).toBe(220);
        expect(frequencyOptions[1].monthlyCost).toBe(220 * 20);
        expect(formattedTotal).toContain('R$');
    });
});
