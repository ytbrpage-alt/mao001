/**
 * NextAuth.js Type Extensions
 * 
 * Extends default types to include custom fields
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: 'admin' | 'evaluator' | 'viewer';
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        role: 'admin' | 'evaluator' | 'viewer';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: 'admin' | 'evaluator' | 'viewer';
        loginTime: number;
    }
}
