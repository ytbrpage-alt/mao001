// src/types/ui.ts
// Shared UI component props

import type { ReactNode, HTMLAttributes } from 'react';

// Base props that all form inputs share
export interface BaseInputProps {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    required?: boolean;
    disabled?: boolean;
}

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}

// Card props
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    footer?: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Modal props
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
    children: ReactNode;
}

// Toast/notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onClose?: () => void;
}

// Step layout props
export interface StepLayoutProps {
    stepNumber: number;
    totalSteps: number;
    stepName: string;
    patientName?: string;
    onNext: () => void;
    onPrev: () => void;
    canGoNext?: boolean;
    canGoPrev?: boolean;
    nextLabel?: string;
    prevLabel?: string;
    isLastStep?: boolean;
    children: ReactNode;
}

// Question card props
export interface QuestionCardProps {
    title: string;
    script?: string;
    objective?: string;
    tip?: string;
    children: ReactNode;
}

// Select option
export interface SelectOption<T = string> {
    value: T;
    label: string;
    icon?: string | ReactNode;
    description?: string;
    disabled?: boolean;
    badge?: string;
    badgeColor?: 'success' | 'warning' | 'danger' | 'info';
}

// Radio group props
export interface RadioGroupProps<T = string> {
    label?: string;
    options: SelectOption<T>[];
    value: T;
    onValueChange: (value: T) => void;
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
}

// Checkbox props
export interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    description?: string;
}

// Badge variants
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps {
    variant?: BadgeVariant;
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}
