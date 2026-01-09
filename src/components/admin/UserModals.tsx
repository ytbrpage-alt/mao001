'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Shield, Eye, EyeOff, Check, AlertCircle, Key } from 'lucide-react';
import type { UserRole, UserStatus } from '@/types/auth';
import { cn } from '@/lib/utils/cn';

interface UserFormData {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    role: UserRole;
    status: UserStatus;
}

const initialFormData: UserFormData = {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    role: 'client',
    status: 'pending',
};

const ROLES: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Administrador' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'evaluator', label: 'Avaliador' },
    { value: 'client', label: 'Cliente' },
    { value: 'nurse', label: 'Enfermeiro' },
    { value: 'caregiver', label: 'Cuidador' },
    { value: 'nurse_tech', label: 'Técnico de Enfermagem' },
    { value: 'physiotherapist', label: 'Fisioterapeuta' },
    { value: 'nutritionist', label: 'Nutricionista' },
    { value: 'psychologist', label: 'Psicólogo' },
    { value: 'speech_therapist', label: 'Fonoaudiólogo' },
    { value: 'occupational_therapist', label: 'Terapeuta Ocupacional' },
    { value: 'physician', label: 'Médico' },
];

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-x-4 top-[10%] max-w-lg mx-auto bg-[rgb(var(--color-bg-elevated))] rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden flex flex-col"
                >
                    <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--color-border))]">
                        <h2 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-secondary))]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1">
                        {children}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => void;
}

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 500));
        onSubmit(formData);
        setFormData(initialFormData);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Novo Usuário">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        Nome Completo *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                            placeholder="Nome do usuário"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        E-mail *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                            placeholder="email@exemplo.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                            Telefone
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                                placeholder="(45) 99999-9999"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                            CPF
                        </label>
                        <input
                            type="text"
                            value={formData.cpf}
                            onChange={(e) => setFormData(p => ({ ...p, cpf: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                            placeholder="000.000.000-00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        Perfil *
                    </label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                        <select
                            required
                            value={formData.role}
                            onChange={(e) => setFormData(p => ({ ...p, role: e.target.value as UserRole }))}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500 appearance-none"
                        >
                            {ROLES.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-brand-500/10 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        Um PIN temporário será gerado e enviado por e-mail para o usuário.
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] font-medium hover:bg-[rgb(var(--color-bg-muted))]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Check className="w-5 h-5" />
                        )}
                        Criar Usuário
                    </button>
                </div>
            </form>
        </Modal>
    );
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserFormData | null;
    onSubmit: (data: UserFormData) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSubmit }: EditUserModalProps) {
    const [formData, setFormData] = useState<UserFormData>(user || initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 500));
        onSubmit(formData);
        setIsSubmitting(false);
        onClose();
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuário">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        E-mail
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                            Perfil
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData(p => ({ ...p, role: e.target.value as UserRole }))}
                            className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                        >
                            {ROLES.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as UserStatus }))}
                            className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-primary))] focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="active">Ativo</option>
                            <option value="pending">Pendente</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] font-medium hover:bg-[rgb(var(--color-bg-muted))]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

interface ResetPinModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    onConfirm: () => void;
}

export function ResetPinModal({ isOpen, onClose, userName, onConfirm }: ResetPinModalProps) {
    const [isResetting, setIsResetting] = useState(false);

    const handleConfirm = async () => {
        setIsResetting(true);
        await new Promise(r => setTimeout(r, 500));
        onConfirm();
        setIsResetting(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Reset de PIN">
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-warning-500/20 flex items-center justify-center mx-auto">
                    <Key className="w-8 h-8 text-warning-500" />
                </div>

                <div className="text-center">
                    <p className="text-[rgb(var(--color-text-primary))] mb-2">
                        Você tem certeza que deseja resetar o PIN de:
                    </p>
                    <p className="text-lg font-semibold text-brand-500">
                        {userName}
                    </p>
                </div>

                <div className="bg-warning-500/10 rounded-xl p-4 text-sm text-[rgb(var(--color-text-secondary))]">
                    <p>
                        Um novo PIN temporário será gerado e enviado por e-mail para o usuário.
                        O usuário precisará criar um novo PIN no próximo acesso.
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] font-medium hover:bg-[rgb(var(--color-bg-muted))]"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isResetting}
                        className="flex-1 py-3 px-4 rounded-xl bg-warning-500 text-white font-semibold hover:bg-warning-600 disabled:opacity-50"
                    >
                        {isResetting ? 'Resetando...' : 'Confirmar Reset'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
