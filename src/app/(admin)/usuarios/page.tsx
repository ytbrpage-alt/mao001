'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    UserPlus,
    Shield,
    ShieldCheck,
    User as UserIcon,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useRequireAuth } from '@/contexts/AuthContext';
import type { User, UserRole, UserStatus } from '@/types/auth';
import { formatDate, formatRelativeDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

// Componentes auxiliares
const RoleBadge = ({ role }: { role: UserRole }) => {
    const config: Record<UserRole, { label: string; icon: typeof ShieldCheck; class: string }> = {
        admin: { label: 'Admin', icon: ShieldCheck, class: 'bg-purple-100 text-purple-700' },
        supervisor: { label: 'Supervisor', icon: Shield, class: 'bg-blue-100 text-blue-700' },
        evaluator: { label: 'Avaliador', icon: UserIcon, class: 'bg-green-100 text-green-700' },
        client: { label: 'Cliente', icon: UserIcon, class: 'bg-brand-100 text-brand-700' },
        nurse: { label: 'Enfermeiro', icon: UserIcon, class: 'bg-teal-100 text-teal-700' },
        caregiver: { label: 'Cuidador', icon: UserIcon, class: 'bg-orange-100 text-orange-700' },
        nurse_tech: { label: 'Téc. Enfermagem', icon: UserIcon, class: 'bg-cyan-100 text-cyan-700' },
        physiotherapist: { label: 'Fisioterapeuta', icon: UserIcon, class: 'bg-lime-100 text-lime-700' },
        nutritionist: { label: 'Nutricionista', icon: UserIcon, class: 'bg-amber-100 text-amber-700' },
        psychologist: { label: 'Psicólogo', icon: UserIcon, class: 'bg-pink-100 text-pink-700' },
        speech_therapist: { label: 'Fonoaudiólogo', icon: UserIcon, class: 'bg-violet-100 text-violet-700' },
        occupational_therapist: { label: 'Ter. Ocupacional', icon: UserIcon, class: 'bg-rose-100 text-rose-700' },
        physician: { label: 'Médico', icon: UserIcon, class: 'bg-indigo-100 text-indigo-700' },
    };

    const { label, icon: Icon, class: className } = config[role];

    return (
        <span className={cn('badge', className)}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
        </span>
    );
};

const StatusBadge = ({ status }: { status: UserStatus }) => {
    const config = {
        active: { label: 'Ativo', icon: CheckCircle, class: 'bg-success-100 text-success-700' },
        inactive: { label: 'Inativo', icon: XCircle, class: 'bg-neutral-100 text-neutral-600' },
        blocked: { label: 'Bloqueado', icon: XCircle, class: 'bg-danger-100 text-danger-700' },
        pending: { label: 'Pendente', icon: Clock, class: 'bg-warning-100 text-warning-700' },
    };

    const { label, icon: Icon, class: className } = config[status];

    return (
        <span className={cn('badge', className)}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
        </span>
    );
};

export default function UsersPage() {
    const { isLoading, isAuthorized } = useRequireAuth('canManageUsers');
    const store = useAuthStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const users = store.getAllUsers();

    // Filtrar usuários
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.cpf.includes(searchTerm);

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Você não tem permissão para acessar esta página.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
                <div className="container-mobile py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-neutral-900">Usuários</h1>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span className="hidden sm:inline">Novo Usuário</span>
                        </motion.button>
                    </div>

                    {/* Barra de busca */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou CPF..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-base pl-10"
                        />
                    </div>

                    {/* Filtros */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
                        >
                            <option value="all">Todos os perfis</option>
                            <option value="admin">Admin</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="evaluator">Avaliador</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
                            className="px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
                        >
                            <option value="all">Todos os status</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                            <option value="blocked">Bloqueados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de usuários */}
            <div className="container-mobile py-4">
                <p className="text-sm text-neutral-500 mb-4">
                    {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                </p>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="card"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className={cn(
                                            'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold',
                                            user.status === 'active' ? 'bg-brand-100 text-brand-600' : 'bg-neutral-100 text-neutral-400'
                                        )}>
                                            {user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-neutral-900">{user.fullName}</h3>
                                            <p className="text-sm text-neutral-500">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Menu de ações */}
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <RoleBadge role={user.role} />
                                    <StatusBadge status={user.status} />
                                </div>

                                <div className="mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-400">
                                    <div className="flex justify-between">
                                        <span>Criado: {formatDate(user.createdAt)}</span>
                                        {user.lastLoginAt && (
                                            <span>Último acesso: {formatRelativeDate(user.lastLoginAt)}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <UserIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500">Nenhum usuário encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* TODO: Modal de criação de usuário */}
            {/* TODO: Modal de edição de usuário */}
            {/* TODO: Modal de reset de PIN */}
        </div>
    );
}
