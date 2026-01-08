import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Mãos Amigas - Sistema de Avaliação',
    description: 'Sistema de avaliação presencial para cuidados domiciliares',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Mãos Amigas',
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#1E8AAD' },
        { media: '(prefers-color-scheme: dark)', color: '#0C3745' },
    ],
};

// Script to prevent flash of wrong theme
const themeScript = `
(function() {
    try {
        var theme = localStorage.getItem('maos-amigas-theme');
        var resolved = theme;
        if (!theme || theme === 'system') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
    } catch (e) {}
})();
`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
            <head>
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="font-sans antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
