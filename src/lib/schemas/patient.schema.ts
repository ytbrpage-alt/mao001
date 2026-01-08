// src/lib/schemas/patient.schema.ts
// Zod validation schemas for patient data

import { z } from 'zod';

// Custom CPF validation
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const validateCPF = (cpf: string): boolean => {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(digits[10])) return false;

    return true;
};

// Phone validation
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

// CEP validation
const cepRegex = /^\d{5}-\d{3}$/;

export const cpfSchema = z
    .string()
    .min(1, 'CPF é obrigatório')
    .regex(cpfRegex, 'CPF deve estar no formato 000.000.000-00')
    .refine(validateCPF, 'CPF inválido');

export const phoneSchema = z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(phoneRegex, 'Telefone deve estar no formato (00) 00000-0000');

export const cepSchema = z
    .string()
    .min(1, 'CEP é obrigatório')
    .regex(cepRegex, 'CEP deve estar no formato 00000-000');

export const nameSchema = z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(5, 'Nome deve ter no mínimo 5 caracteres')
    .refine(
        (name) => name.trim().split(/\s+/).length >= 2,
        'Digite nome e sobrenome'
    )
    .refine(
        (name) => /^[a-zA-ZÀ-ÿ\s]+$/.test(name),
        'Nome deve conter apenas letras'
    );

export const patientSchema = z.object({
    fullName: nameSchema,
    preferredName: z.string().optional(),
    birthDate: z.date({
        required_error: 'Data de nascimento é obrigatória',
        invalid_type_error: 'Data de nascimento inválida',
    }).refine(
        (date) => {
            const age = Math.floor((Date.now() - date.getTime()) / 31557600000);
            return age >= 0 && age <= 120;
        },
        'Data de nascimento inválida'
    ),
    age: z.number().min(0, 'Idade inválida').max(120, 'Idade inválida'),
    cpf: cpfSchema,
    phone: phoneSchema.optional(),
    cep: cepSchema.optional(),
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    addressComplement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().max(2, 'UF deve ter 2 caracteres').optional(),
    maritalStatus: z.enum(['married', 'widowed', 'divorced', 'single'], {
        errorMap: () => ({ message: 'Selecione o estado civil' }),
    }),
    previousOccupation: z.string().optional(),
    hobbies: z.array(z.string()),
    otherHobbies: z.string().optional(),
    temperament: z.string().optional(),
    preferences: z.array(z.string()),
    otherPreferences: z.string().optional(),
    wakeUpTime: z.string().optional(),
    breakfastTime: z.string().optional(),
    lunchTime: z.string().optional(),
    takesNap: z.boolean(),
    dinnerTime: z.string().optional(),
    bedTime: z.string().optional(),
    sleepQuality: z.string().optional(),
    nightWakeups: z.number().min(0).optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
