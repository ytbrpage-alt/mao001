// src/hooks/useSecureStorage.ts
// Hook for using encrypted secure storage

'use client';

import { useState, useEffect, useCallback } from 'react';
import { initSecureStorage, getSecureStorage, isSecureStorageInitialized, SecureStorage } from '@/lib/crypto';

interface UseSecureStorageReturn {
    isInitialized: boolean;
    isLoading: boolean;
    error: Error | null;
    storage: SecureStorage | null;
    setItem: (key: string, value: unknown) => Promise<void>;
    getItem: <T = unknown>(key: string) => Promise<T | null>;
    removeItem: (key: string) => void;
}

export function useSecureStorage(userId?: string): UseSecureStorageReturn {
    const [isInitialized, setIsInitialized] = useState(isSecureStorageInitialized());
    const [isLoading, setIsLoading] = useState(!isSecureStorageInitialized());
    const [error, setError] = useState<Error | null>(null);
    const [storage, setStorage] = useState<SecureStorage | null>(
        isSecureStorageInitialized() ? getSecureStorage() : null
    );

    useEffect(() => {
        if (isInitialized) return;

        let mounted = true;

        const initialize = async () => {
            try {
                setIsLoading(true);
                const secureStorage = await initSecureStorage(userId);

                if (mounted) {
                    setStorage(secureStorage);
                    setIsInitialized(true);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err : new Error('Failed to initialize'));
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        initialize();

        return () => {
            mounted = false;
        };
    }, [userId, isInitialized]);

    const setItem = useCallback(async (key: string, value: unknown) => {
        if (!storage) throw new Error('Storage not initialized');
        await storage.setItem(key, value);
    }, [storage]);

    const getItem = useCallback(async <T = unknown>(key: string): Promise<T | null> => {
        if (!storage) return null;
        return storage.getItem<T>(key);
    }, [storage]);

    const removeItem = useCallback((key: string) => {
        if (!storage) return;
        storage.removeItem(key);
    }, [storage]);

    return {
        isInitialized,
        isLoading,
        error,
        storage,
        setItem,
        getItem,
        removeItem,
    };
}
