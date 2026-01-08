'use client';

import { motion } from 'framer-motion';
import { Delete, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useVibration } from '@/hooks/useVibration';

interface NumericKeypadProps {
    onDigit: (digit: string) => void;
    onDelete: () => void;
    onBiometric?: () => void;
    disabled?: boolean;
    showBiometric?: boolean;
}

export function NumericKeypad({
    onDigit,
    onDelete,
    onBiometric,
    disabled = false,
    showBiometric = false,
}: NumericKeypadProps) {
    const { vibrate } = useVibration();

    const handleDigit = (digit: string) => {
        if (disabled) return;
        vibrate('light');
        onDigit(digit);
    };

    const handleDelete = () => {
        if (disabled) return;
        vibrate('medium');
        onDelete();
    };

    const handleBiometric = () => {
        if (disabled || !onBiometric) return;
        vibrate('medium');
        onBiometric();
    };

    const buttonClass = cn(
        'w-20 h-20 sm:w-24 sm:h-24 rounded-full',
        'flex items-center justify-center',
        'text-2xl sm:text-3xl font-semibold text-neutral-800',
        'bg-white border border-neutral-200',
        'active:bg-neutral-100 active:scale-95',
        'transition-all duration-100',
        'touch-feedback',
        disabled && 'opacity-50 cursor-not-allowed'
    );

    const digits = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        [showBiometric ? 'bio' : '', '0', 'del'],
    ];

    return (
        <div className="flex flex-col items-center gap-3 sm:gap-4">
            {digits.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-3 sm:gap-4">
                    {row.map((key, keyIndex) => {
                        if (key === '') {
                            return <div key={keyIndex} className="w-20 h-20 sm:w-24 sm:h-24" />;
                        }

                        if (key === 'del') {
                            return (
                                <motion.button
                                    key={keyIndex}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDelete}
                                    disabled={disabled}
                                    className={cn(buttonClass, 'bg-neutral-100')}
                                    aria-label="Apagar"
                                >
                                    <Delete className="w-6 h-6 sm:w-7 sm:h-7" />
                                </motion.button>
                            );
                        }

                        if (key === 'bio') {
                            return (
                                <motion.button
                                    key={keyIndex}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBiometric}
                                    disabled={disabled || !onBiometric}
                                    className={cn(buttonClass, 'bg-brand-50 text-brand-600')}
                                    aria-label="Biometria"
                                >
                                    <Fingerprint className="w-7 h-7 sm:w-8 sm:h-8" />
                                </motion.button>
                            );
                        }

                        return (
                            <motion.button
                                key={keyIndex}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDigit(key)}
                                disabled={disabled}
                                className={buttonClass}
                            >
                                {key}
                            </motion.button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
