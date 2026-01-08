'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Phone, Edit2, Star, Calendar, ChevronRight, UserPlus, Stethoscope, Heart, Brain, Activity, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useClientPortalStore, type Professional } from '@/stores/clientPortalStore';

const getRoleConfig = (role: Professional['role']) => {
    switch (role) {
        case 'physician': return { label: 'Médico', icon: Stethoscope, color: 'text-brand-600', bg: 'bg-brand-100 dark:bg-brand-900/30' };
        case 'caregiver': return { label: 'Cuidador', icon: Heart, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        case 'nurse': return { label: 'Enfermeiro', icon: Activity, color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        case 'therapist': return { label: 'Terapeuta', icon: Brain, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
        default: return { label: 'Outro', icon: Users, color: 'text-neutral-600', bg: 'bg-neutral-100 dark:bg-neutral-800' };
    }
};

export default function ClientProfessionalsPage() {
    const { professionals, addProfessional, updateProfessional, deleteProfessional } = useClientPortalStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'physician' | 'caregiver' | 'nurse' | 'therapist'>('all');
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [formData, setFormData] = useState({ name: '', specialty: '', role: 'physician' as Professional['role'], phone: '', email: '', crm: '', notes: '', isPrimary: false });

    const filteredProfessionals = professionals.filter(prof => {
        const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) || prof.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || prof.role === filter;
        return matchesSearch && matchesFilter;
    });

    const primaryProfessionals = professionals.filter(p => p.isPrimary);

    const handleEdit = (prof: Professional) => {
        setFormData({ name: prof.name, specialty: prof.specialty, role: prof.role, phone: prof.phone, email: prof.email || '', crm: prof.crm || '', notes: prof.notes || '', isPrimary: prof.isPrimary });
        setSelectedProfessional(prof);
        setShowEditModal(true);
    };

    const handleSave = () => {
        if (showEditModal && selectedProfessional) {
            updateProfessional(selectedProfessional.id, { ...formData, email: formData.email || undefined, crm: formData.crm || undefined, notes: formData.notes || undefined });
        } else {
            addProfessional({ ...formData, isActive: true, email: formData.email || undefined, crm: formData.crm || undefined, notes: formData.notes || undefined });
        }
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedProfessional(null);
        setFormData({ name: '', specialty: '', role: 'physician', phone: '', email: '', crm: '', notes: '', isPrimary: false });
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div><h1 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Profissionais</h1><p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Equipe de cuidado do paciente</p></div>
                <button onClick={() => { setFormData({ name: '', specialty: '', role: 'physician', phone: '', email: '', crm: '', notes: '', isPrimary: false }); setShowAddModal(true); }} className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"><UserPlus className="w-5 h-5" /></button>
            </div>

            {/* Primary Professionals */}
            {primaryProfessionals.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <h2 className="text-sm font-medium flex items-center gap-2" style={{ color: 'rgb(var(--color-text-secondary))' }}><Star className="w-4 h-4 text-warning-500" />Profissionais Principais</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">{primaryProfessionals.map((prof) => {
                        const roleConfig = getRoleConfig(prof.role);
                        const RoleIcon = roleConfig.icon;
                        return (
                            <div key={prof.id} onClick={() => setSelectedProfessional(prof)} className="card min-w-[200px] cursor-pointer hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', roleConfig.bg)}><RoleIcon className={cn('w-6 h-6', roleConfig.color)} /></div>
                                    <div><p className="font-medium text-sm" style={{ color: 'rgb(var(--color-text))' }}>{prof.name}</p><p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>{prof.specialty}</p></div>
                                </div>
                            </div>
                        );
                    })}</div>
                </motion.div>
            )}

            {/* Search & Filter */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar profissionais..." className="input-base pl-10" /></div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">{(['all', 'physician', 'caregiver', 'nurse', 'therapist'] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors', filter === f ? 'bg-brand-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800')} style={{ color: filter === f ? undefined : 'rgb(var(--color-text-secondary))' }}>
                        {f === 'all' ? 'Todos' : f === 'physician' ? 'Médicos' : f === 'caregiver' ? 'Cuidadores' : f === 'nurse' ? 'Enfermeiros' : 'Terapeutas'}
                    </button>
                ))}</div>
            </motion.div>

            {/* Professionals List */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="space-y-3">
                {filteredProfessionals.length === 0 ? (
                    <div className="card text-center py-12"><Users className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" /><p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhum profissional encontrado</p></div>
                ) : (
                    filteredProfessionals.map((prof, index) => {
                        const roleConfig = getRoleConfig(prof.role);
                        const RoleIcon = roleConfig.icon;
                        return (
                            <motion.div key={prof.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedProfessional(prof)} className="card cursor-pointer hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', roleConfig.bg)}><RoleIcon className={cn('w-6 h-6', roleConfig.color)} /></div>
                                        <div>
                                            <div className="flex items-center gap-2"><h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{prof.name}</h3>{prof.isPrimary && <Star className="w-4 h-4 text-warning-500 fill-warning-500" />}</div>
                                            <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{prof.specialty}</p>
                                            {prof.crm && <p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>{prof.crm}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={`tel:${prof.phone}`} onClick={(e) => e.stopPropagation()} className="p-2 bg-success-50 dark:bg-success-900/20 text-success-600 rounded-lg hover:bg-success-100"><Phone className="w-5 h-5" /></a>
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(prof); }} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><Edit2 className="w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteProfessional(prof.id); }} className="p-2 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg"><Trash2 className="w-5 h-5 text-error-500" /></button>
                                    </div>
                                </div>
                                {prof.nextAppointment && (
                                    <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700 flex items-center gap-2 text-xs">
                                        <Calendar className="w-3 h-3" style={{ color: 'rgb(var(--color-text-secondary))' }} />
                                        <span style={{ color: 'rgb(var(--color-text-secondary))' }}>Próxima consulta: {new Date(prof.nextAppointment).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedProfessional && !showEditModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedProfessional(null)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            {(() => {
                                const roleConfig = getRoleConfig(selectedProfessional.role);
                                const RoleIcon = roleConfig.icon;
                                return (
                                    <>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', roleConfig.bg)}><RoleIcon className={cn('w-8 h-8', roleConfig.color)} /></div>
                                            <div>
                                                <div className="flex items-center gap-2"><h2 className="text-lg font-semibold" style={{ color: 'rgb(var(--color-text))' }}>{selectedProfessional.name}</h2>{selectedProfessional.isPrimary && <Star className="w-5 h-5 text-warning-500 fill-warning-500" />}</div>
                                                <p style={{ color: 'rgb(var(--color-text-secondary))' }}>{selectedProfessional.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mb-4">
                                            {selectedProfessional.crm && <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Registro</span><span style={{ color: 'rgb(var(--color-text))' }}>{selectedProfessional.crm}</span></div>}
                                            <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Telefone</span><a href={`tel:${selectedProfessional.phone}`} className="text-brand-600">{selectedProfessional.phone}</a></div>
                                            {selectedProfessional.email && <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>E-mail</span><a href={`mailto:${selectedProfessional.email}`} className="text-brand-600">{selectedProfessional.email}</a></div>}
                                        </div>
                                        {selectedProfessional.notes && <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-4"><p className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Observações</p><p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{selectedProfessional.notes}</p></div>}
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEdit(selectedProfessional)} className="flex-1 btn-secondary flex items-center justify-center gap-2"><Edit2 className="w-5 h-5" />Editar</button>
                                            <a href={`tel:${selectedProfessional.phone}`} className="flex-1 btn-primary flex items-center justify-center gap-2"><Phone className="w-5 h-5" />Ligar</a>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {(showAddModal || showEditModal) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedProfessional(null); }}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>{showEditModal ? 'Editar Profissional' : 'Novo Profissional'}</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Nome Completo</label><input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="Ex: Dr. João Oliveira" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Tipo</label><select value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value as Professional['role'] }))} className="input-base"><option value="physician">Médico</option><option value="caregiver">Cuidador</option><option value="nurse">Enfermeiro</option><option value="therapist">Terapeuta</option><option value="other">Outro</option></select></div>
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Especialidade</label><input type="text" value={formData.specialty} onChange={(e) => setFormData(p => ({ ...p, specialty: e.target.value }))} className="input-base" placeholder="Ex: Neurologia" /></div>
                                </div>
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>CRM / Registro</label><input type="text" value={formData.crm} onChange={(e) => setFormData(p => ({ ...p, crm: e.target.value }))} className="input-base" placeholder="Ex: CRM 12345 PR" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Telefone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} className="input-base" placeholder="(45) 99999-0000" /></div>
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>E-mail</label><input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="input-base" placeholder="email@exemplo.com" /></div>
                                </div>
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Observações</label><textarea value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} className="input-base min-h-[80px]" placeholder="Informações adicionais..." /></div>
                                <label className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl cursor-pointer"><input type="checkbox" checked={formData.isPrimary} onChange={(e) => setFormData(p => ({ ...p, isPrimary: e.target.checked }))} className="w-5 h-5 rounded text-brand-500" /><div><p className="font-medium text-sm" style={{ color: 'rgb(var(--color-text))' }}>Profissional Principal</p><p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>Marcar como responsável principal pelo paciente</p></div></label>
                            </div>
                            <div className="flex gap-3 mt-6"><button onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedProfessional(null); }} className="flex-1 btn-secondary">Cancelar</button><button onClick={handleSave} className="flex-1 btn-primary">{showEditModal ? 'Salvar' : 'Adicionar'}</button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
