'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalHeader } from '@/components/portals/professional/ProfessionalHeader';
import { ProfessionalBottomNav } from '@/components/portals/professional/ProfessionalBottomNav';

interface ProfessionalLayoutProps {
    children: ReactNode;
}

const PROFESSIONAL_TYPES = [
    'admin',
    'caregiver',
    'nurse',
    'nurse_tech',
    'physiotherapist',
    'nutritionist',
    'psychologist',
    'speech_therapist',
    'occupational_therapist',
    'physician',
];

export default function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
            </div>
        );
    }

    const isProfessional = PROFESSIONAL_TYPES.includes(user?.role || '');

    if (!isProfessional) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
                <div className="text-center">
                    <p className="mb-4" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                        Acesso não autorizado
                    </p>
                    <a href="/login" className="text-brand-500 hover:text-brand-400 hover:underline">
                        Fazer login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
            <ProfessionalHeader />

            <main className="pt-16 pb-20 min-h-screen">
                <div className="container-mobile py-4">
                    {children}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-50">
                <ProfessionalBottomNav />
            </div>
        </div>
    );
}
