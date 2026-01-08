// src/lib/auth/rateLimiter.ts
// In-memory rate limiter for login attempts

import type { RateLimitResult } from '@/types/auth';

interface RateLimitEntry {
    count: number;
    firstAttempt: number;
    blockedUntil?: number;
}

// In-memory store (use Redis in production for multi-instance)
const attempts = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes block

/**
 * Check if an IP/identifier is rate limited
 */
export function checkRateLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const entry = attempts.get(identifier);

    // No previous attempts
    if (!entry) {
        return {
            allowed: true,
            remaining: MAX_ATTEMPTS,
            resetAt: new Date(now + WINDOW_MS),
        };
    }

    // Currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: new Date(entry.blockedUntil),
        };
    }

    // Window expired, reset counter
    if (now - entry.firstAttempt > WINDOW_MS) {
        attempts.delete(identifier);
        return {
            allowed: true,
            remaining: MAX_ATTEMPTS,
            resetAt: new Date(now + WINDOW_MS),
        };
    }

    // Check remaining attempts
    const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);
    return {
        allowed: remaining > 0,
        remaining,
        resetAt: new Date(entry.firstAttempt + WINDOW_MS),
    };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(identifier: string): RateLimitResult {
    const now = Date.now();
    const entry = attempts.get(identifier);

    if (!entry || now - entry.firstAttempt > WINDOW_MS) {
        // Start new window
        attempts.set(identifier, {
            count: 1,
            firstAttempt: now,
        });
        return {
            allowed: true,
            remaining: MAX_ATTEMPTS - 1,
            resetAt: new Date(now + WINDOW_MS),
        };
    }

    // Increment counter
    entry.count++;

    // Block if exceeded
    if (entry.count >= MAX_ATTEMPTS) {
        entry.blockedUntil = now + BLOCK_DURATION_MS;
        attempts.set(identifier, entry);
        return {
            allowed: false,
            remaining: 0,
            resetAt: new Date(entry.blockedUntil),
        };
    }

    attempts.set(identifier, entry);
    return {
        allowed: true,
        remaining: MAX_ATTEMPTS - entry.count,
        resetAt: new Date(entry.firstAttempt + WINDOW_MS),
    };
}

/**
 * Reset rate limit for an identifier (e.g., on successful login)
 */
export function resetRateLimit(identifier: string): void {
    attempts.delete(identifier);
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of attempts.entries()) {
        // Remove if window expired and not blocked
        if (now - entry.firstAttempt > WINDOW_MS && (!entry.blockedUntil || now > entry.blockedUntil)) {
            attempts.delete(key);
        }
    }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
