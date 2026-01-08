// src/lib/analytics/metricsService.ts
// Analytics metrics calculation service

import type { Evaluation } from '@/types';

export interface DashboardMetrics {
    total: number;
    completed: number;
    pending: number;
    draft: number;
    completionRate: number;
    averageAbemidScore: number;
    averageKatzScore: number;
    byStatus: Record<string, number>;
    byMonth: { month: string; count: number }[];
    byProfessional: { professional: string; count: number }[];
    recentEvaluations: { id: string; patientName: string; date: string; status: string }[];
}

export interface MetricFilter {
    startDate?: Date;
    endDate?: Date;
    evaluatorId?: string;
    status?: string;
}

/**
 * Calculate dashboard metrics from evaluations
 */
export function calculateMetrics(
    evaluations: Evaluation[],
    filter?: MetricFilter
): DashboardMetrics {
    // Apply filters
    let filtered = [...evaluations];

    if (filter?.startDate) {
        filtered = filtered.filter(
            (e) => new Date(e.createdAt) >= filter.startDate!
        );
    }
    if (filter?.endDate) {
        filtered = filtered.filter(
            (e) => new Date(e.createdAt) <= filter.endDate!
        );
    }
    if (filter?.evaluatorId) {
        filtered = filtered.filter((e) => e.evaluatorId === filter.evaluatorId);
    }
    if (filter?.status) {
        filtered = filtered.filter((e) => e.status === filter.status);
    }

    // Calculate basic metrics
    const total = filtered.length;
    const completed = filtered.filter((e) => e.status === 'completed').length;
    const pending = filtered.filter((e) => e.status === 'pending').length;
    const draft = filtered.filter((e) => e.status === 'draft').length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Calculate averages
    const abemidScores = filtered
        .filter((e) => e.abemid?.totalScore !== undefined)
        .map((e) => e.abemid.totalScore);
    const averageAbemidScore =
        abemidScores.length > 0
            ? abemidScores.reduce((a, b) => a + b, 0) / abemidScores.length
            : 0;

    const katzScores = filtered
        .filter((e) => e.katz?.totalScore !== undefined)
        .map((e) => e.katz.totalScore);
    const averageKatzScore =
        katzScores.length > 0
            ? katzScores.reduce((a, b) => a + b, 0) / katzScores.length
            : 0;

    // Group by status
    const byStatus: Record<string, number> = {};
    filtered.forEach((e) => {
        byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    });

    // Group by month
    const monthCounts: Record<string, number> = {};
    filtered.forEach((e) => {
        const date = new Date(e.createdAt);
        const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const byMonth = Object.entries(monthCounts)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Group by indicated professional
    const professionalCounts: Record<string, number> = {};
    filtered.forEach((e) => {
        if (e.abemid?.indicatedProfessional) {
            const prof = e.abemid.indicatedProfessional;
            professionalCounts[prof] = (professionalCounts[prof] || 0) + 1;
        }
    });
    const byProfessional = Object.entries(professionalCounts)
        .map(([professional, count]) => ({ professional, count }))
        .sort((a, b) => b.count - a.count);

    // Recent evaluations
    const recentEvaluations = filtered
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((e) => ({
            id: e.id,
            patientName: e.patient?.fullName || 'Sem nome',
            date: e.createdAt.toString(),
            status: e.status,
        }));

    return {
        total,
        completed,
        pending,
        draft,
        completionRate,
        averageAbemidScore,
        averageKatzScore,
        byStatus,
        byMonth,
        byProfessional,
        recentEvaluations,
    };
}

/**
 * Format month string for display
 */
export function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const monthNames = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

/**
 * Format professional type for display
 */
export function formatProfessional(type: string): string {
    const labels: Record<string, string> = {
        caregiver: 'Cuidador',
        nursing_technician: 'Técnico de Enfermagem',
        nurse: 'Enfermeiro',
    };
    return labels[type] || type;
}
