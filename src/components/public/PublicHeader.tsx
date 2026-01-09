'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Heart, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { NavLink } from '@/types/public.types';

const NAV_LINKS: NavLink[] = [
    { href: '/site', label: 'Início' },
    { href: '/site/servicos', label: 'Serviços' },
    { href: '/site/sobre', label: 'Sobre Nós' },
    { href: '/site/depoimentos', label: 'Depoimentos' },
    { href: '/site/contato', label: 'Contato' },
];

/**
 * Public header component for institutional pages
 * Features:
 * - Sticky header with scroll effect
 * - Glassmorphism background when scrolled
 * - Responsive mobile menu
 * - Active link highlighting
 * - CTAs for contact and login
 */
export function PublicHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const isActive = (href: string) => {
        if (href === '/site') return pathname === '/site';
        return pathname.startsWith(href);
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/90 backdrop-blur-lg shadow-lg shadow-neutral-900/5'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                        aria-label="Mãos Amigas - Página inicial"
                    >
                        <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                            'bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30',
                            'group-hover:shadow-xl group-hover:shadow-brand-500/40 group-hover:scale-105'
                        )}>
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className={cn(
                                'text-xl font-bold transition-colors',
                                isScrolled ? 'text-brand-600' : 'text-brand-600'
                            )}>
                                Mãos Amigas
                            </span>
                            <span className={cn(
                                'block text-xs -mt-1 transition-colors',
                                isScrolled ? 'text-neutral-500' : 'text-neutral-600'
                            )}>
                                Home Care
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'relative px-4 py-2 rounded-lg font-medium transition-all duration-200',
                                    isActive(link.href)
                                        ? 'text-brand-600 bg-brand-50'
                                        : cn(
                                            isScrolled ? 'text-neutral-700' : 'text-neutral-700',
                                            'hover:text-brand-600 hover:bg-brand-50/50'
                                        )
                                )}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        <a
                            href="tel:+554599999999"
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                                isScrolled
                                    ? 'text-neutral-700 hover:text-brand-600'
                                    : 'text-neutral-700 hover:text-brand-600'
                            )}
                        >
                            <Phone className="w-4 h-4" />
                            <span>(45) 99999-9999</span>
                        </a>
                        <Link
                            href="/login"
                            className={cn(
                                'px-5 py-2.5 rounded-xl font-semibold transition-all duration-200',
                                'border-2 border-brand-600 text-brand-600',
                                'hover:bg-brand-50 active:scale-95'
                            )}
                        >
                            Área do Cliente
                        </Link>
                        <Link
                            href="/site/contato"
                            className={cn(
                                'px-5 py-2.5 rounded-xl font-semibold transition-all duration-200',
                                'bg-brand-600 text-white shadow-lg shadow-brand-500/30',
                                'hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/40 active:scale-95'
                            )}
                        >
                            Agendar Avaliação
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={cn(
                            'lg:hidden p-2 rounded-lg transition-colors',
                            isScrolled ? 'text-neutral-700' : 'text-neutral-700',
                            'hover:bg-neutral-100'
                        )}
                        aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'lg:hidden fixed inset-0 top-16 z-40 transition-all duration-300',
                    isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />

                {/* Menu Panel */}
                <div
                    className={cn(
                        'absolute top-0 right-0 w-full max-w-sm h-[calc(100vh-4rem)] bg-white shadow-2xl',
                        'transform transition-transform duration-300 ease-out overflow-y-auto',
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    )}
                >
                    <nav className="p-6 space-y-2" aria-label="Navegação mobile">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all',
                                    isActive(link.href)
                                        ? 'text-brand-600 bg-brand-50'
                                        : 'text-neutral-700 hover:bg-neutral-50'
                                )}
                            >
                                {link.label}
                                <ChevronRight className="w-4 h-4 text-neutral-400" />
                            </Link>
                        ))}
                    </nav>

                    <div className="p-6 pt-0 space-y-3">
                        <hr className="border-neutral-200 mb-4" />

                        <a
                            href="tel:+554599999999"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            (45) 99999-9999
                        </a>

                        <Link
                            href="/login"
                            className="block w-full px-4 py-3 text-center rounded-xl font-semibold border-2 border-brand-600 text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                            Área do Cliente
                        </Link>

                        <Link
                            href="/site/contato"
                            className="block w-full px-4 py-3 text-center rounded-xl font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                        >
                            Agendar Avaliação Gratuita
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
