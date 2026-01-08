'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/cliente/mensagens');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p style={{ color: 'rgb(var(--color-text-secondary))' }}>Redirecionando...</p>
            </div>
        </div>
    );
}
