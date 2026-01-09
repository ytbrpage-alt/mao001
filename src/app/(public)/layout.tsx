import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Mãos Amigas Home Care',
        default: 'Mãos Amigas - Cuidadores de Idosos em Toledo-PR',
    },
    description: 'Serviços profissionais de cuidado domiciliar para idosos em Toledo-PR. Equipe qualificada de cuidadores, técnicos de enfermagem e enfermeiros. Atendimento 24h e planos personalizados.',
    keywords: [
        'cuidadores de idosos',
        'home care',
        'Toledo',
        'PR',
        'Paraná',
        'cuidado domiciliar',
        'enfermagem domiciliar',
        'cuidador',
        'idosos',
        'acompanhante',
        'técnico de enfermagem',
    ],
    authors: [{ name: 'Mãos Amigas Home Care', url: 'https://maosamigas.com.br' }],
    creator: 'Mãos Amigas Home Care',
    publisher: 'Mãos Amigas Home Care',
    formatDetection: {
        telephone: true,
        email: true,
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://maosamigas.com.br',
        siteName: 'Mãos Amigas Home Care',
        title: 'Mãos Amigas - Cuidadores de Idosos em Toledo-PR',
        description: 'Cuidado profissional e humanizado para seus entes queridos. Equipe qualificada, atendimento 24h.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Mãos Amigas Home Care - Cuidado Humanizado',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mãos Amigas - Cuidadores de Idosos em Toledo-PR',
        description: 'Cuidado profissional e humanizado para seus entes queridos.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://maosamigas.com.br',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#10B981' },
        { media: '(prefers-color-scheme: dark)', color: '#059669' },
    ],
};

/**
 * Public layout for institutional pages
 * Includes:
 * - Fixed header with scroll effect
 * - Main content area with padding for fixed header
 * - Full-width footer
 * - SEO optimized metadata
 */
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicHeader />
            <main className="flex-1 pt-16 lg:pt-20">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
