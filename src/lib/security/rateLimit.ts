/**
 * Rate Limiting Middleware
 * 
 * Protects against brute force attacks by limiting request rates
 * Uses in-memory store (replace with Redis in production)
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_CONFIG = {
    // Login attempts
    login: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    },
    // API requests
    api: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
        message: 'Muitas requisições. Aguarde um momento.',
    },
    // Evaluation creation
    evaluation: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 50,
        message: 'Limite de avaliações atingido. Tente novamente mais tarde.',
    },
};

type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

// Get client identifier (IP + User-Agent hash for more accuracy)
function getClientIdentifier(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Simple hash for identifier
    const identifier = `${ip}|${userAgent.substring(0, 50)}`;
    return identifier;
}

// Check rate limit
export function checkRateLimit(
    request: NextRequest,
    type: RateLimitType = 'api'
): { allowed: boolean; remaining: number; resetIn: number } {
    const config = RATE_LIMIT_CONFIG[type];
    const clientId = getClientIdentifier(request);
    const key = `${type}:${clientId}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    // Clean up old entries periodically
    if (rateLimitStore.size > 10000) {
        cleanupExpiredEntries();
    }

    if (!entry || now > entry.resetTime) {
        // Create new entry
        entry = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, entry);

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs,
        };
    }

    // Increment count
    entry.count++;

    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);
    const resetIn = entry.resetTime - now;

    return { allowed, remaining, resetIn };
}

// Create rate limit response
export function rateLimitResponse(
    type: RateLimitType,
    resetIn: number
): NextResponse {
    const config = RATE_LIMIT_CONFIG[type];
    const resetInSeconds = Math.ceil(resetIn / 1000);

    return NextResponse.json(
        {
            error: config.message,
            retryAfter: resetInSeconds,
        },
        {
            status: 429,
            headers: {
                'Retry-After': String(resetInSeconds),
                'X-RateLimit-Limit': String(config.maxRequests),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': String(Date.now() + resetIn),
            },
        }
    );
}

// Cleanup expired entries
function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

// Rate limit middleware for API routes
export function withRateLimit(
    handler: (request: NextRequest) => Promise<NextResponse>,
    type: RateLimitType = 'api'
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        const { allowed, remaining, resetIn } = checkRateLimit(request, type);

        if (!allowed) {
            return rateLimitResponse(type, resetIn);
        }

        const response = await handler(request);

        // Add rate limit headers to response
        response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_CONFIG[type].maxRequests));
        response.headers.set('X-RateLimit-Remaining', String(remaining));
        response.headers.set('X-RateLimit-Reset', String(Date.now() + resetIn));

        return response;
    };
}

// Express-style middleware for use in route handlers
export function rateLimitMiddleware(type: RateLimitType = 'api') {
    return (request: NextRequest): NextResponse | null => {
        const { allowed, resetIn } = checkRateLimit(request, type);

        if (!allowed) {
            return rateLimitResponse(type, resetIn);
        }

        return null; // Continue to handler
    };
}
