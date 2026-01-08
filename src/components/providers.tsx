'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EvaluationProvider } from '@/contexts/EvaluationContext';
import { OfflineProvider } from '@/contexts/OfflineContext';
import { SessionWarning } from '@/components/auth/SessionWarning';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider defaultTheme="system">
            <OfflineProvider>
                <AuthProvider>
                    <EvaluationProvider>
                        <ToastProvider>
                            {children}
                            <SessionWarning />
                        </ToastProvider>
                    </EvaluationProvider>
                </AuthProvider>
            </OfflineProvider>
        </ThemeProvider>
    );
}
