import type { Metadata } from 'next';
import {
    HeroSection,
    ServicesSection,
    AboutSection,
    TestimonialsSection,
    ProcessSection,
    CTASection,
} from '@/components/public/sections';

export const metadata: Metadata = {
    title: 'Cuidado Humanizado para Quem Você Ama',
    description: 'Mãos Amigas Home Care oferece cuidadores, técnicos de enfermagem e enfermeiros 24h em Toledo-PR. Avaliação gratuita e atendimento personalizado.',
};

/**
 * Landing page / Home for public institutional area
 * Includes all animated sections for complete user journey
 */
export default function HomePage() {
    return (
        <>
            {/* Hero Section - Full viewport with CTAs */}
            <HeroSection />

            {/* Services Section - 4 service cards with features */}
            <ServicesSection />

            {/* Process Section - How it works in 6 steps */}
            <ProcessSection />

            {/* About Section - Company story, values, and team */}
            <AboutSection />

            {/* Testimonials Section - Carousel with reviews */}
            <TestimonialsSection />

            {/* CTA Section - Final conversion push */}
            <CTASection />
        </>
    );
}
