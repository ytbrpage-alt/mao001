'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Phone, Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { NavLink } from '@/types/public.types';

const NAV_LINKS: NavLink[] = [
    { href: '/', label: 'Início' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/depoimentos', label: 'Depoimentos' },
    { href: '/contato', label: 'Contato' },
];

/**
 * Public header component for institutional pages
 * Includes responsive mobile menu and CTA button
 */
export function PublicHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-brand-600">Mãos Amigas</span>
                            <span className="block text-xs text-neutral-500 -mt-1">Home Care</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-neutral-600 hover:text-brand-600 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="tel:+5511999999999"
                            className="flex items-center gap-2 text-neutral-600 hover:text-brand-600 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">(11) 99999-9999</span>
                        </a>
                        <Link
                            href="/login"
                            className="px-4 py-2 text-brand-600 border border-brand-600 rounded-lg hover:bg-brand-50 transition-colors font-medium"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/contato"
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-lg shadow-brand-500/25"
                        >
                            Solicitar Avaliação
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-neutral-600"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-neutral-200">
                    <nav className="px-4 py-4 space-y-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-neutral-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-3">
                            <Link
                                href="/login"
                                className="block w-full px-4 py-3 text-center text-brand-600 border border-brand-600 rounded-lg font-medium"
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/contato"
                                className="block w-full px-4 py-3 text-center bg-brand-600 text-white rounded-lg font-medium"
                            >
                                Solicitar Avaliação
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
