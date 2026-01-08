'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Pill,
    ArrowLeft,
    Plus,
    AlertCircle,
    Search,
    Edit2,
    Trash2,
    X,
    Sun,
    Moon,
    Sunrise,
    Sunset,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useClientPortalStore, type Medication } from '@/stores/clientPortalStore';

const getRouteConfig = (route: Medication['route']) => {
    switch (route) {
        case 'oral':
            return { label: 'Via Oral', color: 'text-brand-600', bg: 'bg-brand-100 dark:bg-brand-900/30' };
        case 'injection':
            return { label: 'Injetável', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        case 'topical':
            return { label: 'Tópico', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
        default:
            return { label: 'Outro', color: 'text-neutral-600', bg: 'bg-neutral-100 dark:bg-neutral-800' };
    }
};

const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return Sunrise;
    if (hour >= 12 && hour < 18) return Sun;
    if (hour >= 18 && hour < 21) return Sunset;
    return Moon;
};

export default function PatientMedicationsPage() {
    const { medications, addMedication, updateMedication, deleteMedication } = useClientPortalStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: '',
        times: [''],
        route: 'oral' as Medication['route'],
        prescribedBy: '',
        notes: '',
    });

    const filteredMedications = medications.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeMeds = medications.filter(m => m.status === 'active').length;
    const renewalSoon = medications.filter(m => {
        if (!m.renewalDate) return false;
        const renewalDate = new Date(m.renewalDate);
        return renewalDate <= addDays(new Date(), 30);
    }).length;

    const handleEdit = (med: Medication) => {
        setEditingMedication(med);
        setFormData({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            times: med.times,
            route: med.route,
            prescribedBy: med.prescribedBy,
            notes: med.notes || '',
        });
        setShowEditModal(true);
    };

    const handleSave = () => {
        if (showEditModal && editingMedication) {
            updateMedication(editingMedication.id, {
                name: formData.name,
                dosage: formData.dosage,
                frequency: formData.frequency,
                times: formData.times.filter(t => t !== ''),
                route: formData.route,
                prescribedBy: formData.prescribedBy,
                notes: formData.notes || undefined,
            });
        } else {
            addMedication({
                name: formData.name,
                dosage: formData.dosage,
                frequency: formData.frequency,
                times: formData.times.filter(t => t !== ''),
                route: formData.route,
                status: 'active',
                startDate: new Date(),
                prescribedBy: formData.prescribedBy,
                notes: formData.notes || undefined,
            });
        }
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingMedication(null);
        resetForm();
    };

    const handleDelete = (id: string) => {
        deleteMedication(id);
    };

    const handleAddTime = () => {
        setFormData(prev => ({ ...prev, times: [...prev.times, ''] }));
    };

    const handleRemoveTime = (index: number) => {
        setFormData(prev => ({
            ...prev,
            times: prev.times.filter((_, i) => i !== index),
        }));
    };

    const handleTimeChange = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            times: prev.times.map((t, i) => i === index ? value : t),
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            dosage: '',
            frequency: '',
            times: [''],
            route: 'oral',
            prescribedBy: '',
            notes: '',
        });
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/cliente/paciente" className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <ArrowLeft className="w-5 h-5" style={{ color: 'rgb(var(--color-text))' }} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                            Medicamentos
                        </h1>
                        <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                            {activeMeds} ativos
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Alert for renewals */}
            {renewalSoon > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800"
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0" />
                        <p className="text-sm text-warning-700 dark:text-warning-400">
                            {renewalSoon} medicamento(s) precisam de renovação de receita em breve
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar medicamentos..."
                        className="input-base pl-10"
                    />
                </div>
            </motion.div>

            {/* Medications List */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredMedications.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-12">
                            <Pill className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                            <p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhum medicamento encontrado</p>
                        </motion.div>
                    ) : (
                        filteredMedications.map((med, index) => {
                            const routeConfig = getRouteConfig(med.route);
                            const needsRenewal = med.renewalDate && new Date(med.renewalDate) <= addDays(new Date(), 30);

                            return (
                                <motion.div
                                    key={med.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="card"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', routeConfig.bg)}>
                                                <Pill className={cn('w-5 h-5', routeConfig.color)} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{med.name}</h3>
                                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{med.dosage} • {med.frequency}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleEdit(med)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                                                <Edit2 className="w-4 h-4" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                            </button>
                                            <button onClick={() => handleDelete(med.id)} className="p-2 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg">
                                                <Trash2 className="w-4 h-4 text-error-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Times */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {med.times.map((time, i) => {
                                            const TimeIcon = getTimeIcon(time);
                                            return (
                                                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
                                                    <TimeIcon className="w-3 h-3" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                                    <span style={{ color: 'rgb(var(--color-text))' }}>{time}</span>
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {med.notes && (
                                        <p className="text-xs mb-2 italic" style={{ color: 'rgb(var(--color-text-secondary))' }}>{med.notes}</p>
                                    )}

                                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-700">
                                        <span className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>{med.prescribedBy}</span>
                                        {needsRenewal && med.renewalDate && (
                                            <span className="badge text-xs bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Renovar até {format(new Date(med.renewalDate), 'dd/MM')}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {(showAddModal || showEditModal) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingMedication(null); }}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>
                                {showEditModal ? 'Editar Medicamento' : 'Novo Medicamento'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Nome do Medicamento</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="input-base" placeholder="Ex: Donepezila" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Dosagem</label>
                                        <input type="text" value={formData.dosage} onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))} className="input-base" placeholder="Ex: 10mg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Frequência</label>
                                        <input type="text" value={formData.frequency} onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))} className="input-base" placeholder="Ex: 1x ao dia" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Via de Administração</label>
                                    <select value={formData.route} onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value as Medication['route'] }))} className="input-base">
                                        <option value="oral">Via Oral</option>
                                        <option value="injection">Injetável</option>
                                        <option value="topical">Tópico</option>
                                        <option value="other">Outro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--color-text))' }}>Horários</label>
                                    {formData.times.map((time, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} className="input-base flex-1" />
                                            {formData.times.length > 1 && (
                                                <button onClick={() => handleRemoveTime(index)} className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button onClick={handleAddTime} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Adicionar horário
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Prescrito por</label>
                                    <input type="text" value={formData.prescribedBy} onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))} className="input-base" placeholder="Ex: Dr. João Oliveira" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Observações</label>
                                    <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} className="input-base min-h-[80px]" placeholder="Instruções adicionais..." />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingMedication(null); }} className="flex-1 btn-secondary">Cancelar</button>
                                <button onClick={handleSave} className="flex-1 btn-primary">{showEditModal ? 'Salvar' : 'Adicionar'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
