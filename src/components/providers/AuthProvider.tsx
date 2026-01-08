// src/components/providers/AuthProvider.tsx
// NextAuth.js Session Provider wrapper

'use client';

import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    return (
        <SessionProvider
            // Re-fetch session every 5 minutes
            refetchInterval={5 * 60}
            // Refetch session when window regains focus
            refetchOnWindowFocus={true}
        >
            {children}
        </SessionProvider>
    );
}
