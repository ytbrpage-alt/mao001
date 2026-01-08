// src/components/evaluation/Step8Evaluator.tsx
// Step 8: Evaluator identification for tracking and metrics

'use client';

import { useState } from 'react';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { MaskedInput } from '@/components/ui/MaskedInput';
import { User, Building, Phone, Mail, MapPin, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ROLES = [
    { value: 'evaluator', label: 'Avaliador' },
    { value: 'coordinator', label: 'Coordenador' },
    { value: 'nurse', label: 'Enfermeiro' },
    { value: 'social_worker', label: 'Assistente Social' },
    { value: 'manager', label: 'Gerente' },
];

const BRANCH_OFFICES = [
    { value: 'toledo_centro', label: 'Toledo - Centro' },
    { value: 'toledo_jardim_porto_alegre', label: 'Toledo - Jardim Porto Alegre' },
    { value: 'toledo_vila_industrial', label: 'Toledo - Vila Industrial' },
    { value: 'cascavel', label: 'Cascavel' },
    { value: 'maringa', label: 'Maringá' },
    { value: 'foz_do_iguacu', label: 'Foz do Iguaçu' },
    { value: 'medianeira', label: 'Medianeira' },
    { value: 'palotina', label: 'Palotina' },
    { value: 'assis_chateaubriand', label: 'Assis Chateaubriand' },
    { value: 'other', label: 'Outra região' },
];

export function Step8Evaluator() {
    const { getCurrentEvaluation, updateEvaluatorInfo } = useEvaluationStore();
    const evaluation = getCurrentEvaluation();
    const evaluatorInfo = evaluation?.evaluatorInfo || {
        evaluatorId: '',
        evaluatorName: '',
        evaluatorRole: '',
        evaluatorEmail: '',
        evaluatorPhone: '',
        branchOffice: '',
        evaluationStartTime: new Date(),
        evaluationLocation: '',
        evaluationNotes: '',
    };

    const handleChange = (field: string, value: string | Date) => {
        updateEvaluatorInfo({ [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-4">
                    <User className="w-8 h-8 text-brand-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                    Identificação do Avaliador
                </h2>
                <p className="text-sm text-neutral-500 mt-2">
                    Informações para controle, métricas e rastreabilidade
                </p>
            </div>

            {/* Auto-generated ID */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500">ID da Avaliação</p>
                        <p className="font-mono font-medium text-neutral-900">
                            {evaluation?.id?.slice(0, 8) || 'Novo'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Evaluator Name */}
            <MaskedInput
                label="Nome Completo do Avaliador *"
                mask="name"
                value={evaluatorInfo.evaluatorName}
                onChange={(formatted) => handleChange('evaluatorName', formatted)}
                placeholder="Digite seu nome completo"
                errorMessage="Digite nome e sobrenome"
            />

            {/* Role */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Função / Cargo *
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                        <button
                            key={role.value}
                            onClick={() => handleChange('evaluatorRole', role.value)}
                            type="button"
                            className={cn(
                                'px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                                evaluatorInfo.evaluatorRole === role.value
                                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                                    : 'border-neutral-200 hover:border-neutral-300'
                            )}
                        >
                            {role.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                    </label>
                    <input
                        type="email"
                        value={evaluatorInfo.evaluatorEmail}
                        onChange={(e) => handleChange('evaluatorEmail', e.target.value)}
                        placeholder="email@empresa.com"
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <MaskedInput
                    label="Telefone"
                    mask="phone"
                    value={evaluatorInfo.evaluatorPhone}
                    onChange={(formatted) => handleChange('evaluatorPhone', formatted)}
                    placeholder="(00) 00000-0000"
                    errorMessage="Telefone inválido"
                />
            </div>

            {/* Branch Office */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Unidade / Filial
                </label>
                <select
                    value={evaluatorInfo.branchOffice}
                    onChange={(e) => handleChange('branchOffice', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">Selecione a unidade</option>
                    {BRANCH_OFFICES.map((office) => (
                        <option key={office.value} value={office.value}>
                            {office.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Evaluation Location */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Local da Avaliação
                </label>
                <input
                    type="text"
                    value={evaluatorInfo.evaluationLocation}
                    onChange={(e) => handleChange('evaluationLocation', e.target.value)}
                    placeholder="Endereço ou descrição do local"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
            </div>

            {/* Start Time */}
            <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-success-600" />
                    <div>
                        <p className="text-sm font-medium text-success-700">
                            Início da Avaliação
                        </p>
                        <p className="text-sm text-success-600">
                            {new Date(evaluatorInfo.evaluationStartTime).toLocaleString('pt-BR')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Observações (opcional)
                </label>
                <textarea
                    value={evaluatorInfo.evaluationNotes}
                    onChange={(e) => handleChange('evaluationNotes', e.target.value)}
                    placeholder="Notas adicionais sobre a avaliação..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
            </div>

            {/* Info Box */}
            <div className="bg-brand-50 rounded-lg p-4 border border-brand-200">
                <p className="text-sm text-brand-700">
                    <strong>Por que coletamos essas informações?</strong>
                    <br />
                    Para medir taxa de finalização, tempo médio de avaliação e qualidade do atendimento por unidade.
                </p>
            </div>
        </div>
    );
}
