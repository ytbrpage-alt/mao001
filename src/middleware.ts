// src/middleware.ts
// Route protection middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/avaliacao',
    '/contrato',
    '/dashboard',
    '/configuracoes',
];

// Routes that should redirect authenticated users
const AUTH_ROUTES = [
    '/login',
    '/register',
];

// Public routes (no auth check needed)
const PUBLIC_ROUTES = [
    '/',
    '/api',
    '/_next',
    '/favicon.ico',
    '/icons',
    '/manifest.json',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip public routes and static assets
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get session token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthenticated = !!token;
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes to home
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check for token expiration error
    if (token?.error === 'RefreshAccessTokenError') {
        // Clear session and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('next-auth.session-token');
        response.cookies.delete('__Secure-next-auth.session-token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (icons, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
