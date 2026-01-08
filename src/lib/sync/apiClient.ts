// src/lib/sync/apiClient.ts
import type { ApiResponse } from '@/types/sync';
import type { Evaluation } from '@/types';
import type { User } from '@/types/auth';
import type { AuditLogEntry } from '@/types/audit';

const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.maosamigas.com.br',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
};

function getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Client-Version': '1.0.0',
        'X-Device-Id': typeof window !== 'undefined'
            ? localStorage.getItem('maos-amigas-device-id') || ''
            : '',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = API_CONFIG.retryAttempts
): Promise<Response> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok && retries > 0 && response.status >= 500) {
            await new Promise(r => setTimeout(r, API_CONFIG.retryDelay));
            return fetchWithRetry(url, options, retries - 1);
        }
        return response;
    } catch (error) {
        if (retries > 0 && error instanceof Error && error.name !== 'AbortError') {
            await new Promise(r => setTimeout(r, API_CONFIG.retryDelay));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

export const apiClient = {
    async getEvaluations(token: string, since?: Date): Promise<ApiResponse<Evaluation[]>> {
        try {
            const params = new URLSearchParams();
            if (since) params.set('since', since.toISOString());
            const response = await fetchWithRetry(
                `${API_CONFIG.baseUrl}/evaluations?${params}`,
                { method: 'GET', headers: getHeaders(token) }
            );
            const data = await response.json();
            return { success: true, data: data.evaluations, meta: data.meta };
        } catch {
            return { success: false, error: { code: 'NETWORK_ERROR', message: 'Erro de conexão' } };
        }
    },

    async createEvaluation(token: string, evaluation: Evaluation): Promise<ApiResponse<Evaluation>> {
        try {
            const response = await fetchWithRetry(`${API_CONFIG.baseUrl}/evaluations`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify(evaluation),
            });
            const data = await response.json();
            if (!response.ok) return { success: false, error: data.error };
            return { success: true, data: data.evaluation, meta: data.meta };
        } catch {
            return { success: false, error: { code: 'NETWORK_ERROR', message: 'Erro de conexão' } };
        }
    },

    async updateEvaluation(
        token: string,
        id: string,
        evaluation: Partial<Evaluation>,
        expectedVersion?: number
    ): Promise<ApiResponse<Evaluation>> {
        try {
            const headers = getHeaders(token);
            if (expectedVersion !== undefined) {
                headers['If-Match'] = `"${expectedVersion}"`;
            }
            const response = await fetchWithRetry(`${API_CONFIG.baseUrl}/evaluations/${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(evaluation),
            });
            const data = await response.json();
            if (response.status === 409) {
                return { success: false, error: { code: 'CONFLICT', message: 'Conflito de versão' }, data: data.serverData };
            }
            if (!response.ok) return { success: false, error: data.error };
            return { success: true, data: data.evaluation, meta: data.meta };
        } catch {
            return { success: false, error: { code: 'NETWORK_ERROR', message: 'Erro de conexão' } };
        }
    },

    async deleteEvaluation(token: string, id: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetchWithRetry(`${API_CONFIG.baseUrl}/evaluations/${id}`, {
                method: 'DELETE',
                headers: getHeaders(token),
            });
            if (!response.ok) {
                const data = await response.json();
                return { success: false, error: data.error };
            }
            return { success: true };
        } catch {
            return { success: false, error: { code: 'NETWORK_ERROR', message: 'Erro de conexão' } };
        }
    },

    async pushAuditLogs(token: string, logs: AuditLogEntry[]): Promise<ApiResponse<string[]>> {
        try {
            const response = await fetchWithRetry(`${API_CONFIG.baseUrl}/audit-logs/batch`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ logs }),
            });
            const data = await response.json();
            return { success: true, data: data.savedIds };
        } catch {
            return { success: false, error: { code: 'NETWORK_ERROR', message: 'Erro de conexão' } };
        }
    },

    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            return response.ok;
        } catch {
            return false;
        }
    },
};
