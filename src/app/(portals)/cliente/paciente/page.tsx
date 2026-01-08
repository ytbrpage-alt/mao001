'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, Pill, FileText, Activity, Phone, MapPin, Calendar, Brain, Stethoscope, AlertCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useClientPortalStore, type PatientDoctor, type EmergencyContact } from '@/stores/clientPortalStore';

// Mock do paciente (este seria vindo de outro store ou API)
const patient = {
    id: '1',
    fullName: 'Maria da Silva Santos',
    preferredName: 'Dona Maria',
    birthDate: new Date(1946, 5, 15),
    gender: 'female',
    cpf: '123.456.789-00',
    phone: '(45) 99999-1234',
    address: { street: 'Rua das Flores', number: '123', complement: 'Apto 201', neighborhood: 'Centro', city: 'Toledo', state: 'PR', zipCode: '85900-000' },
    careStartDate: new Date(2025, 10, 23),
    careStatus: 'active',
    primaryDiagnosis: 'Alzheimer',
    indicatedProfessional: 'caregiver',
};

const healthSections = [
    { href: '/cliente/paciente/saude', icon: Heart, label: 'Saúde Geral', description: 'Condições, diagnósticos e histórico', color: 'red' },
    { href: '/cliente/paciente/medicamentos', icon: Pill, label: 'Medicamentos', description: '12 medicamentos ativos', color: 'purple', badge: 12 },
    { href: '/cliente/paciente/evolucao', icon: Activity, label: 'Evolução', description: 'Acompanhamento e registros', color: 'blue' },
    { href: '/cliente/paciente/exames', icon: FileText, label: 'Exames', description: 'Resultados e laudos', color: 'green' },
];

const DoctorIcon = ({ specialty }: { specialty: string }) => {
    if (specialty.toLowerCase().includes('neuro')) return Brain;
    return Stethoscope;
};

export default function PatientPage() {
    const { patientDoctors, emergencyContacts, addPatientDoctor, updatePatientDoctor, deletePatientDoctor, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useClientPortalStore();

    const age = differenceInYears(new Date(), patient.birthDate);
    const daysUnderCare = Math.floor((new Date().getTime() - patient.careStartDate.getTime()) / (1000 * 60 * 60 * 24));

    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<PatientDoctor | null>(null);
    const [doctorForm, setDoctorForm] = useState({ specialty: '', name: '', crm: '', phone: '' });

    const [showContactModal, setShowContactModal] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
    const [contactForm, setContactForm] = useState({ name: '', relationship: '', phone: '' });

    const handleEditDoctor = (doc: PatientDoctor) => {
        setEditingDoctor(doc);
        setDoctorForm({ specialty: doc.specialty, name: doc.name, crm: doc.crm, phone: doc.phone || '' });
        setShowDoctorModal(true);
    };

    const handleSaveDoctor = () => {
        if (editingDoctor) {
            updatePatientDoctor(editingDoctor.id, { ...doctorForm, phone: doctorForm.phone || undefined });
        } else {
            addPatientDoctor({ ...doctorForm, phone: doctorForm.phone || undefined });
        }
        setShowDoctorModal(false);
        setEditingDoctor(null);
        setDoctorForm({ specialty: '', name: '', crm: '', phone: '' });
    };

    const handleEditContact = (c: EmergencyContact) => {
        setEditingContact(c);
        setContactForm({ name: c.name, relationship: c.relationship, phone: c.phone });
        setShowContactModal(true);
    };

    const handleSaveContact = () => {
        if (editingContact) {
            updateEmergencyContact(editingContact.id, contactForm);
        } else {
            addEmergencyContact(contactForm);
        }
        setShowContactModal(false);
        setEditingContact(null);
        setContactForm({ name: '', relationship: '', phone: '' });
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header do Paciente */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 text-2xl font-bold flex-shrink-0">{patient.preferredName.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold truncate" style={{ color: 'rgb(var(--color-text))' }}>{patient.fullName}</h1>
                        <p style={{ color: 'rgb(var(--color-text-secondary))' }}>&quot;{patient.preferredName}&quot; • {age} anos</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="badge-info">{patient.indicatedProfessional === 'caregiver' ? 'Cuidador' : 'Enfermeiro'}</span>
                            <span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{daysUnderCare} dias de cuidado</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2" style={{ color: 'rgb(var(--color-text-secondary))' }}><Calendar className="w-4 h-4 text-neutral-400" /><span>{format(patient.birthDate, 'dd/MM/yyyy')}</span></div>
                    <div className="flex items-center gap-2" style={{ color: 'rgb(var(--color-text-secondary))' }}><Phone className="w-4 h-4 text-neutral-400" /><span>{patient.phone}</span></div>
                    <div className="col-span-2 flex items-start gap-2" style={{ color: 'rgb(var(--color-text-secondary))' }}><MapPin className="w-4 h-4 text-neutral-400 mt-0.5" /><span>{patient.address.street}, {patient.address.number}{patient.address.complement && ` - ${patient.address.complement}`}<br />{patient.address.neighborhood}, {patient.address.city}/{patient.address.state}</span></div>
                </div>
            </motion.div>

            {/* Diagnóstico Principal */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-amber-600" /></div><div><p className="text-sm text-amber-600 font-medium">Diagnóstico Principal</p><p className="text-lg font-semibold text-amber-800 dark:text-amber-400">{patient.primaryDiagnosis}</p></div></div>
            </motion.div>

            {/* Seções de Saúde */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-semibold mb-3" style={{ color: 'rgb(var(--color-text))' }}>Informações de Saúde</h2>
                <div className="grid grid-cols-2 gap-3">{healthSections.map((section) => (
                    <Link key={section.href} href={section.href}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="card p-4 h-full">
                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', section.color === 'red' && 'bg-red-100 dark:bg-red-900/30', section.color === 'purple' && 'bg-purple-100 dark:bg-purple-900/30', section.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30', section.color === 'green' && 'bg-green-100 dark:bg-green-900/30')}>
                                <section.icon className={cn('w-5 h-5', section.color === 'red' && 'text-red-500', section.color === 'purple' && 'text-purple-500', section.color === 'blue' && 'text-blue-500', section.color === 'green' && 'text-green-500')} />
                            </div>
                            <p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{section.label}</p>
                            <p className="text-sm mt-0.5" style={{ color: 'rgb(var(--color-text-secondary))' }}>{section.description}</p>
                        </motion.div>
                    </Link>
                ))}</div>
            </motion.div>

            {/* Médicos Responsáveis */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Médicos Responsáveis</h2>
                    <button onClick={() => { setEditingDoctor(null); setDoctorForm({ specialty: '', name: '', crm: '', phone: '' }); setShowDoctorModal(true); }} className="text-sm text-brand-600 flex items-center gap-1"><Plus className="w-4 h-4" />Adicionar</button>
                </div>
                <div className="space-y-3">{patientDoctors.map((doc) => {
                    const IconComponent = DoctorIcon({ specialty: doc.specialty });
                    return (
                        <div key={doc.id} className="card flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center"><IconComponent className="w-6 h-6 text-brand-500" /></div>
                            <div className="flex-1"><p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{doc.specialty}</p><p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{doc.name}</p><p className="text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>{doc.crm}</p></div>
                            <div className="flex items-center gap-1">
                                {doc.phone && <a href={`tel:${doc.phone}`} className="p-2 bg-success-50 dark:bg-success-900/20 text-success-600 rounded-lg"><Phone className="w-4 h-4" /></a>}
                                <button onClick={() => handleEditDoctor(doc)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><Edit2 className="w-4 h-4" style={{ color: 'rgb(var(--color-text-secondary))' }} /></button>
                                <button onClick={() => deletePatientDoctor(doc.id)} className="p-2 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg"><Trash2 className="w-4 h-4 text-error-500" /></button>
                            </div>
                        </div>
                    );
                })}</div>
            </motion.div>

            {/* Contatos de Emergência */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Contatos de Emergência</h2>
                    <button onClick={() => { setEditingContact(null); setContactForm({ name: '', relationship: '', phone: '' }); setShowContactModal(true); }} className="text-sm text-brand-600 flex items-center gap-1"><Plus className="w-4 h-4" />Adicionar</button>
                </div>
                <div className="space-y-3">{emergencyContacts.map((contact) => (
                    <div key={contact.id} className="card">
                        <div className="flex items-center justify-between">
                            <div><p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{contact.name}</p><p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{contact.relationship} • {contact.phone}</p></div>
                            <div className="flex items-center gap-1">
                                <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="p-2 bg-success-50 dark:bg-success-900/20 text-success-600 rounded-lg"><Phone className="w-5 h-5" /></a>
                                <button onClick={() => handleEditContact(contact)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><Edit2 className="w-4 h-4" style={{ color: 'rgb(var(--color-text-secondary))' }} /></button>
                                <button onClick={() => deleteEmergencyContact(contact.id)} className="p-2 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg"><Trash2 className="w-4 h-4 text-error-500" /></button>
                            </div>
                        </div>
                    </div>
                ))}</div>
            </motion.div>

            {/* Doctor Modal */}
            <AnimatePresence>
                {showDoctorModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowDoctorModal(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>{editingDoctor ? 'Editar Médico' : 'Novo Médico'}</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Especialidade</label><input type="text" value={doctorForm.specialty} onChange={(e) => setDoctorForm(p => ({ ...p, specialty: e.target.value }))} className="input-base" placeholder="Ex: Neurologia" /></div>
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Nome do Médico</label><input type="text" value={doctorForm.name} onChange={(e) => setDoctorForm(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="Ex: Dra. Patricia Souza" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>CRM</label><input type="text" value={doctorForm.crm} onChange={(e) => setDoctorForm(p => ({ ...p, crm: e.target.value }))} className="input-base" placeholder="Ex: CRM 12345" /></div>
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Telefone</label><input type="tel" value={doctorForm.phone} onChange={(e) => setDoctorForm(p => ({ ...p, phone: e.target.value }))} className="input-base" placeholder="(45) 99999-0000" /></div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6"><button onClick={() => setShowDoctorModal(false)} className="flex-1 btn-secondary">Cancelar</button><button onClick={handleSaveDoctor} className="flex-1 btn-primary">Salvar</button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowContactModal(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>{editingContact ? 'Editar Contato' : 'Novo Contato'}</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Nome</label><input type="text" value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="Ex: João da Silva" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Parentesco</label><input type="text" value={contactForm.relationship} onChange={(e) => setContactForm(p => ({ ...p, relationship: e.target.value }))} className="input-base" placeholder="Ex: Filho" /></div>
                                    <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Telefone</label><input type="tel" value={contactForm.phone} onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value }))} className="input-base" placeholder="(45) 99999-0000" /></div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6"><button onClick={() => setShowContactModal(false)} className="flex-1 btn-secondary">Cancelar</button><button onClick={handleSaveContact} className="flex-1 btn-primary">Salvar</button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
