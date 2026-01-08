'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'maos-amigas-theme';

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    // Get system preference
    const getSystemTheme = useCallback((): 'light' | 'dark' => {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);

    // Resolve the actual theme to apply
    const resolveTheme = useCallback((t: Theme): 'light' | 'dark' => {
        if (t === 'system') {
            return getSystemTheme();
        }
        return t;
    }, [getSystemTheme]);

    // Apply theme to document
    const applyTheme = useCallback((resolved: 'light' | 'dark') => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        // Also set color-scheme for native elements
        root.style.colorScheme = resolved;
    }, []);

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        const initialTheme = savedTheme || defaultTheme;
        setThemeState(initialTheme);
        const resolved = resolveTheme(initialTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
        setMounted(true);
    }, [defaultTheme, resolveTheme, applyTheme]);

    // Listen for system theme changes
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const resolved = getSystemTheme();
                setResolvedTheme(resolved);
                applyTheme(resolved);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, mounted, getSystemTheme, applyTheme]);

    // Set theme function
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        const resolved = resolveTheme(newTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
    }, [resolveTheme, applyTheme]);

    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }, [resolvedTheme, setTheme]);

    // Prevent flash on initial load
    if (!mounted) {
        return (
            <ThemeContext.Provider value={{ theme: 'system', resolvedTheme: 'light', setTheme: () => { }, toggleTheme: () => { } }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Script to prevent flash of wrong theme (inject in head)
export const themeScript = `
(function() {
    try {
        var theme = localStorage.getItem('${THEME_STORAGE_KEY}');
        var resolved = theme;
        if (!theme || theme === 'system') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
    } catch (e) {}
})();
`;
