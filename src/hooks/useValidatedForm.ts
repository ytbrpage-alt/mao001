// src/hooks/useValidatedForm.ts
// Custom hook for validated forms with Zod + React Hook Form

import { useForm, UseFormProps, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { useCallback, useEffect } from 'react';
import { useEvaluationStore } from '@/stores/evaluationStore';

interface UseValidatedFormOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
    schema: ZodSchema<T>;
    storeKey?: string;
    onValidSubmit?: (data: T) => void;
    autoSave?: boolean;
    autoSaveDelay?: number;
}

interface UseValidatedFormReturn<T extends FieldValues> extends UseFormReturn<T> {
    handleValidSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isSubmitting: boolean;
    hasErrors: boolean;
}

export function useValidatedForm<T extends FieldValues>({
    schema,
    storeKey,
    onValidSubmit,
    autoSave = false,
    autoSaveDelay = 1000,
    defaultValues,
    ...formOptions
}: UseValidatedFormOptions<T>): UseValidatedFormReturn<T> {
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
        mode: 'onBlur', // Validate on blur for better UX
        ...formOptions,
    });

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = form;

    const hasErrors = Object.keys(errors).length > 0;

    // Handle validated submit
    const handleValidSubmit = useCallback(
        async (e?: React.BaseSyntheticEvent) => {
            await handleSubmit(async (data) => {
                if (onValidSubmit) {
                    onValidSubmit(data);
                }
            })(e);
        },
        [handleSubmit, onValidSubmit]
    );

    // Auto-save functionality
    useEffect(() => {
        if (!autoSave || !storeKey) return;

        const subscription = watch((data) => {
            // Debounced save would go here
            // For now, just log
            console.log('[AutoSave]', storeKey, data);
        });

        return () => subscription.unsubscribe();
    }, [autoSave, storeKey, watch]);

    return {
        ...form,
        handleValidSubmit,
        isSubmitting,
        hasErrors,
    };
}

// Preset configurations for each section
export const formConfigs = {
    discovery: {
        mode: 'onBlur' as const,
    },
    patient: {
        mode: 'onBlur' as const,
    },
    healthHistory: {
        mode: 'onChange' as const, // Checkboxes benefit from onChange
    },
    abemid: {
        mode: 'onChange' as const, // Radio buttons
    },
    katz: {
        mode: 'onChange' as const,
    },
    lawton: {
        mode: 'onChange' as const,
    },
    safetyChecklist: {
        mode: 'onChange' as const,
    },
    schedule: {
        mode: 'onBlur' as const,
    },
};
