import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // Estado inicial
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Erro ao ler localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Atualizar localStorage quando valor mudar
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Erro ao salvar localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Setter
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setStoredValue((prev) => {
            const newValue = value instanceof Function ? value(prev) : value;
            return newValue;
        });
    }, []);

    // Remover
    const removeValue = useCallback(() => {
        if (typeof window === 'undefined') return;

        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn(`Erro ao remover localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}
