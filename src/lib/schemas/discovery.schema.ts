// src/lib/schemas/discovery.schema.ts
// Zod validation schemas for discovery data

import { z } from 'zod';

export const triggerCategorySchema = z.enum([
    'recent_fall',
    'hospital_discharge',
    'loss_of_autonomy',
    'caregiver_burnout',
    'dementia_diagnosis',
    'post_surgery',
    'preventive',
    'other',
], {
    errorMap: () => ({ message: 'Selecione uma categoria válida' }),
});

export const urgencyLevelSchema = z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: 'Selecione o nível de urgência' }),
});

export const discoverySchema = z.object({
    triggerEvent: z
        .string()
        .min(1, 'Descreva o que motivou a busca por ajuda')
        .min(10, 'Descreva com mais detalhes'),
    triggerCategory: triggerCategorySchema,
    urgencyLevel: urgencyLevelSchema.optional(),
    referralSource: z.string().optional(),
    initialExpectations: z.string().optional(),
    familyDecisionMaker: z.string().optional(),
    budgetRange: z.string().optional(),
});

export type DiscoveryFormData = z.infer<typeof discoverySchema>;
