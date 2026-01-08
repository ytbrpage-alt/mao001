'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '../shared/NotificationBell';
import { SyncIndicator } from '@/components/sync/SyncIndicator';

export function ProfessionalHeader() {
    const { user } = useAuth();

    const getProfessionalLabel = () => {
        switch (user?.role) {
            case 'caregiver': return 'Cuidador(a)';
            case 'nurse': return 'Enfermeiro(a)';
            case 'nurse_tech': return 'Téc. Enfermagem';
            default: return 'Profissional';
        }
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 h-16 z-40 transition-colors duration-200"
            style={{
                backgroundColor: 'rgb(var(--color-bg-elevated))',
                borderBottom: '1px solid rgb(var(--color-border))'
            }}
        >
            <div className="h-full px-4 flex items-center justify-between">
                {/* Logo and type */}
                <div className="flex items-center gap-3">
                    <Link href="/pro" className="flex items-center gap-2">
                        <span className="text-xl">🤝</span>
                        <div>
                            <p
                                className="font-semibold text-sm leading-tight"
                                style={{ color: 'rgb(var(--color-text))' }}
                            >
                                Mãos Amigas
                            </p>
                            <p className="text-xs text-brand-500">
                                {getProfessionalLabel()}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <SyncIndicator minimal />
                    <NotificationBell />
                </div>
            </div>
        </header>
    );
}
