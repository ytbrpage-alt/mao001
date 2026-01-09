import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

/**
 * Public footer component for institutional pages
 * Server component with contact info, links, and social media
 */
export function PublicFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">Mãos Amigas</span>
                                <span className="block text-xs text-neutral-400 -mt-1">Home Care</span>
                            </div>
                        </Link>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Cuidado humanizado e profissional para quem você ama.
                            Há mais de 10 anos transformando vidas com excelência em home care.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-neutral-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-neutral-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-neutral-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Links Rápidos</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/servicos" className="text-neutral-400 hover:text-brand-400 transition-colors">
                                    Nossos Serviços
                                </Link>
                            </li>
                            <li>
                                <Link href="/sobre" className="text-neutral-400 hover:text-brand-400 transition-colors">
                                    Sobre Nós
                                </Link>
                            </li>
                            <li>
                                <Link href="/depoimentos" className="text-neutral-400 hover:text-brand-400 transition-colors">
                                    Depoimentos
                                </Link>
                            </li>
                            <li>
                                <Link href="/contato" className="text-neutral-400 hover:text-brand-400 transition-colors">
                                    Contato
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-neutral-400 hover:text-brand-400 transition-colors">
                                    Área do Cliente
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Serviços</h4>
                        <ul className="space-y-3">
                            <li className="text-neutral-400">Cuidador de Idosos</li>
                            <li className="text-neutral-400">Técnico de Enfermagem</li>
                            <li className="text-neutral-400">Enfermeiro</li>
                            <li className="text-neutral-400">Fisioterapia</li>
                            <li className="text-neutral-400">Nutrição</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contato</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <Phone className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">(11) 99999-9999</p>
                                    <p className="text-neutral-400 text-sm">24 horas por dia</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white">contato@maosamigashomecare.com.br</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-neutral-400">São Paulo - SP</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-neutral-500 text-sm text-center md:text-left">
                            © {currentYear} Mãos Amigas Home Care. Todos os direitos reservados.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacidade" className="text-neutral-500 hover:text-brand-400 transition-colors">
                                Política de Privacidade
                            </Link>
                            <Link href="/termos" className="text-neutral-500 hover:text-brand-400 transition-colors">
                                Termos de Uso
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
