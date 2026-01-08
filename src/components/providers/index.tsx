// src/components/providers/index.tsx
// Combined providers wrapper

'use client';

import { type ReactNode, useEffect } from 'react';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster, useToast, setToastFunctions } from '@/components/ui/Toast';

interface ProvidersProps {
    children: ReactNode;
}

// Component to initialize standalone toast functions
function ToastInitializer() {
    const toastFns = useToast();

    useEffect(() => {
        setToastFunctions(toastFns);
    }, [toastFns]);

    return null;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider defaultTheme="system">
            <AuthProvider>
                <Toaster>
                    <ToastInitializer />
                    {children}
                </Toaster>
            </AuthProvider>
        </ThemeProvider>
    );
}
