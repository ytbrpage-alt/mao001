import { useCallback } from 'react';

type VibrationType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const VIBRATION_PATTERNS: Record<VibrationType, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 40,
    success: [10, 50, 10],
    warning: [20, 50, 20, 50, 20],
    error: [50, 100, 50],
};

export function useVibration() {
    const vibrate = useCallback((type: VibrationType = 'light') => {
        if (!('vibrate' in navigator)) return;

        try {
            navigator.vibrate(VIBRATION_PATTERNS[type]);
        } catch (e) {
            // Vibração não suportada ou bloqueada
        }
    }, []);

    const vibratePattern = useCallback((pattern: number[]) => {
        if (!('vibrate' in navigator)) return;

        try {
            navigator.vibrate(pattern);
        } catch (e) {
            // Vibração não suportada ou bloqueada
        }
    }, []);

    const stopVibration = useCallback(() => {
        if (!('vibrate' in navigator)) return;

        try {
            navigator.vibrate(0);
        } catch (e) {
            // Vibração não suportada ou bloqueada
        }
    }, []);

    return { vibrate, vibratePattern, stopVibration };
}
