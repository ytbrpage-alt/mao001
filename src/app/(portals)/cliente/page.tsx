'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    ChevronRight,
    Phone,
    MessageCircle,
    Heart,
    Pill,
    FileText,
    AlertTriangle,
} from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

// Mock data
const mockPatient = {
    id: '1',
    fullName: 'Maria da Silva Santos',
    preferredName: 'Dona Maria',
    age: 78,
    photoUrl: null,
    careStatus: 'active',
    mainDiagnosis: 'Alzheimer estágio moderado',
    lastUpdate: new Date(),
};

const mockTodaySchedule = [
    {
        id: '1',
        time: '07:00',
        endTime: '19:00',
        professionalName: 'Ana Paula Costa',
        professionalType: 'Cuidadora',
        professionalPhoto: null,
        status: 'in_progress',
    },
];

const mockUpcomingEvents = [
    { id: '1', date: new Date(), time: '14:00', title: 'Fisioterapia', professionalName: 'Dr. Carlos Silva', type: 'appointment' },
    { id: '2', date: addDays(new Date(), 1), time: '10:00', title: 'Consulta Neurologia', professionalName: 'Dra. Patricia Souza', type: 'external' },
];

const mockQuickStats = { daysUnderCare: 45, pendingDocuments: 1 };

export default function ClientDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-neutral-900">Olá, {user?.fullName.split(' ')[0]}! 👋</h1>
                <p className="text-neutral-500 mt-1">{format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Link href="/cliente/paciente">
                    <div className="card bg-gradient-to-br from-brand-500 to-brand-600 text-white p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                {mockPatient.preferredName.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{mockPatient.preferredName}</h2>
                                <p className="text-brand-100 text-sm">{mockPatient.age} anos</p>
                                <p className="text-brand-100 text-sm mt-1">{mockPatient.mainDiagnosis}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-brand-200" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-sm text-brand-100">Em atendimento</span>
                            </div>
                            <span className="text-sm text-brand-100">{mockQuickStats.daysUnderCare} dias de cuidado</span>
                        </div>
                    </div>
                </Link>
            </motion.div>

            {mockTodaySchedule.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-neutral-900">Profissional Hoje</h2>
                        <Link href="/cliente/agenda" className="text-sm text-brand-600">Ver agenda</Link>
                    </div>
                    <div className="card">
                        {mockTodaySchedule.map((schedule) => (
                            <div key={schedule.id} className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
                                    {schedule.professionalName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-neutral-900">{schedule.professionalName}</p>
                                    <p className="text-sm text-neutral-500">{schedule.professionalType}</p>
                                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                                        <Clock className="w-4 h-4" />
                                        {schedule.time} - {schedule.endTime}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Link href={`/cliente/mensagens?to=${schedule.id}`} className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100">
                                        <MessageCircle className="w-5 h-5" />
                                    </Link>
                                    <a href="tel:+5545999999999" className="p-2 bg-success-50 text-success-600 rounded-lg hover:bg-success-100">
                                        <Phone className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-neutral-900">Próximos Eventos</h2>
                    <Link href="/cliente/agenda" className="text-sm text-brand-600">Ver todos</Link>
                </div>
                <div className="space-y-3">
                    {mockUpcomingEvents.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="card flex items-center gap-4"
                        >
                            <div className={cn('w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white', isToday(event.date) ? 'bg-brand-500' : 'bg-neutral-400')}>
                                <span className="text-xs font-medium">{format(event.date, 'MMM', { locale: ptBR }).toUpperCase()}</span>
                                <span className="text-lg font-bold leading-none">{format(event.date, 'dd')}</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-neutral-900">{event.title}</p>
                                <p className="text-sm text-neutral-500">{event.professionalName}</p>
                                <p className="text-sm text-neutral-400 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" />
                                    {event.time}
                                    {isToday(event.date) && <span className="ml-2 px-1.5 py-0.5 bg-brand-100 text-brand-600 text-xs rounded">Hoje</span>}
                                    {isTomorrow(event.date) && <span className="ml-2 px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded">Amanhã</span>}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-300" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="font-semibold text-neutral-900 mb-3">Acesso Rápido</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/cliente/paciente/saude">
                        <div className="card p-4 flex flex-col items-center gap-2 hover:shadow-medium transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-500" />
                            </div>
                            <span className="text-sm font-medium text-neutral-700">Saúde</span>
                        </div>
                    </Link>
                    <Link href="/cliente/paciente/medicamentos">
                        <div className="card p-4 flex flex-col items-center gap-2 hover:shadow-medium transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                                <Pill className="w-6 h-6 text-purple-500" />
                            </div>
                            <span className="text-sm font-medium text-neutral-700">Medicamentos</span>
                        </div>
                    </Link>
                    <Link href="/cliente/documentos">
                        <div className="card p-4 flex flex-col items-center gap-2 hover:shadow-medium transition-shadow relative">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-neutral-700">Documentos</span>
                            {mockQuickStats.pendingDocuments > 0 && (
                                <span className="absolute top-2 right-2 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {mockQuickStats.pendingDocuments}
                                </span>
                            )}
                        </div>
                    </Link>
                    <Link href="/cliente/mensagens">
                        <div className="card p-4 flex flex-col items-center gap-2 hover:shadow-medium transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <span className="text-sm font-medium text-neutral-700">Mensagens</span>
                        </div>
                    </Link>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="card bg-warning-50 border border-warning-200">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-warning-600" />
                        </div>
                        <div>
                            <p className="font-medium text-warning-800">Documento pendente</p>
                            <p className="text-sm text-warning-600 mt-1">A receita médica de Donepezila precisa ser renovada até 15/02/2026.</p>
                            <Link href="/cliente/documentos" className="inline-block mt-2 text-sm font-medium text-warning-700 hover:text-warning-800">
                                Ver documento →
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
