import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const QUICK_LINKS = [
    { href: '/', label: 'Início' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/depoimentos', label: 'Depoimentos' },
    { href: '/contato', label: 'Contato' },
];

const SERVICES_LINKS = [
    'Cuidado Domiciliar',
    'Acompanhamento Médico',
    'Atividades Diárias',
    'Cuidados Especializados',
    'Fisioterapia',
    'Nutrição',
];

const SOCIAL_LINKS = [
    {
        icon: Instagram,
        href: 'https://instagram.com/maosamigashomecare',
        label: 'Instagram',
        color: 'hover:bg-pink-500',
    },
    {
        icon: Facebook,
        href: 'https://facebook.com/maosamigashomecare',
        label: 'Facebook',
        color: 'hover:bg-blue-600',
    },
    {
        icon: MessageCircle,
        href: 'https://wa.me/554599999999',
        label: 'WhatsApp',
        color: 'hover:bg-green-500',
    },
];

/**
 * Public footer component for institutional pages
 * Features:
 * - 4-column responsive grid
 * - Contact information for Toledo-PR
 * - Social media links with hover effects
 * - Legal links and copyright
 * - WCAG compliant
 */
export function PublicFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white" role="contentinfo">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Column 1 - About */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                                'bg-gradient-to-br from-brand-400 to-brand-600',
                                'group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-brand-500/30'
                            )}>
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">Mãos Amigas</span>
                                <span className="block text-xs text-slate-400 -mt-0.5">Home Care</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Cuidado profissional e humanizado para seus entes queridos.
                            Há mais de 10 anos transformando vidas com excelência em home care
                            na região de Toledo e Oeste do Paraná.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300',
                                        'bg-slate-800 text-slate-400',
                                        social.color, 'hover:text-white hover:scale-110 hover:shadow-lg'
                                    )}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 text-lg">Links Rápidos</h4>
                        <ul className="space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span className="w-0 h-0.5 bg-brand-400 group-hover:w-2 transition-all duration-200" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Services */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 text-lg">Serviços</h4>
                        <ul className="space-y-3">
                            {SERVICES_LINKS.map((service) => (
                                <li key={service}>
                                    <Link
                                        href="/site/servicos"
                                        className="text-slate-400 hover:text-brand-400 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span className="w-0 h-0.5 bg-brand-400 group-hover:w-2 transition-all duration-200" />
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 text-lg">Contato</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-brand-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Toledo - PR</p>
                                    <p className="text-slate-400 text-sm">Oeste do Paraná</p>
                                </div>
                            </li>
                            <li>
                                <a href="tel:+554599999999" className="flex gap-3 group">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 transition-colors">
                                        <Phone className="w-5 h-5 text-brand-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium group-hover:text-brand-400 transition-colors">(45) 99999-9999</p>
                                        <p className="text-slate-400 text-sm">Atendimento 24h</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contato@maosamigas.com.br" className="flex gap-3 group">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 transition-colors">
                                        <Mail className="w-5 h-5 text-brand-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white group-hover:text-brand-400 transition-colors text-sm">contato@maosamigas.com.br</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/554599999999"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors mt-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Falar no WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-950 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm text-center md:text-left">
                            © {currentYear} Mãos Amigas Home Care. Todos os direitos reservados.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                            <Link href="/privacidade" className="text-slate-500 hover:text-brand-400 transition-colors">
                                Política de Privacidade
                            </Link>
                            <Link href="/termos" className="text-slate-500 hover:text-brand-400 transition-colors">
                                Termos de Uso
                            </Link>
                            <Link href="/lgpd" className="text-slate-500 hover:text-brand-400 transition-colors">
                                LGPD
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
