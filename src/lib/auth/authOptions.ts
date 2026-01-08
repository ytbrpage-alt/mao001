// src/lib/auth/authOptions.ts
// NextAuth.js configuration

import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { UserRole } from '@/types/auth';
import { findUserByEmail, updateLastLogin, createUser } from './userStore';
import { verifyPassword, hashPassword } from './passwordUtils';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from './rateLimiter';

// JWT expiration times
const ACCESS_TOKEN_EXPIRES = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60; // 7 days in seconds

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Email e Senha',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email e senha são obrigatórios');
                }

                const email = credentials.email.toLowerCase();

                // Get IP for rate limiting
                const ip = req?.headers?.['x-forwarded-for'] ||
                    req?.headers?.['x-real-ip'] ||
                    'unknown';
                const identifier = `${ip}:${email}`;

                // Check rate limit
                const rateLimit = checkRateLimit(identifier);
                if (!rateLimit.allowed) {
                    const minutes = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000);
                    throw new Error(`Muitas tentativas. Tente novamente em ${minutes} minutos.`);
                }

                // Find user
                const user = await findUserByEmail(email);
                if (!user) {
                    recordFailedAttempt(identifier);
                    throw new Error('Email ou senha incorretos');
                }

                // Verify password
                const isValid = await verifyPassword(credentials.password, user.passwordHash);
                if (!isValid) {
                    recordFailedAttempt(identifier);
                    throw new Error('Email ou senha incorretos');
                }

                // Success - reset rate limit and update last login
                resetRateLimit(identifier);
                await updateLastLogin(user.id);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
        // Google OAuth (optional)
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    authorization: {
                        params: {
                            prompt: 'consent',
                            access_type: 'offline',
                            response_type: 'code',
                        },
                    },
                }),
            ]
            : []),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            // For OAuth providers, create user if doesn't exist
            if (account?.provider === 'google' && profile?.email) {
                const existingUser = await findUserByEmail(profile.email);
                if (!existingUser) {
                    await createUser(
                        profile.email,
                        profile.name || 'Usuário Google',
                        await hashPassword(crypto.randomUUID()), // Random password for OAuth users
                        'EVALUATOR'
                    );
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'EVALUATOR';
                token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES * 1000;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to update it
            // In a real app, you'd refresh the token here
            token.error = 'RefreshAccessTokenError';
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
                session.error = token.error as string | undefined;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: 'jwt',
        maxAge: REFRESH_TOKEN_EXPIRES,
    },

    jwt: {
        maxAge: REFRESH_TOKEN_EXPIRES,
    },

    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production'
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: process.env.NODE_ENV === 'production'
                ? '__Host-next-auth.csrf-token'
                : 'next-auth.csrf-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },

    debug: process.env.NODE_ENV === 'development',
};
