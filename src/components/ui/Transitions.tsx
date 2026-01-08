// src/components/ui/Transitions.tsx
// Animated transition wrapper components

'use client';

import { type ReactNode, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({ children, delay = 0, duration = 200, className }: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={cn(
                'transition-opacity',
                isVisible ? 'opacity-100' : 'opacity-0',
                className
            )}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {children}
        </div>
    );
}

interface SlideInProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    className?: string;
}

const slideTransforms = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4',
};

export function SlideIn({ children, direction = 'up', delay = 0, duration = 300, className }: SlideInProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={cn(
                'transition-all',
                isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${slideTransforms[direction]}`,
                className
            )}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {children}
        </div>
    );
}

interface StaggeredListProps {
    children: ReactNode[];
    delay?: number;
    staggerDelay?: number;
    className?: string;
}

export function StaggeredList({ children, delay = 0, staggerDelay = 50, className }: StaggeredListProps) {
    return (
        <div className={className}>
            {children.map((child, index) => (
                <SlideIn key={index} delay={delay + index * staggerDelay}>
                    {child}
                </SlideIn>
            ))}
        </div>
    );
}

interface CollapseProps {
    isOpen: boolean;
    children: ReactNode;
    duration?: number;
    className?: string;
}

export function Collapse({ isOpen, children, duration = 200, className }: CollapseProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

    useEffect(() => {
        if (isOpen) {
            const contentHeight = contentRef.current?.scrollHeight || 0;
            setHeight(contentHeight);
            const timer = setTimeout(() => setHeight('auto'), duration);
            return () => clearTimeout(timer);
        } else {
            const contentHeight = contentRef.current?.scrollHeight || 0;
            setHeight(contentHeight);
            requestAnimationFrame(() => {
                setHeight(0);
            });
        }
    }, [isOpen, duration]);

    return (
        <div
            className={cn('overflow-hidden transition-all', className)}
            style={{
                height: height === 'auto' ? 'auto' : height,
                transitionDuration: `${duration}ms`,
            }}
        >
            <div ref={contentRef}>{children}</div>
        </div>
    );
}

interface ScaleInProps {
    children: ReactNode;
    isVisible?: boolean;
    delay?: number;
    duration?: number;
    className?: string;
}

export function ScaleIn({ children, isVisible = true, delay = 0, duration = 200, className }: ScaleInProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setShow(true), delay);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isVisible, delay]);

    return (
        <div
            className={cn(
                'transition-all',
                show ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
                className
            )}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {children}
        </div>
    );
}

// Shake animation for errors
export function Shake({ children, trigger, className }: { children: ReactNode; trigger: boolean; className?: string }) {
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (trigger) {
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 500);
            return () => clearTimeout(timer);
        }
    }, [trigger]);

    return (
        <div className={cn(isShaking && 'animate-shake', className)}>
            {children}
        </div>
    );
}

// Pulse animation for attention
export function Pulse({ children, isActive, className }: { children: ReactNode; isActive: boolean; className?: string }) {
    return (
        <div className={cn(isActive && 'animate-pulse', className)}>
            {children}
        </div>
    );
}
