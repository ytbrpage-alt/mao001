// src/lib/validations/__tests__/evaluationSchemas.test.ts
// Unit tests for validation schemas

import { describe, it, expect } from 'vitest';
import {
    cpfSchema,
    requiredCpfSchema,
    phoneSchema,
    emailSchema,
    birthDateSchema,
    nameSchema,
    discoverySchema,
    patientSchema,
} from '../evaluationSchemas';

describe('CPF Validation', () => {
    it('should accept valid CPF', () => {
        const result = cpfSchema.safeParse('529.982.247-25');
        expect(result.success).toBe(true);
    });

    it('should accept CPF without formatting', () => {
        const result = cpfSchema.safeParse('52998224725');
        expect(result.success).toBe(true);
    });

    it('should reject invalid CPF check digit', () => {
        const result = requiredCpfSchema.safeParse('529.982.247-26');
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('CPF inválido');
        }
    });

    it('should reject sequential CPF', () => {
        const result = requiredCpfSchema.safeParse('111.111.111-11');
        expect(result.success).toBe(false);
    });

    it('should reject short CPF', () => {
        const result = requiredCpfSchema.safeParse('123.456.789');
        expect(result.success).toBe(false);
    });

    it('should allow empty optional CPF', () => {
        const result = cpfSchema.safeParse('');
        expect(result.success).toBe(true);
    });
});

describe('Phone Validation', () => {
    it('should accept 11-digit mobile', () => {
        const result = phoneSchema.safeParse('11999998888');
        expect(result.success).toBe(true);
    });

    it('should accept 10-digit landline', () => {
        const result = phoneSchema.safeParse('1133334444');
        expect(result.success).toBe(true);
    });

    it('should accept formatted phone', () => {
        const result = phoneSchema.safeParse('(11) 99999-8888');
        expect(result.success).toBe(true);
    });

    it('should reject invalid length', () => {
        const result = phoneSchema.safeParse('1234567');
        expect(result.success).toBe(false);
    });
});

describe('Email Validation', () => {
    it('should accept valid email', () => {
        const result = emailSchema.safeParse('user@example.com');
        expect(result.success).toBe(true);
    });

    it('should normalize to lowercase', () => {
        const result = emailSchema.safeParse('USER@EXAMPLE.COM');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe('user@example.com');
        }
    });

    it('should reject invalid email', () => {
        const result = emailSchema.safeParse('invalid-email');
        expect(result.success).toBe(false);
    });
});

describe('Birth Date Validation', () => {
    it('should accept past date', () => {
        const result = birthDateSchema.safeParse(new Date('1990-01-01'));
        expect(result.success).toBe(true);
    });

    it('should reject future date', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const result = birthDateSchema.safeParse(futureDate);
        expect(result.success).toBe(false);
    });

    it('should coerce string to date', () => {
        const result = birthDateSchema.safeParse('1990-01-01');
        expect(result.success).toBe(true);
    });
});

describe('Name Validation', () => {
    it('should accept valid name', () => {
        const result = nameSchema.safeParse('João da Silva');
        expect(result.success).toBe(true);
    });

    it('should reject name with numbers', () => {
        const result = nameSchema.safeParse('João123');
        expect(result.success).toBe(false);
    });

    it('should reject too short name', () => {
        const result = nameSchema.safeParse('Jo');
        expect(result.success).toBe(false);
    });

    it('should trim whitespace', () => {
        const result = nameSchema.safeParse('  João Silva  ');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe('João Silva');
        }
    });
});

describe('Discovery Schema', () => {
    it('should validate complete discovery data', () => {
        const result = discoverySchema.safeParse({
            triggerEvent: 'A mãe caiu e quebrou o braço na semana passada',
            triggerCategory: 'fall',
            currentCaregiver: 'family',
            familyBurdenLevel: 8,
            concerns: ['safety', 'medication'],
            previousExperience: 'none',
            previousIssues: [],
        });
        expect(result.success).toBe(true);
    });

    it('should reject short trigger event', () => {
        const result = discoverySchema.safeParse({
            triggerEvent: 'Caiu',
            triggerCategory: 'fall',
            currentCaregiver: 'family',
            familyBurdenLevel: 8,
            previousExperience: 'none',
        });
        expect(result.success).toBe(false);
    });

    it('should reject invalid trigger category', () => {
        const result = discoverySchema.safeParse({
            triggerEvent: 'A mãe caiu e quebrou o braço na semana passada',
            triggerCategory: 'invalid_category',
            currentCaregiver: 'family',
            familyBurdenLevel: 8,
            previousExperience: 'none',
        });
        expect(result.success).toBe(false);
    });
});

describe('Patient Schema', () => {
    it('should validate complete patient data', () => {
        const result = patientSchema.safeParse({
            fullName: 'Maria José da Silva',
            preferredName: 'Dona Maria',
            birthDate: new Date('1945-05-10'),
            cpf: '529.982.247-25',
            maritalStatus: 'widowed',
            temperament: 'calm',
            sleepQuality: 'regular',
        });
        expect(result.success).toBe(true);
    });

    it('should reject invalid birth date', () => {
        const result = patientSchema.safeParse({
            fullName: 'Maria José da Silva',
            birthDate: new Date('2030-01-01'),
            maritalStatus: 'widowed',
            temperament: 'calm',
            sleepQuality: 'regular',
        });
        expect(result.success).toBe(false);
    });
});
