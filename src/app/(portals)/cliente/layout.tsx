'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ClientSidebar } from '@/components/portals/client/ClientSidebar';
import { ClientHeader } from '@/components/portals/client/ClientHeader';
import { ClientBottomNav } from '@/components/portals/client/ClientBottomNav';

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
            </div>
        );
    }

    if (user?.role !== 'client' && user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <p className="text-neutral-500">Acesso não autorizado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <ClientHeader />

            <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-neutral-200">
                <ClientSidebar />
            </div>

            <main className="lg:ml-64 pt-16 pb-20 lg:pb-6 min-h-screen">
                <div className="container-mobile lg:max-w-5xl lg:px-8 py-6">
                    {children}
                </div>
            </main>

            <div className="lg:hidden fixed bottom-0 left-0 right-0">
                <ClientBottomNav />
            </div>
        </div>
    );
}
