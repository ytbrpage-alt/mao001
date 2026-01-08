'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PinInput } from '@/components/auth/PinInput';
import { NumericKeypad } from '@/components/auth/NumericKeypad';
import { useVibration } from '@/hooks/useVibration';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const { vibrate } = useVibration();

    const [pin, setPin] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [showPin, setShowPin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePinChange = useCallback((newPin: string) => {
        setPin(newPin);
        setError(null);
    }, []);

    const handleDigit = useCallback((digit: string) => {
        if (pin.length < 6) {
            handlePinChange(pin + digit);
        }
    }, [pin, handlePinChange]);

    const handleDelete = useCallback(() => {
        handlePinChange(pin.slice(0, -1));
    }, [pin, handlePinChange]);

    const handleComplete = useCallback(async (completedPin: string) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await login(completedPin);

            if (!result.success) {
                vibrate('error');
                setError(result.error?.message || 'PIN inválido');
                setRemainingAttempts(result.remainingAttempts ?? null);
                setPin('');
            } else {
                vibrate('success');
            }
        } catch (err) {
            vibrate('error');
            setError('Erro ao fazer login. Tente novamente.');
            setPin('');
        } finally {
            setIsSubmitting(false);
        }
    }, [login, isSubmitting, vibrate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex flex-col lg:flex-row lg:items-center lg:justify-center">
            {/* Left side - Branding (visible on desktop) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:w-1/2 lg:p-12"
            >
                <div className="w-32 h-32 bg-white rounded-3xl shadow-strong flex items-center justify-center mb-6">
                    <span className="text-6xl">🤝</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Mãos Amigas</h1>
                <p className="text-xl text-brand-100">Sistema de Avaliação</p>
                <p className="text-brand-200 mt-4 text-center max-w-md">
                    Gerencie avaliações domiciliares com eficiência e profissionalismo
                </p>
            </motion.div>

            {/* Mobile header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:hidden pt-safe-top px-6 py-8 text-center"
            >
                <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-2xl shadow-strong flex items-center justify-center">
                    <span className="text-4xl">🤝</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Mãos Amigas</h1>
                <p className="text-brand-100 mt-1">Sistema de Avaliação</p>
            </motion.div>

            {/* Card de login */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-white rounded-t-3xl lg:rounded-3xl px-6 py-8 shadow-strong lg:flex-none lg:w-full lg:max-w-md lg:mx-auto"
            >
                <div className="max-w-sm mx-auto">
                    {/* Título */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-neutral-900">
                            Digite seu PIN
                        </h2>
                        <p className="text-neutral-500 mt-1">
                            Use seu PIN de 6 dígitos para acessar
                        </p>
                    </div>

                    {/* Input de PIN */}
                    <div className="mb-6">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <PinInput
                                value={pin}
                                onChange={handlePinChange}
                                onComplete={handleComplete}
                                error={error || undefined}
                                disabled={isLoading || isSubmitting}
                                masked={!showPin}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className="p-2 text-neutral-400 hover:text-neutral-600"
                                aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                            >
                                {showPin ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Tentativas restantes */}
                        <AnimatePresence>
                            {remainingAttempts !== null && remainingAttempts < 5 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-center gap-2 text-warning-600 text-sm"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    <span>
                                        {remainingAttempts} tentativa{remainingAttempts !== 1 ? 's' : ''} restante{remainingAttempts !== 1 ? 's' : ''}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Teclado numérico */}
                    <div className="flex justify-center">
                        <NumericKeypad
                            onDigit={handleDigit}
                            onDelete={handleDelete}
                            disabled={isLoading || isSubmitting}
                        />
                    </div>

                    {/* Loading */}
                    <AnimatePresence>
                        {(isLoading || isSubmitting) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            >
                                <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                                    <p className="text-neutral-600">Verificando...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Link para recuperação */}
                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            className="text-brand-600 text-sm font-medium hover:underline"
                            onClick={() => {
                                alert('Entre em contato com o administrador para redefinir seu PIN');
                            }}
                        >
                            Esqueceu seu PIN?
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Footer - mobile only */}
            <div className="lg:hidden bg-white px-6 pb-safe-bottom py-4 text-center">
                <p className="text-xs text-neutral-400">
                    Mãos Amigas Home Care © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
