// src/lib/schemas/kyc.schema.ts
// Zod validation schemas for KYC data

import { z } from 'zod';

export const documentTypeSchema = z.enum(['rg', 'cnh', 'passport', 'other'], {
    errorMap: () => ({ message: 'Selecione o tipo de documento' }),
});

export const verificationStatusSchema = z.enum(['pending', 'verified', 'rejected'], {
    errorMap: () => ({ message: 'Status inválido' }),
});

// Base64 image validation (starts with data:image)
const base64ImageSchema = z
    .string()
    .min(1, 'Foto é obrigatória')
    .refine(
        (val) => val.startsWith('data:image/'),
        'Formato de imagem inválido'
    );

export const kycSchema = z.object({
    documentType: documentTypeSchema,
    documentNumber: z
        .string()
        .min(1, 'Número do documento é obrigatório')
        .min(5, 'Número do documento muito curto'),
    documentIssuer: z.string().optional(),
    documentIssueDate: z.date().optional(),
    documentExpiryDate: z.date().optional(),
    documentFrontPhoto: base64ImageSchema.describe('Foto da frente do documento'),
    documentBackPhoto: base64ImageSchema.describe('Foto do verso do documento'),
    selfiePhoto: z.string().optional(),
    verificationStatus: verificationStatusSchema.default('pending'),
    verificationNotes: z.string().optional(),
    consentGiven: z
        .boolean()
        .refine((val) => val === true, 'Você deve aceitar os termos de coleta de dados'),
    consentTimestamp: z.date().optional(),
});

export const kycMinimalSchema = kycSchema.pick({
    documentFrontPhoto: true,
    documentBackPhoto: true,
    consentGiven: true,
});

export type KYCFormData = z.infer<typeof kycSchema>;
export type KYCMinimalFormData = z.infer<typeof kycMinimalSchema>;
