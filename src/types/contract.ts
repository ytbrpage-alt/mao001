// src/types/contract.ts
// Types for contract data

export type ClauseType =
    | 'medication_administration'
    | 'injection_application'
    | 'supply_provision'
    | 'work_scope'
    | 'risk_assumption'
    | 'non_personality'
    | 'confidentiality'
    | 'termination'
    | 'payment_terms'
    | 'custom';

export interface ContractClause {
    id: string;
    type: ClauseType;
    title: string;
    content: string;
    isRequired: boolean;
    isIncluded: boolean;
    order: number;
}

export interface ContractData {
    contractNumber: string;
    generatedAt: Date;
    signedAt: Date | null;
    clientName: string;
    clientCPF: string;
    clientAddress: string;
    patientName: string;
    patientCPF: string;
    serviceDescription: string;
    schedule: string;
    monthlyValue: number;
    paymentMethod: 'pix' | 'boleto' | 'transfer' | 'credit_card';
    paymentDueDay: number;
    clauses: ContractClause[];
    signatures: {
        client: string;      // Base64 da assinatura
        witness1: string;
        witness2: string;
    };
    status: 'draft' | 'pending_signature' | 'signed' | 'cancelled';
}

export const CLAUSE_TYPES: { value: ClauseType; label: string; defaultContent: string }[] = [
    {
        value: 'medication_administration',
        label: 'Administração de Medicamentos',
        defaultContent: 'O profissional realizará a administração de medicamentos conforme prescrição médica.',
    },
    {
        value: 'injection_application',
        label: 'Aplicação de Injeções',
        defaultContent: 'O profissional está autorizado a aplicar injeções subcutâneas conforme orientação médica.',
    },
    {
        value: 'supply_provision',
        label: 'Fornecimento de Insumos',
        defaultContent: 'O fornecimento de insumos (fraldas, luvas, etc.) será de responsabilidade da família.',
    },
    {
        value: 'work_scope',
        label: 'Escopo de Trabalho',
        defaultContent: 'O profissional atuará exclusivamente nos cuidados ao paciente, não realizando atividades domésticas gerais.',
    },
    {
        value: 'risk_assumption',
        label: 'Assunção de Risco Ambiental',
        defaultContent: 'O contratante assume responsabilidade pelos riscos ambientais identificados na avaliação.',
    },
    {
        value: 'non_personality',
        label: 'Não-Pessoalidade',
        defaultContent: 'A empresa poderá substituir o profissional, mantendo o mesmo padrão de atendimento.',
    },
];

export const CONTRACT_STATUS_LABELS: Record<ContractData['status'], string> = {
    draft: 'Rascunho',
    pending_signature: 'Aguardando Assinatura',
    signed: 'Assinado',
    cancelled: 'Cancelado',
};
