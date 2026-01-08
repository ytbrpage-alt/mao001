'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    CreditCard,
    Eye,
    EyeOff,
    Loader2,
    ArrowLeft,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { maskCPF, maskPhone } from '@/lib/utils/masks';

type UserType = 'client' | 'caregiver' | 'nurse';

interface FormData {
    fullName: string;
    email: string;
    cpf: string;
    phone: string;
    userType: UserType;
    pin: string;
    confirmPin: string;
}

const userTypeOptions = [
    { value: 'client', label: 'Familiar / Responsável', description: 'Acompanhar cuidados do paciente' },
    { value: 'caregiver', label: 'Cuidador(a)', description: 'Prestar cuidados domiciliares' },
    { value: 'nurse', label: 'Enfermeiro(a)', description: 'Atendimento técnico de enfermagem' },
];

export default function RegistroPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        cpf: '',
        phone: '',
        userType: 'client',
        pin: '',
        confirmPin: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const validateStep1 = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Nome é obrigatório';
        } else if (formData.fullName.trim().split(' ').length < 2) {
            newErrors.fullName = 'Informe nome e sobrenome';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        const cpfDigits = formData.cpf.replace(/\D/g, '');
        if (!cpfDigits) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (cpfDigits.length !== 11) {
            newErrors.cpf = 'CPF incompleto';
        }

        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (!phoneDigits) {
            newErrors.phone = 'Telefone é obrigatório';
        } else if (phoneDigits.length < 10) {
            newErrors.phone = 'Telefone incompleto';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.pin) {
            newErrors.pin = 'PIN é obrigatório';
        } else if (formData.pin.length !== 6) {
            newErrors.pin = 'PIN deve ter 6 dígitos';
        } else if (!/^\d+$/.test(formData.pin)) {
            newErrors.pin = 'PIN deve conter apenas números';
        }

        if (formData.pin !== formData.confirmPin) {
            newErrors.confirmPin = 'PINs não conferem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Simular registro - em produção, chamar API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Registro bem-sucedido
            setSuccess(true);

            // Redirecionar após 2 segundos
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            setError('Erro ao criar conta. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof FormData, value: string) => {
        let maskedValue = value;

        if (field === 'cpf') {
            maskedValue = maskCPF(value);
        } else if (field === 'phone') {
            maskedValue = maskPhone(value);
        }

        setFormData(prev => ({ ...prev, [field]: maskedValue }));

        // Limpar erro do campo ao digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-strong"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="w-10 h-10 text-success-600" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        Conta Criada!
                    </h2>
                    <p className="text-neutral-500">
                        Redirecionando para o login...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex flex-col">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-safe-top px-6 py-4"
            >
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Voltar</span>
                </Link>
            </motion.div>

            {/* Branding */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-6 text-center"
            >
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl shadow-strong flex items-center justify-center">
                    <span className="text-3xl">🤝</span>
                </div>
                <h1 className="text-xl font-bold text-white">Criar Conta</h1>
                <p className="text-brand-100 mt-1">Mãos Amigas Home Care</p>
            </motion.div>

            {/* Progress Steps */}
            <div className="px-6 mb-4">
                <div className="flex items-center justify-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${step >= 1 ? 'bg-white text-brand-600' : 'bg-brand-400 text-brand-200'
                        }`}>
                        1
                    </div>
                    <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-white' : 'bg-brand-400'}`} />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${step >= 2 ? 'bg-white text-brand-600' : 'bg-brand-400 text-brand-200'
                        }`}>
                        2
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-brand-100">
                    <span className="w-20 text-center">Dados Pessoais</span>
                    <span className="w-20 text-center">Segurança</span>
                </div>
            </div>

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-white rounded-t-3xl px-6 py-8 shadow-strong"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-5"
                        >
                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        placeholder="Seu nome completo"
                                        className={`input-base pl-10 ${errors.fullName ? 'border-error-500 focus:ring-error-500' : ''}`}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-error-600">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="seu@email.com"
                                        className={`input-base pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                                )}
                            </div>

                            {/* CPF */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    CPF
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={formData.cpf}
                                        onChange={(e) => handleChange('cpf', e.target.value)}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className={`input-base pl-10 ${errors.cpf ? 'border-error-500 focus:ring-error-500' : ''}`}
                                    />
                                </div>
                                {errors.cpf && (
                                    <p className="mt-1 text-sm text-error-600">{errors.cpf}</p>
                                )}
                            </div>

                            {/* Telefone */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Telefone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                        className={`input-base pl-10 ${errors.phone ? 'border-error-500 focus:ring-error-500' : ''}`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-error-600">{errors.phone}</p>
                                )}
                            </div>

                            {/* Tipo de Usuário */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Tipo de Cadastro
                                </label>
                                <div className="space-y-2">
                                    {userTypeOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleChange('userType', option.value)}
                                            className={`w-full p-3 rounded-xl border-2 text-left transition-all ${formData.userType === option.value
                                                    ? 'border-brand-500 bg-brand-50'
                                                    : 'border-neutral-200 hover:border-neutral-300'
                                                }`}
                                        >
                                            <p className={`font-medium ${formData.userType === option.value ? 'text-brand-700' : 'text-neutral-900'
                                                }`}>
                                                {option.label}
                                            </p>
                                            <p className="text-sm text-neutral-500">{option.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-5"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-semibold text-neutral-900">
                                    Crie seu PIN de acesso
                                </h2>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Este PIN de 6 dígitos será usado para acessar o aplicativo
                                </p>
                            </div>

                            {/* PIN */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    PIN (6 dígitos)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPin ? 'text' : 'password'}
                                        value={formData.pin}
                                        onChange={(e) => handleChange('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="••••••"
                                        maxLength={6}
                                        inputMode="numeric"
                                        className={`input-base text-center text-2xl tracking-[0.5em] ${errors.pin ? 'border-error-500 focus:ring-error-500' : ''
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPin(!showPin)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                                    >
                                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.pin && (
                                    <p className="mt-1 text-sm text-error-600">{errors.pin}</p>
                                )}
                            </div>

                            {/* Confirmar PIN */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Confirmar PIN
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPin ? 'text' : 'password'}
                                        value={formData.confirmPin}
                                        onChange={(e) => handleChange('confirmPin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="••••••"
                                        maxLength={6}
                                        inputMode="numeric"
                                        className={`input-base text-center text-2xl tracking-[0.5em] ${errors.confirmPin ? 'border-error-500 focus:ring-error-500' : ''
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                                    >
                                        {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPin && (
                                    <p className="mt-1 text-sm text-error-600">{errors.confirmPin}</p>
                                )}
                            </div>

                            {/* Voltar */}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full py-2 text-brand-600 font-medium hover:underline"
                            >
                                ← Voltar para dados pessoais
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 p-3 bg-error-50 border border-error-200 rounded-xl flex items-center gap-2 text-error-700"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="w-full btn-primary mt-6 py-4 text-lg"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Criando conta...
                        </span>
                    ) : step === 1 ? (
                        'Continuar'
                    ) : (
                        'Criar Conta'
                    )}
                </motion.button>

                {/* Link para login */}
                <p className="mt-6 text-center text-sm text-neutral-500">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="text-brand-600 font-medium hover:underline">
                        Fazer login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
