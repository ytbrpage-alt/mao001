'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
    useSyncExternalStore,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, initializeDefaultAdmin } from '@/stores/authStore';
import type { User, AuthResult, Permissions } from '@/types/auth';

interface AuthContextValue {
    // Estado
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    permissions: Permissions | null;

    // Ações
    login: (pin: string) => Promise<AuthResult>;
    logout: () => void;

    // Verificações
    hasPermission: (permission: keyof Permissions) => boolean;

    // UI State
    showSessionWarning: boolean;
    sessionExpiresIn: number | null;
    extendSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = ['/login', '/forgot-pin', '/'];

// Tempo antes da expiração para mostrar aviso (5 minutos)
const SESSION_WARNING_THRESHOLD = 5 * 60 * 1000;

interface AuthProviderProps {
    children: ReactNode;
}

// Hook simples para verificar se está no cliente
function useIsClient() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isClient = useIsClient();

    const store = useAuthStore();
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [sessionExpiresIn, setSessionExpiresIn] = useState<number | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Aguardar um ciclo de render para garantir hidratação do Zustand
    useEffect(() => {
        if (!isClient) return;

        // Pequeno delay para garantir que o Zustand hidratou
        const timer = setTimeout(() => {
            initializeDefaultAdmin().then(() => {
                setIsReady(true);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [isClient]);

    // Verificar sessão periodicamente
    useEffect(() => {
        if (!isReady) return;

        const checkSession = () => {
            const isValid = store.checkSession();

            if (!isValid && !PUBLIC_ROUTES.includes(pathname)) {
                router.push('/login');
                return;
            }

            // Calcular tempo restante
            if (store.session) {
                const remaining = new Date(store.session.expiresAt).getTime() - Date.now();
                setSessionExpiresIn(remaining);

                // Mostrar aviso se estiver perto de expirar
                setShowSessionWarning(remaining > 0 && remaining < SESSION_WARNING_THRESHOLD);
            }
        };

        checkSession();
        const interval = setInterval(checkSession, 30000); // A cada 30 segundos

        return () => clearInterval(interval);
    }, [isReady, pathname, router, store]);

    // Registrar atividade em interações
    useEffect(() => {
        if (!store.isAuthenticated) return;

        const handleActivity = () => {
            store.recordActivity();
        };

        // Eventos que indicam atividade
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [store.isAuthenticated, store]);

    // Redirecionar se não autenticado
    useEffect(() => {
        if (!isReady) return;

        const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

        if (!store.isAuthenticated && !isPublicRoute) {
            router.push('/login');
        } else if (store.isAuthenticated && pathname === '/login') {
            router.push('/');
        }
    }, [isReady, store.isAuthenticated, pathname, router]);

    const login = useCallback(async (pin: string) => {
        const result = await store.loginWithPin(pin);

        if (result.success) {
            router.push('/');
        }

        return result;
    }, [store, router]);

    const logout = useCallback(() => {
        store.logout();
        router.push('/login');
    }, [store, router]);

    const extendSession = useCallback(() => {
        store.refreshSession();
        setShowSessionWarning(false);
    }, [store]);

    const hasPermission = useCallback((permission: keyof Permissions) => {
        return store.hasPermission(permission);
    }, [store]);

    const value: AuthContextValue = {
        user: store.getCurrentUser(),
        isAuthenticated: store.isAuthenticated,
        isLoading: !isReady,
        permissions: store.getPermissions(),

        login,
        logout,

        hasPermission,

        showSessionWarning,
        sessionExpiresIn,
        extendSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}

// Hook para proteger rotas
export function useRequireAuth(requiredPermission?: keyof Permissions) {
    const { isAuthenticated, isLoading, hasPermission } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (requiredPermission && !hasPermission(requiredPermission)) {
            router.push('/unauthorized');
        }
    }, [isAuthenticated, isLoading, requiredPermission, hasPermission, router]);

    return { isLoading, isAuthorized: isAuthenticated && (!requiredPermission || hasPermission(requiredPermission)) };
}
