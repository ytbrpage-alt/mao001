// src/lib/auth/index.ts
// Auth barrel export

export { authOptions } from './authOptions';
export { checkRateLimit, recordFailedAttempt, resetRateLimit } from './rateLimiter';
export { validatePassword, hashPassword, verifyPassword, generateSecureToken } from './passwordUtils';
export { findUserByEmail, findUserById, createUser, updateLastLogin } from './userStore';
