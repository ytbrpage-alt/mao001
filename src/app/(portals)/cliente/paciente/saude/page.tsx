'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Heart,
    ArrowLeft,
    Plus,
    Edit2,
    Activity,
    Brain,
    Stethoscope,
    ShieldAlert,
    Trash2,
    X,
    Check,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useClientPortalStore, type HealthCondition, type Allergy } from '@/stores/clientPortalStore';

const getCategoryConfig = (category: HealthCondition['category']) => {
    switch (category) {
        case 'chronic':
            return { label: 'Crônica', icon: Heart, color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
        case 'mental':
            return { label: 'Neurológica', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        case 'acute':
            return { label: 'Aguda', icon: Activity, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
        default:
            return { label: 'Outra', icon: Stethoscope, color: 'text-neutral-600', bg: 'bg-neutral-100 dark:bg-neutral-800' };
    }
};

const getSeverityConfig = (severity: 'mild' | 'moderate' | 'severe') => {
    switch (severity) {
        case 'mild': return { label: 'Leve', color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        case 'moderate': return { label: 'Moderada', color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
        case 'severe': return { label: 'Grave', color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
    }
};

const getStatusConfig = (status: HealthCondition['status']) => {
    switch (status) {
        case 'active': return { label: 'Ativa', color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
        case 'controlled': return { label: 'Controlada', color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        case 'resolved': return { label: 'Resolvida', color: 'text-neutral-600', bg: 'bg-neutral-100 dark:bg-neutral-800' };
    }
};

export default function PatientHealthPage() {
    const { conditions, allergies, clinicalScores, addCondition, updateCondition, deleteCondition, addAllergy, updateAllergy, deleteAllergy } = useClientPortalStore();

    const [showConditionModal, setShowConditionModal] = useState(false);
    const [showAllergyModal, setShowAllergyModal] = useState(false);
    const [editingCondition, setEditingCondition] = useState<HealthCondition | null>(null);
    const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);

    const [conditionForm, setConditionForm] = useState({ name: '', category: 'chronic' as HealthCondition['category'], severity: 'mild' as HealthCondition['severity'], status: 'active' as HealthCondition['status'], diagnosisDate: '', notes: '' });
    const [allergyForm, setAllergyForm] = useState({ allergen: '', type: 'medication' as Allergy['type'], severity: 'mild' as Allergy['severity'], reaction: '' });

    const handleSaveCondition = () => {
        if (editingCondition) {
            updateCondition(editingCondition.id, conditionForm);
        } else {
            addCondition(conditionForm);
        }
        setShowConditionModal(false);
        setEditingCondition(null);
        setConditionForm({ name: '', category: 'chronic', severity: 'mild', status: 'active', diagnosisDate: '', notes: '' });
    };

    const handleSaveAllergy = () => {
        if (editingAllergy) {
            updateAllergy(editingAllergy.id, allergyForm);
        } else {
            addAllergy(allergyForm);
        }
        setShowAllergyModal(false);
        setEditingAllergy(null);
        setAllergyForm({ allergen: '', type: 'medication', severity: 'mild', reaction: '' });
    };

    const handleEditCondition = (c: HealthCondition) => {
        setEditingCondition(c);
        setConditionForm({ ...c, diagnosisDate: c.diagnosisDate || '', notes: c.notes || '' });
        setShowConditionModal(true);
    };

    const handleEditAllergy = (a: Allergy) => {
        setEditingAllergy(a);
        setAllergyForm({ ...a });
        setShowAllergyModal(true);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/cliente/paciente" className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <ArrowLeft className="w-5 h-5" style={{ color: 'rgb(var(--color-text))' }} />
                </Link>
                <div>
                    <h1 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Saúde Geral</h1>
                    <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Condições, alergias e scores</p>
                </div>
            </div>

            {/* Clinical Scores */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Scores Clínicos</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-5 h-5 text-brand-500" />
                            <span className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>KATZ</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-brand-600">{clinicalScores.katz.score}</span>
                            <span className="text-lg font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>({clinicalScores.katz.classification})</span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>{clinicalScores.katz.description}</p>
                    </div>
                    <div className="card">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-5 h-5 text-purple-500" />
                            <span className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>ABEMID</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-600">{clinicalScores.abemid.score}</span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>{clinicalScores.abemid.description}</p>
                    </div>
                </div>
            </motion.div>

            {/* Allergies */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
                        <ShieldAlert className="w-5 h-5 text-error-500" /> Alergias
                    </h2>
                    <button onClick={() => { setEditingAllergy(null); setAllergyForm({ allergen: '', type: 'medication', severity: 'mild', reaction: '' }); setShowAllergyModal(true); }} className="text-sm text-brand-600 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Adicionar
                    </button>
                </div>
                {allergies.length === 0 ? (
                    <div className="card text-center py-8"><Check className="w-10 h-10 mx-auto text-success-500 mb-2" /><p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhuma alergia registrada</p></div>
                ) : (
                    <div className="space-y-2">{allergies.map((allergy) => {
                        const severityConfig = getSeverityConfig(allergy.severity);
                        return (
                            <div key={allergy.id} className={cn('card border-l-4', allergy.severity === 'severe' ? 'border-l-error-500' : allergy.severity === 'moderate' ? 'border-l-warning-500' : 'border-l-success-500')}>
                                <div className="flex items-center justify-between">
                                    <div><h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{allergy.allergen}</h3><p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{allergy.reaction}</p></div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn('badge text-xs', severityConfig.bg, severityConfig.color)}>{severityConfig.label}</span>
                                        <button onClick={() => handleEditAllergy(allergy)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"><Edit2 className="w-4 h-4" style={{ color: 'rgb(var(--color-text-secondary))' }} /></button>
                                        <button onClick={() => deleteAllergy(allergy.id)} className="p-1 hover:bg-error-50 dark:hover:bg-error-900/20 rounded"><Trash2 className="w-4 h-4 text-error-500" /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}</div>
                )}
            </motion.div>

            {/* Conditions */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Condições de Saúde</h2>
                    <button onClick={() => { setEditingCondition(null); setConditionForm({ name: '', category: 'chronic', severity: 'mild', status: 'active', diagnosisDate: '', notes: '' }); setShowConditionModal(true); }} className="text-sm text-brand-600 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Adicionar
                    </button>
                </div>
                <div className="space-y-3">{conditions.map((condition) => {
                    const categoryConfig = getCategoryConfig(condition.category);
                    const statusConfig = getStatusConfig(condition.status);
                    const CategoryIcon = categoryConfig.icon;
                    return (
                        <div key={condition.id} className="card">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', categoryConfig.bg)}><CategoryIcon className={cn('w-5 h-5', categoryConfig.color)} /></div>
                                    <div><h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{condition.name}</h3>{condition.diagnosisDate && <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Desde {condition.diagnosisDate}</p>}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn('badge text-xs', statusConfig.bg, statusConfig.color)}>{statusConfig.label}</span>
                                    <button onClick={() => handleEditCondition(condition)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"><Edit2 className="w-4 h-4" style={{ color: 'rgb(var(--color-text-secondary))' }} /></button>
                                    <button onClick={() => deleteCondition(condition.id)} className="p-1 hover:bg-error-50 dark:hover:bg-error-900/20 rounded"><Trash2 className="w-4 h-4 text-error-500" /></button>
                                </div>
                            </div>
                            {condition.notes && <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{condition.notes}</p>}
                        </div>
                    );
                })}</div>
            </motion.div>

            {/* Condition Modal */}
            <AnimatePresence>
                {showConditionModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowConditionModal(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>{editingCondition ? 'Editar Condição' : 'Nova Condição'}</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Nome</label><input type="text" value={conditionForm.name} onChange={(e) => setConditionForm(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="Ex: Hipertensão" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Categoria</label><select value={conditionForm.category} onChange={(e) => setConditionForm(p => ({ ...p, category: e.target.value as HealthCondition['category'] }))} className="input-base"><option value="chronic">Crônica</option><option value="mental">Neurológica</option><option value="acute">Aguda</option><option value="other">Outra</option></select></div>
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Gravidade</label><select value={conditionForm.severity} onChange={(e) => setConditionForm(p => ({ ...p, severity: e.target.value as HealthCondition['severity'] }))} className="input-base"><option value="mild">Leve</option><option value="moderate">Moderada</option><option value="severe">Grave</option></select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Status</label><select value={conditionForm.status} onChange={(e) => setConditionForm(p => ({ ...p, status: e.target.value as HealthCondition['status'] }))} className="input-base"><option value="active">Ativa</option><option value="controlled">Controlada</option><option value="resolved">Resolvida</option></select></div>
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Ano do Diagnóstico</label><input type="text" value={conditionForm.diagnosisDate} onChange={(e) => setConditionForm(p => ({ ...p, diagnosisDate: e.target.value }))} className="input-base" placeholder="Ex: 2020" /></div>
                                </div>
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Observações</label><textarea value={conditionForm.notes} onChange={(e) => setConditionForm(p => ({ ...p, notes: e.target.value }))} className="input-base min-h-[80px]" placeholder="Informações adicionais..." /></div>
                            </div>
                            <div className="flex gap-3 mt-6"><button onClick={() => setShowConditionModal(false)} className="flex-1 btn-secondary">Cancelar</button><button onClick={handleSaveCondition} className="flex-1 btn-primary">{editingCondition ? 'Salvar' : 'Adicionar'}</button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Allergy Modal */}
            <AnimatePresence>
                {showAllergyModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowAllergyModal(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>{editingAllergy ? 'Editar Alergia' : 'Nova Alergia'}</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Alérgeno</label><input type="text" value={allergyForm.allergen} onChange={(e) => setAllergyForm(p => ({ ...p, allergen: e.target.value }))} className="input-base" placeholder="Ex: Dipirona" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Tipo</label><select value={allergyForm.type} onChange={(e) => setAllergyForm(p => ({ ...p, type: e.target.value as Allergy['type'] }))} className="input-base"><option value="medication">Medicamento</option><option value="food">Alimento</option><option value="environmental">Ambiental</option><option value="other">Outro</option></select></div>
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Gravidade</label><select value={allergyForm.severity} onChange={(e) => setAllergyForm(p => ({ ...p, severity: e.target.value as Allergy['severity'] }))} className="input-base"><option value="mild">Leve</option><option value="moderate">Moderada</option><option value="severe">Grave</option></select></div>
                                </div>
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Reação</label><input type="text" value={allergyForm.reaction} onChange={(e) => setAllergyForm(p => ({ ...p, reaction: e.target.value }))} className="input-base" placeholder="Ex: Urticária" /></div>
                            </div>
                            <div className="flex gap-3 mt-6"><button onClick={() => setShowAllergyModal(false)} className="flex-1 btn-secondary">Cancelar</button><button onClick={handleSaveAllergy} className="flex-1 btn-primary">{editingAllergy ? 'Salvar' : 'Adicionar'}</button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
