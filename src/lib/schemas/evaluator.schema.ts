// src/lib/schemas/evaluator.schema.ts
// Zod validation schemas for evaluator data

import { z } from 'zod';
import { nameSchema, phoneSchema } from './patient.schema';

export const emailSchema = z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido');

export const evaluatorRoleSchema = z.enum([
    'evaluator',
    'coordinator',
    'nurse',
    'social_worker',
    'manager',
], {
    errorMap: () => ({ message: 'Selecione uma função' }),
});

export const branchOfficeSchema = z.enum([
    'toledo_centro',
    'toledo_jardim_porto_alegre',
    'toledo_vila_industrial',
    'cascavel',
    'maringa',
    'foz_do_iguacu',
    'medianeira',
    'palotina',
    'assis_chateaubriand',
    'other',
], {
    errorMap: () => ({ message: 'Selecione uma unidade' }),
});

export const evaluatorSchema = z.object({
    evaluatorId: z.string().optional(),
    evaluatorName: nameSchema,
    evaluatorRole: evaluatorRoleSchema,
    evaluatorEmail: emailSchema,
    evaluatorPhone: phoneSchema,
    branchOffice: branchOfficeSchema,
    evaluationStartTime: z.date(),
    evaluationEndTime: z.date().optional(),
    evaluationLocation: z.string().min(1, 'Local da avaliação é obrigatório'),
    evaluationNotes: z.string().optional(),
});

export type EvaluatorFormData = z.infer<typeof evaluatorSchema>;
