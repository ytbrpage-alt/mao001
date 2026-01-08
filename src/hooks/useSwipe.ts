import { useRef, useEffect, useCallback } from 'react';

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
}

interface SwipeOptions {
    threshold?: number;
    preventDefaultOnSwipe?: boolean;
}

export function useSwipe<T extends HTMLElement>(
    handlers: SwipeHandlers,
    options: SwipeOptions = {}
) {
    const { threshold = 50, preventDefaultOnSwipe = false } = options;

    const ref = useRef<T>(null);
    const startX = useRef(0);
    const startY = useRef(0);
    const startTime = useRef(0);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        startTime.current = Date.now();
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX.current;
        const deltaY = endY - startY.current;
        const deltaTime = Date.now() - startTime.current;

        // Verificar se foi um swipe rápido o suficiente (< 300ms)
        if (deltaTime > 300) return;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Determinar direção predominante
        if (absX > absY && absX > threshold) {
            if (preventDefaultOnSwipe) e.preventDefault();

            if (deltaX > 0) {
                handlers.onSwipeRight?.();
            } else {
                handlers.onSwipeLeft?.();
            }
        } else if (absY > absX && absY > threshold) {
            if (preventDefaultOnSwipe) e.preventDefault();

            if (deltaY > 0) {
                handlers.onSwipeDown?.();
            } else {
                handlers.onSwipeUp?.();
            }
        }
    }, [handlers, threshold, preventDefaultOnSwipe]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefaultOnSwipe });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchEnd, preventDefaultOnSwipe]);

    return ref;
}
