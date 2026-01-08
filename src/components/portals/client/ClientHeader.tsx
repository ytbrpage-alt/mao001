'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '../shared/NotificationBell';

export function ClientHeader() {
    const { user, logout } = useAuth();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-40">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                <div className="lg:hidden flex items-center gap-3">
                    <button onClick={() => setShowMobileMenu(true)} className="p-2 -ml-2 text-neutral-600">
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link href="/cliente" className="flex items-center gap-2">
                        <span className="text-xl">🤝</span>
                    </Link>
                </div>

                <div className="hidden lg:block" />

                <div className="flex items-center gap-2">
                    <div className="hidden sm:block relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-64 pl-9 pr-4 py-2 bg-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <NotificationBell />

                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100"
                        >
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-medium text-sm">
                                {user?.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U'}
                            </div>
                        </button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-strong border border-neutral-200 py-1"
                                >
                                    <div className="px-3 py-2 border-b border-neutral-100">
                                        <p className="font-medium text-sm text-neutral-900 truncate">{user?.fullName}</p>
                                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link href="/cliente/configuracoes" className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                                        Configurações
                                    </Link>
                                    <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-danger-600 hover:bg-danger-50">
                                        Sair
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showMobileMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setShowMobileMenu(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween' }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                                <Link href="/cliente" className="flex items-center gap-2">
                                    <span className="text-xl">🤝</span>
                                    <span className="font-bold">Mãos Amigas</span>
                                </Link>
                                <button onClick={() => setShowMobileMenu(false)} className="p-2 text-neutral-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
