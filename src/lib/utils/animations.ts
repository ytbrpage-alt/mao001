// src/lib/utils/animations.ts
// Animation utility classes and constants

// Keyframe animation definitions for tailwind.config.js
export const keyframes = {
    'slide-up': {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    'slide-down': {
        '0%': { transform: 'translateY(-10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    'slide-in-right': {
        '0%': { transform: 'translateX(100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    'slide-in-left': {
        '0%': { transform: 'translateX(-100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
    },
    'fade-out': {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
    },
    'scale-in': {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
    },
    'scale-out': {
        '0%': { transform: 'scale(1)', opacity: '1' },
        '100%': { transform: 'scale(0.95)', opacity: '0' },
    },
    'shake': {
        '0%, 100%': { transform: 'translateX(0)' },
        '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
        '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
    },
    'pulse-scale': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
    },
    'bounce-in': {
        '0%': { transform: 'scale(0.3)', opacity: '0' },
        '50%': { transform: 'scale(1.05)' },
        '70%': { transform: 'scale(0.9)' },
        '100%': { transform: 'scale(1)', opacity: '1' },
    },
    'shimmer': {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
    },
};

// Animation class names
export const animations = {
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideInRight: 'animate-slide-in-right',
    slideInLeft: 'animate-slide-in-left',
    fadeIn: 'animate-fade-in',
    fadeOut: 'animate-fade-out',
    scaleIn: 'animate-scale-in',
    scaleOut: 'animate-scale-out',
    shake: 'animate-shake',
    pulseScale: 'animate-pulse-scale',
    bounceIn: 'animate-bounce-in',
    shimmer: 'animate-shimmer',
};

// Transition presets
export const transitions = {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    spring: 'transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
    bounce: 'transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
};

// Stagger delay helper
export function staggerDelay(index: number, baseDelay: number = 50): string {
    return `${index * baseDelay}ms`;
}

// CSS custom properties for JS-controlled animations
export function setAnimationDuration(element: HTMLElement, duration: number): void {
    element.style.setProperty('--animation-duration', `${duration}ms`);
}

// Reduced motion helper
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Conditional animation class
export function animationClass(className: string): string {
    if (prefersReducedMotion()) {
        return '';
    }
    return className;
}
