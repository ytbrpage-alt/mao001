'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, isLoading } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
            </div>
        );
    }

    const isAdmin = ['admin', 'supervisor', 'evaluator'].includes(user?.role || '');

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100">
                <p className="text-neutral-500">Acesso não autorizado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100">
            <div className={cn('transition-all duration-300', sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')}>
                <main className="pt-16 min-h-screen">
                    <div className="p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
