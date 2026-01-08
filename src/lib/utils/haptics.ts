// src/lib/utils/haptics.ts
// Haptic feedback utilities for mobile

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface HapticPattern {
    duration: number;
    gap?: number;
    repeat?: number;
}

const hapticPatterns: Record<HapticType, HapticPattern[]> = {
    light: [{ duration: 10 }],
    medium: [{ duration: 20 }],
    heavy: [{ duration: 30 }],
    success: [{ duration: 15 }, { duration: 10, gap: 50 }],
    warning: [{ duration: 20 }, { duration: 20, gap: 100 }, { duration: 20, gap: 100 }],
    error: [{ duration: 50 }],
    selection: [{ duration: 5 }],
};

/**
 * Trigger haptic feedback using the Vibration API
 */
export function haptic(type: HapticType = 'light'): void {
    if (typeof navigator === 'undefined') return;
    if (!('vibrate' in navigator)) return;

    const pattern = hapticPatterns[type];
    const vibrationPattern: number[] = [];

    pattern.forEach((p, index) => {
        if (index > 0 && p.gap) {
            vibrationPattern.push(p.gap);
        }
        vibrationPattern.push(p.duration);
    });

    try {
        navigator.vibrate(vibrationPattern);
    } catch {
        // Silently fail if vibration not supported
    }
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Haptic feedback for button press
 */
export function hapticPress(): void {
    haptic('light');
}

/**
 * Haptic feedback for success action
 */
export function hapticSuccess(): void {
    haptic('success');
}

/**
 * Haptic feedback for error
 */
export function hapticError(): void {
    haptic('error');
}

/**
 * Haptic feedback for warning
 */
export function hapticWarning(): void {
    haptic('warning');
}

/**
 * Haptic feedback for selection change
 */
export function hapticSelection(): void {
    haptic('selection');
}

/**
 * React hook for haptic feedback
 */
export function useHaptic() {
    return {
        trigger: haptic,
        press: hapticPress,
        success: hapticSuccess,
        error: hapticError,
        warning: hapticWarning,
        selection: hapticSelection,
        isSupported: isHapticSupported(),
    };
}
