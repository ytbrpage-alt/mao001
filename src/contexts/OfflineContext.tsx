'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OfflineContextValue {
    isOnline: boolean;
    isOfflineReady: boolean;
    pendingSyncs: number;
    lastSyncTime: Date | null;

    forceSync: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function OfflineProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState(true);
    const [isOfflineReady, setIsOfflineReady] = useState(false);
    const [pendingSyncs, setPendingSyncs] = useState(0);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

    useEffect(() => {
        // Verificar estado inicial
        setIsOnline(navigator.onLine);

        // Listeners de conexão
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Verificar se Service Worker está pronto
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(() => {
                setIsOfflineReady(true);
            });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const forceSync = async () => {
        // TODO: Implementar sincronização com backend
        setLastSyncTime(new Date());
        setPendingSyncs(0);
    };

    const value: OfflineContextValue = {
        isOnline,
        isOfflineReady,
        pendingSyncs,
        lastSyncTime,
        forceSync,
    };

    return (
        <OfflineContext.Provider value={value}>
            {children}
        </OfflineContext.Provider>
    );
}

export function useOffline() {
    const context = useContext(OfflineContext);
    if (!context) {
        throw new Error('useOffline deve ser usado dentro de OfflineProvider');
    }
    return context;
}
