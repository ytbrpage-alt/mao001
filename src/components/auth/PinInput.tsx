'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useVibration } from '@/hooks/useVibration';

interface PinInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    error?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    masked?: boolean;
}

export function PinInput({
    length = 6,
    value,
    onChange,
    onComplete,
    error,
    disabled = false,
    autoFocus = true,
    masked = true,
}: PinInputProps) {
    const { vibrate } = useVibration();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Focar primeiro input
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    // Chamar onComplete quando todos os dígitos forem preenchidos
    useEffect(() => {
        if (value.length === length && onComplete) {
            onComplete(value);
        }
    }, [value, length, onComplete]);

    const handleChange = (index: number, digit: string) => {
        if (disabled) return;

        // Aceitar apenas dígitos
        if (!/^\d*$/.test(digit)) return;

        const newValue = value.split('');
        newValue[index] = digit;
        const joined = newValue.join('').slice(0, length);

        onChange(joined);
        vibrate('light');

        // Avançar para próximo input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.key === 'Backspace') {
            e.preventDefault();

            if (value[index]) {
                // Apagar dígito atual
                const newValue = value.split('');
                newValue[index] = '';
                onChange(newValue.join(''));
            } else if (index > 0) {
                // Voltar para input anterior
                inputRefs.current[index - 1]?.focus();
                const newValue = value.split('');
                newValue[index - 1] = '';
                onChange(newValue.join(''));
            }

            vibrate('light');
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;

        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, length);

        if (digits) {
            onChange(digits);
            vibrate('medium');

            // Focar no último dígito preenchido ou no próximo vazio
            const focusIndex = Math.min(digits.length, length - 1);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        setFocusedIndex(index);
        // Selecionar conteúdo ao focar
        inputRefs.current[index]?.select();
    };

    const handleBlur = () => {
        setFocusedIndex(null);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-center gap-2 sm:gap-3">
                {Array.from({ length }).map((_, index) => {
                    const hasValue = value[index] !== undefined && value[index] !== '';
                    const isFocused = focusedIndex === index;
                    const hasError = !!error;

                    return (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                        >
                            <input
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type={masked ? 'password' : 'text'}
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={1}
                                value={value[index] || ''}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                onFocus={() => handleFocus(index)}
                                onBlur={handleBlur}
                                disabled={disabled}
                                autoComplete="one-time-code"
                                className={cn(
                                    'w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold',
                                    'rounded-xl border-2 transition-all duration-200',
                                    'focus:outline-none focus:ring-0',
                                    disabled && 'opacity-50 cursor-not-allowed bg-neutral-100',
                                    hasError
                                        ? 'border-danger-500 bg-danger-50'
                                        : isFocused
                                            ? 'border-brand-500 bg-white shadow-md'
                                            : hasValue
                                                ? 'border-brand-300 bg-brand-50'
                                                : 'border-neutral-300 bg-white'
                                )}
                            />

                            {/* Indicador de preenchido */}
                            <AnimatePresence>
                                {hasValue && masked && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <div className="w-3 h-3 bg-brand-500 rounded-full" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Mensagem de erro */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-danger-600 text-center"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
