// src/hooks/useAuth.ts
// Custom hook for authentication

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { UserRole } from '@/types/auth';

interface UseAuthReturn {
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | undefined;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (role: UserRole | UserRole[]) => boolean;
}

export function useAuth(): UseAuthReturn {
    const { data: session, status } = useSession();
    const router = useRouter();

    const isLoading = status === 'loading';
    const isAuthenticated = status === 'authenticated';

    const user = session?.user
        ? {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.name || '',
            role: session.user.role,
        }
        : null;

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.refresh();
            return true;
        }

        return false;
    }, [router]);

    const loginWithGoogle = useCallback(async (): Promise<void> => {
        await signIn('google', { callbackUrl: '/' });
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        await signOut({ callbackUrl: '/login' });
    }, []);

    const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
        if (!user) return false;

        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role);
    }, [user]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error: session?.error,
        login,
        loginWithGoogle,
        logout,
        hasRole,
    };
}
