'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, MapPin, Heart, ClipboardList,
    ChevronRight, ChevronLeft, Check, Home, Calendar,
    AlertCircle, Stethoscope, FileText
} from 'lucide-react';
import { useEvaluationStore } from '@/stores/evaluationStore';
import { cn } from '@/lib/utils/cn';

const STEPS = [
    { id: 1, title: 'Dados do Paciente', icon: User },
    { id: 2, title: 'Contato', icon: Phone },
    { id: 3, title: 'Endereço', icon: MapPin },
    { id: 4, title: 'Condição Clínica', icon: Heart },
    { id: 5, title: 'Resumo', icon: ClipboardList },
];

interface FormData {
    // Paciente
    patientName: string;
    patientBirthDate: string;
    patientGender: 'masculino' | 'feminino' | '';
    patientCpf: string;
    // Contato
    responsibleName: string;
    responsiblePhone: string;
    responsibleEmail: string;
    relationship: string;
    // Endereço
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    // Clínico
    mainDiagnosis: string;
    comorbidities: string[];
    allergies: string;
    medications: string;
    mobilityLevel: 'independente' | 'parcial' | 'dependente' | '';
    cognitiveStatus: 'normal' | 'leve' | 'moderado' | 'grave' | '';
}

const initialFormData: FormData = {
    patientName: '',
    patientBirthDate: '',
    patientGender: '',
    patientCpf: '',
    responsibleName: '',
    responsiblePhone: '',
    responsibleEmail: '',
    relationship: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'Toledo',
    state: 'PR',
    zipCode: '',
    mainDiagnosis: '',
    comorbidities: [],
    allergies: '',
    medications: '',
    mobilityLevel: '',
    cognitiveStatus: '',
};

const COMORBIDITIES_OPTIONS = [
    'Diabetes', 'Hipertensão', 'Cardiopatia', 'DPOC',
    'AVC', 'Parkinson', 'Alzheimer', 'Demência',
    'Insuficiência Renal', 'Câncer', 'Depressão', 'Ansiedade'
];

export default function NovaAvaliacaoPage() {
    const router = useRouter();
    const { createEvaluation } = useEvaluationStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field: keyof FormData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleComorbidity = (comorbidity: string) => {
        setFormData(prev => ({
            ...prev,
            comorbidities: prev.comorbidities.includes(comorbidity)
                ? prev.comorbidities.filter(c => c !== comorbidity)
                : [...prev.comorbidities, comorbidity]
        }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.patientName.trim().length > 0;
            case 2:
                return formData.responsibleName.trim().length > 0 && formData.responsiblePhone.trim().length > 0;
            case 3:
                return formData.street.trim().length > 0 && formData.city.trim().length > 0;
            case 4:
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const id = createEvaluation('evaluator-1');
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push(`/avaliacao/${id}`);
        } catch (error) {
            console.error('Error creating evaluation:', error);
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Nome Completo do Paciente *
                            </label>
                            <input
                                type="text"
                                value={formData.patientName}
                                onChange={(e) => updateField('patientName', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                placeholder="Ex: Maria da Silva"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Data de Nascimento
                                </label>
                                <input
                                    type="date"
                                    value={formData.patientBirthDate}
                                    onChange={(e) => updateField('patientBirthDate', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Gênero
                                </label>
                                <select
                                    value={formData.patientGender}
                                    onChange={(e) => updateField('patientGender', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                CPF
                            </label>
                            <input
                                type="text"
                                value={formData.patientCpf}
                                onChange={(e) => updateField('patientCpf', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="000.000.000-00"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Nome do Responsável *
                            </label>
                            <input
                                type="text"
                                value={formData.responsibleName}
                                onChange={(e) => updateField('responsibleName', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="Ex: João da Silva"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Telefone/WhatsApp *
                            </label>
                            <input
                                type="tel"
                                value={formData.responsiblePhone}
                                onChange={(e) => updateField('responsiblePhone', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="(45) 99999-9999"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={formData.responsibleEmail}
                                onChange={(e) => updateField('responsibleEmail', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Parentesco
                            </label>
                            <select
                                value={formData.relationship}
                                onChange={(e) => updateField('relationship', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">Selecione</option>
                                <option value="filho">Filho(a)</option>
                                <option value="conjuge">Cônjuge</option>
                                <option value="neto">Neto(a)</option>
                                <option value="irmao">Irmão(ã)</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Rua *
                                </label>
                                <input
                                    type="text"
                                    value={formData.street}
                                    onChange={(e) => updateField('street', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    value={formData.number}
                                    onChange={(e) => updateField('number', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Complemento
                            </label>
                            <input
                                type="text"
                                value={formData.complement}
                                onChange={(e) => updateField('complement', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="Apto, Bloco, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Bairro
                            </label>
                            <input
                                type="text"
                                value={formData.neighborhood}
                                onChange={(e) => updateField('neighborhood', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Cidade *
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => updateField('city', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    CEP
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => updateField('zipCode', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                    placeholder="85900-000"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Diagnóstico Principal
                            </label>
                            <input
                                type="text"
                                value={formData.mainDiagnosis}
                                onChange={(e) => updateField('mainDiagnosis', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="Ex: AVC, Alzheimer, Fratura de Fêmur"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-3">
                                Comorbidades
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {COMORBIDITIES_OPTIONS.map(comorbidity => (
                                    <button
                                        key={comorbidity}
                                        type="button"
                                        onClick={() => toggleComorbidity(comorbidity)}
                                        className={cn(
                                            'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                            formData.comorbidities.includes(comorbidity)
                                                ? 'bg-brand-500 text-white'
                                                : 'bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-surface))]'
                                        )}
                                    >
                                        {comorbidity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Mobilidade
                                </label>
                                <select
                                    value={formData.mobilityLevel}
                                    onChange={(e) => updateField('mobilityLevel', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="independente">Independente</option>
                                    <option value="parcial">Parcialmente Dependente</option>
                                    <option value="dependente">Totalmente Dependente</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                    Cognição
                                </label>
                                <select
                                    value={formData.cognitiveStatus}
                                    onChange={(e) => updateField('cognitiveStatus', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="normal">Normal</option>
                                    <option value="leve">Comprometimento Leve</option>
                                    <option value="moderado">Comprometimento Moderado</option>
                                    <option value="grave">Comprometimento Grave</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Alergias
                            </label>
                            <input
                                type="text"
                                value={formData.allergies}
                                onChange={(e) => updateField('allergies', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-elevated))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="Nenhuma conhecida"
                            />
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <div className="bg-[rgb(var(--color-bg-muted))] rounded-2xl p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-brand-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[rgb(var(--color-text-primary))]">
                                        {formData.patientName || 'Paciente não informado'}
                                    </p>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                        {formData.patientBirthDate ? `Nascimento: ${formData.patientBirthDate}` : 'Data não informada'}
                                    </p>
                                </div>
                            </div>

                            <hr className="border-[rgb(var(--color-border))]" />

                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                                <div>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">Responsável</p>
                                    <p className="font-medium text-[rgb(var(--color-text-primary))]">
                                        {formData.responsibleName || 'Não informado'} - {formData.responsiblePhone || 'Sem telefone'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Home className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                                <div>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">Endereço</p>
                                    <p className="font-medium text-[rgb(var(--color-text-primary))]">
                                        {formData.street ? `${formData.street}, ${formData.number}` : 'Não informado'}
                                        {formData.city && ` - ${formData.city}/${formData.state}`}
                                    </p>
                                </div>
                            </div>

                            {formData.mainDiagnosis && (
                                <div className="flex items-center gap-3">
                                    <Stethoscope className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                                    <div>
                                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">Diagnóstico</p>
                                        <p className="font-medium text-[rgb(var(--color-text-primary))]">
                                            {formData.mainDiagnosis}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {formData.comorbidities.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.comorbidities.map(c => (
                                        <span key={c} className="px-2 py-1 bg-warning-500/20 text-warning-500 text-xs rounded-full">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-brand-500/10 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                Ao confirmar, uma nova avaliação será criada e você será redirecionado para o formulário completo de avaliação presencial.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[rgb(var(--color-bg))]">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[rgb(var(--color-bg-elevated))] border-b border-[rgb(var(--color-border))] px-4 py-4">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-semibold text-[rgb(var(--color-text-primary))]">Nova Avaliação</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            {/* Progress Steps */}
            <div className="px-4 py-6 bg-[rgb(var(--color-bg-elevated))]">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                                        currentStep > step.id
                                            ? 'bg-success-500 text-white'
                                            : currentStep === step.id
                                                ? 'bg-brand-500 text-white'
                                                : 'bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-tertiary))]'
                                    )}
                                >
                                    {currentStep > step.id ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            'w-8 sm:w-12 h-1 mx-1 rounded-full transition-all',
                                            currentStep > step.id
                                                ? 'bg-success-500'
                                                : 'bg-[rgb(var(--color-bg-muted))]'
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-[rgb(var(--color-text-secondary))]">
                        Etapa {currentStep} de {STEPS.length}: <span className="font-medium text-[rgb(var(--color-text-primary))]">{STEPS[currentStep - 1].title}</span>
                    </p>
                </div>
            </div>

            {/* Form Content */}
            <main className="px-4 py-6">
                <div className="max-w-lg mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 bg-[rgb(var(--color-bg-elevated))] border-t border-[rgb(var(--color-border))] p-4 pb-safe-bottom">
                <div className="max-w-lg mx-auto flex gap-3">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 py-3 px-4 rounded-xl border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] font-medium hover:bg-[rgb(var(--color-bg-muted))] transition-colors"
                        >
                            Voltar
                        </button>
                    )}
                    <button
                        onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
                        disabled={!canProceed() || isSubmitting}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                            canProceed() && !isSubmitting
                                ? 'bg-brand-500 text-white hover:bg-brand-600'
                                : 'bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-tertiary))] cursor-not-allowed'
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Criando...
                            </>
                        ) : currentStep === STEPS.length ? (
                            <>
                                <FileText className="w-5 h-5" />
                                Iniciar Avaliação
                            </>
                        ) : (
                            <>
                                Continuar
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
}
