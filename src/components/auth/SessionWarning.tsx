'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function SessionWarning() {
    const { showSessionWarning, sessionExpiresIn, extendSession } = useAuth();

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {showSessionWarning && sessionExpiresIn && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    className="fixed top-0 left-0 right-0 z-50 p-4 bg-warning-500 text-white"
                >
                    <div className="container-mobile flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5" />
                            <div>
                                <p className="font-medium">Sessão expirando</p>
                                <p className="text-sm text-warning-100">
                                    Tempo restante: {formatTime(sessionExpiresIn)}
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={extendSession}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-warning-600 rounded-lg font-medium"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Estender
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
