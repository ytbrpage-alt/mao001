/**
 * Authentication Middleware
 * 
 * Protects routes and checks authorization levels
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protected route patterns
const PROTECTED_ROUTES = [
    '/avaliacao',
    '/api/evaluations',
];

// Admin-only routes
const ADMIN_ROUTES = [
    '/admin',
    '/api/admin',
];

// Public routes (no auth required)
const PUBLIC_ROUTES = [
    '/login',
    '/api/auth',
    '/',
];

export async function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get session token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if route requires authentication
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    const isAdminRoute = ADMIN_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    // Redirect to login if not authenticated
    if (!token && isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check admin authorization
    if (isAdminRoute && token?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Acesso não autorizado' },
            { status: 403 }
        );
    }

    // Add user info to headers for API routes
    if (token && pathname.startsWith('/api/')) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', token.id as string);
        requestHeaders.set('x-user-role', token.role as string);
        requestHeaders.set('x-user-email', token.email as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

// Role-based access control helper
export function hasPermission(
    userRole: string,
    requiredRole: 'admin' | 'evaluator' | 'viewer'
): boolean {
    const roleHierarchy: Record<string, number> = {
        admin: 3,
        evaluator: 2,
        viewer: 1,
    };

    return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

// IDOR protection - verify resource ownership
export function verifyResourceOwnership(
    userId: string,
    resourceOwnerId: string,
    userRole: string
): boolean {
    // Admins can access any resource
    if (userRole === 'admin') {
        return true;
    }

    // Otherwise, must be owner
    return userId === resourceOwnerId;
}
