// src/types/public.types.ts
// Types for public/institutional pages

/**
 * Service offering displayed on services page
 */
export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    slug?: string;
}

/**
 * Client testimonial for social proof
 */
export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    photo?: string;
    date: Date;
}

/**
 * Contact form data structure
 */
export interface ContactForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

/**
 * Team member displayed on about page
 */
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    photo?: string;
    linkedin?: string;
}

/**
 * FAQ item for frequently asked questions
 */
export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
}

/**
 * Navigation link for public header
 */
export interface NavLink {
    href: string;
    label: string;
    isExternal?: boolean;
}
