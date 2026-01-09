import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Mãos Amigas Home Care',
        default: 'Mãos Amigas Home Care - Cuidado Humanizado',
    },
    description: 'Serviços de home care com cuidadores, técnicos de enfermagem e enfermeiros. Cuidado humanizado e profissional para quem você ama.',
    keywords: ['home care', 'cuidador de idosos', 'enfermagem domiciliar', 'cuidado humanizado', 'São Paulo'],
    authors: [{ name: 'Mãos Amigas Home Care' }],
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        siteName: 'Mãos Amigas Home Care',
    },
};

/**
 * Public layout for institutional pages
 * Includes header and footer, different from logged-in area
 */
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicHeader />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}
