// src/lib/auth/userStore.ts
// Temporary user store - replace with database in production

import type { AuthUser, UserRole } from '@/types/auth';
import { hashPassword } from './passwordUtils';

// In-memory user store for development
// In production, replace with database queries
const users = new Map<string, AuthUser>();

// Initialize with a demo user
async function initDemoUser() {
    const demoUser: AuthUser = {
        id: 'demo-user-1',
        email: 'admin@maosamidas.com.br',
        name: 'Administrador',
        role: 'ADMIN' as UserRole,
        passwordHash: await hashPassword('Admin123'),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    users.set(demoUser.email.toLowerCase(), demoUser);
}

// Initialize on module load
initDemoUser().catch(console.error);

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<AuthUser | null> {
    const user = users.get(email.toLowerCase());
    return user || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<AuthUser | null> {
    for (const user of users.values()) {
        if (user.id === id) {
            return user;
        }
    }
    return null;
}

/**
 * Create a new user
 */
export async function createUser(
    email: string,
    name: string,
    passwordHash: string,
    role: UserRole = 'EVALUATOR'
): Promise<AuthUser> {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const user: AuthUser = {
        id,
        email: email.toLowerCase(),
        name,
        role,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    users.set(email.toLowerCase(), user);
    return user;
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
    for (const [email, user] of users.entries()) {
        if (user.id === userId) {
            user.lastLoginAt = new Date();
            user.updatedAt = new Date();
            users.set(email, user);
            break;
        }
    }
}

/**
 * Get all users (for admin)
 */
export async function getAllUsers(): Promise<AuthUser[]> {
    return Array.from(users.values());
}
