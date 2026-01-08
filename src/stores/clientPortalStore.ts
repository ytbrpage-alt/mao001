import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// ========== TYPES ==========

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    route: 'oral' | 'injection' | 'topical' | 'other';
    status: 'active' | 'inactive' | 'expired';
    startDate: Date;
    endDate?: Date;
    prescribedBy: string;
    notes?: string;
    renewalDate?: Date;
}

export interface HealthCondition {
    id: string;
    name: string;
    category: 'chronic' | 'acute' | 'mental' | 'other';
    diagnosisDate?: string;
    severity: 'mild' | 'moderate' | 'severe';
    status: 'active' | 'controlled' | 'resolved';
    notes?: string;
}

export interface Allergy {
    id: string;
    allergen: string;
    type: 'medication' | 'food' | 'environmental' | 'other';
    severity: 'mild' | 'moderate' | 'severe';
    reaction: string;
}

export interface Professional {
    id: string;
    name: string;
    specialty: string;
    role: 'physician' | 'caregiver' | 'nurse' | 'therapist' | 'other';
    phone: string;
    email?: string;
    crm?: string;
    isActive: boolean;
    isPrimary: boolean;
    lastVisit?: Date;
    nextAppointment?: Date;
    notes?: string;
}

export interface Document {
    id: string;
    name: string;
    type: 'contract' | 'prescription' | 'report' | 'exam' | 'other';
    uploadDate: Date;
    expiresAt?: Date;
    status: 'valid' | 'expiring' | 'expired';
    fileUrl: string;
    fileSize: string;
    uploadedBy: string;
}

export interface Invoice {
    id: string;
    description: string;
    amount: number;
    dueDate: Date;
    paidAt?: Date;
    status: 'paid' | 'pending' | 'overdue';
    paymentMethod?: string;
    receiptUrl?: string;
}

export interface EvolutionRecord {
    id: string;
    date: Date;
    type: 'general' | 'medication' | 'procedure' | 'incident';
    title: string;
    description: string;
    professional: string;
    vitals?: {
        pressure?: string;
        heartRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        glucose?: number;
    };
}

export interface Exam {
    id: string;
    name: string;
    type: 'blood' | 'imaging' | 'cardio' | 'neuro' | 'other';
    date: Date;
    status: 'pending' | 'ready' | 'reviewed';
    laboratory?: string;
    doctor?: string;
    fileUrl?: string;
    results?: string;
}

export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
}

export interface PatientDoctor {
    id: string;
    specialty: string;
    name: string;
    crm: string;
    phone?: string;
}

// ========== STORE STATE ==========

interface ClientPortalState {
    // Patient basic info
    patientDoctors: PatientDoctor[];
    emergencyContacts: EmergencyContact[];

    // Health data
    medications: Medication[];
    conditions: HealthCondition[];
    allergies: Allergy[];

    // Evolution & Exams
    evolutionRecords: EvolutionRecord[];
    exams: Exam[];

    // Professionals
    professionals: Professional[];

    // Documents & Financial
    documents: Document[];
    invoices: Invoice[];

    // Clinical scores
    clinicalScores: {
        katz: { score: number; classification: string; description: string };
        abemid: { score: number; classification: string; description: string };
    };

    // ========== ACTIONS ==========

    // Patient Doctors
    addPatientDoctor: (doctor: Omit<PatientDoctor, 'id'>) => void;
    updatePatientDoctor: (id: string, data: Partial<PatientDoctor>) => void;
    deletePatientDoctor: (id: string) => void;

    // Emergency Contacts
    addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
    updateEmergencyContact: (id: string, data: Partial<EmergencyContact>) => void;
    deleteEmergencyContact: (id: string) => void;

    // Medications
    addMedication: (medication: Omit<Medication, 'id'>) => void;
    updateMedication: (id: string, data: Partial<Medication>) => void;
    deleteMedication: (id: string) => void;

    // Health Conditions
    addCondition: (condition: Omit<HealthCondition, 'id'>) => void;
    updateCondition: (id: string, data: Partial<HealthCondition>) => void;
    deleteCondition: (id: string) => void;

    // Allergies
    addAllergy: (allergy: Omit<Allergy, 'id'>) => void;
    updateAllergy: (id: string, data: Partial<Allergy>) => void;
    deleteAllergy: (id: string) => void;

    // Evolution Records
    addEvolutionRecord: (record: Omit<EvolutionRecord, 'id'>) => void;
    updateEvolutionRecord: (id: string, data: Partial<EvolutionRecord>) => void;
    deleteEvolutionRecord: (id: string) => void;

    // Exams
    addExam: (exam: Omit<Exam, 'id'>) => void;
    updateExam: (id: string, data: Partial<Exam>) => void;
    deleteExam: (id: string) => void;

    // Professionals
    addProfessional: (professional: Omit<Professional, 'id'>) => void;
    updateProfessional: (id: string, data: Partial<Professional>) => void;
    deleteProfessional: (id: string) => void;

    // Documents
    addDocument: (doc: Omit<Document, 'id'>) => void;
    updateDocument: (id: string, data: Partial<Document>) => void;
    deleteDocument: (id: string) => void;

    // Invoices
    addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
    updateInvoice: (id: string, data: Partial<Invoice>) => void;
    deleteInvoice: (id: string) => void;

    // Reset
    reset: () => void;
}

// ========== INITIAL DATA ==========

const initialPatientDoctors: PatientDoctor[] = [
    { id: '1', specialty: 'Neurologia', name: 'Dra. Patricia Souza', crm: 'CRM 12345', phone: '(45) 99999-1111' },
    { id: '2', specialty: 'Clínico Geral', name: 'Dr. João Oliveira', crm: 'CRM 54321', phone: '(45) 99999-2222' },
];

const initialEmergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'João da Silva', relationship: 'Filho', phone: '(45) 99999-5678' },
    { id: '2', name: 'Maria da Silva', relationship: 'Filha', phone: '(45) 99999-8765' },
];

const initialMedications: Medication[] = [
    { id: '1', name: 'Donepezila', dosage: '10mg', frequency: '1x ao dia', times: ['08:00'], route: 'oral', status: 'active', startDate: new Date(2025, 10, 1), prescribedBy: 'Dra. Patricia Souza', renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
    { id: '2', name: 'Losartana', dosage: '50mg', frequency: '1x ao dia', times: ['08:00'], route: 'oral', status: 'active', startDate: new Date(2025, 8, 15), prescribedBy: 'Dr. João Oliveira' },
    { id: '3', name: 'Metformina', dosage: '850mg', frequency: '2x ao dia', times: ['08:00', '20:00'], route: 'oral', status: 'active', startDate: new Date(2025, 6, 1), prescribedBy: 'Dr. João Oliveira' },
    { id: '4', name: 'Insulina NPH', dosage: '20 UI', frequency: '1x ao dia', times: ['07:00'], route: 'injection', status: 'active', startDate: new Date(2025, 9, 10), prescribedBy: 'Dr. João Oliveira', notes: 'Aplicar na região abdominal' },
    { id: '5', name: 'Omeprazol', dosage: '20mg', frequency: '1x ao dia', times: ['07:30'], route: 'oral', status: 'active', startDate: new Date(2025, 5, 1), prescribedBy: 'Dr. João Oliveira', notes: 'Tomar em jejum' },
];

const initialConditions: HealthCondition[] = [
    { id: '1', name: 'Alzheimer', category: 'mental', diagnosisDate: '2023', severity: 'moderate', status: 'active', notes: 'Estágio moderado, em acompanhamento com neurologista' },
    { id: '2', name: 'Hipertensão Arterial', category: 'chronic', diagnosisDate: '2015', severity: 'mild', status: 'controlled' },
    { id: '3', name: 'Diabetes Tipo 2', category: 'chronic', diagnosisDate: '2018', severity: 'moderate', status: 'controlled' },
    { id: '4', name: 'Osteoporose', category: 'chronic', diagnosisDate: '2020', severity: 'mild', status: 'active' },
];

const initialAllergies: Allergy[] = [
    { id: '1', allergen: 'Dipirona', type: 'medication', severity: 'severe', reaction: 'Anafilaxia' },
    { id: '2', allergen: 'Frutos do Mar', type: 'food', severity: 'moderate', reaction: 'Urticária e inchaço' },
];

const initialProfessionals: Professional[] = [
    { id: '1', name: 'Dra. Patricia Souza', specialty: 'Neurologia', role: 'physician', phone: '(45) 99999-1111', email: 'patricia@clinica.com', crm: 'CRM 12345 PR', isActive: true, isPrimary: true, lastVisit: new Date(2026, 0, 5), nextAppointment: new Date(2026, 1, 10) },
    { id: '2', name: 'Dr. João Oliveira', specialty: 'Clínico Geral', role: 'physician', phone: '(45) 99999-2222', email: 'joao@clinica.com', crm: 'CRM 54321 PR', isActive: true, isPrimary: false, lastVisit: new Date(2026, 0, 2) },
    { id: '3', name: 'Ana Paula Costa', specialty: 'Cuidadora', role: 'caregiver', phone: '(45) 99999-3333', isActive: true, isPrimary: true, notes: 'Profissional principal do paciente' },
    { id: '4', name: 'Maria Santos', specialty: 'Enfermeira', role: 'nurse', phone: '(45) 99999-4444', isActive: true, isPrimary: false },
    { id: '5', name: 'Dr. Carlos Silva', specialty: 'Fisioterapeuta', role: 'therapist', phone: '(45) 99999-5555', isActive: true, isPrimary: false, nextAppointment: new Date(2026, 0, 10) },
];

const initialDocuments: Document[] = [
    { id: '1', name: 'Contrato de Prestação de Serviços', type: 'contract', uploadDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), status: 'valid', fileUrl: '/docs/contrato.pdf', fileSize: '2.4 MB', uploadedBy: 'Sistema' },
    { id: '2', name: 'Receita - Donepezila 10mg', type: 'prescription', uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), status: 'expiring', fileUrl: '/docs/receita-donepezila.pdf', fileSize: '156 KB', uploadedBy: 'Dra. Patricia Souza' },
    { id: '3', name: 'Laudo Neurológico', type: 'report', uploadDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), status: 'valid', fileUrl: '/docs/laudo-neuro.pdf', fileSize: '1.2 MB', uploadedBy: 'Dra. Patricia Souza' },
    { id: '4', name: 'Hemograma Completo - Janeiro', type: 'exam', uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'valid', fileUrl: '/docs/hemograma.pdf', fileSize: '890 KB', uploadedBy: 'Maria Santos' },
];

const initialInvoices: Invoice[] = [
    { id: '1', description: 'Mensalidade Janeiro/2026', amount: 4850.00, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'pending' },
    { id: '2', description: 'Mensalidade Dezembro/2025', amount: 4850.00, dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), paidAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), status: 'paid', paymentMethod: 'PIX', receiptUrl: '/receipts/dez-2025.pdf' },
    { id: '3', description: 'Taxa Extra - Fisioterapia', amount: 350.00, dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'overdue' },
];

const initialEvolutionRecords: EvolutionRecord[] = [
    { id: '1', date: new Date(2026, 0, 8), type: 'general', title: 'Acompanhamento Diário', description: 'Paciente apresentou boa disposição durante o dia. Alimentação adequada.', professional: 'Ana Paula Costa', vitals: { pressure: '130/85', heartRate: 78, temperature: 36.5, oxygenSaturation: 97 } },
    { id: '2', date: new Date(2026, 0, 7), type: 'medication', title: 'Ajuste de Medicação', description: 'Dose de Losartana ajustada conforme orientação médica.', professional: 'Maria Santos' },
    { id: '3', date: new Date(2026, 0, 5), type: 'procedure', title: 'Curativo Realizado', description: 'Troca de curativo no membro inferior esquerdo. Ferida em cicatrização.', professional: 'Maria Santos' },
];

const initialExams: Exam[] = [
    { id: '1', name: 'Hemograma Completo', type: 'blood', date: new Date(2026, 0, 3), status: 'reviewed', laboratory: 'Lab Vida', doctor: 'Dr. João Oliveira', fileUrl: '/exams/hemograma.pdf' },
    { id: '2', name: 'Ressonância Magnética Crânio', type: 'imaging', date: new Date(2025, 11, 20), status: 'reviewed', laboratory: 'CDI Imagem', doctor: 'Dra. Patricia Souza', fileUrl: '/exams/rm-cranio.pdf' },
    { id: '3', name: 'Eletrocardiograma', type: 'cardio', date: new Date(2026, 0, 10), status: 'pending', laboratory: 'Cardio Center', doctor: 'Dr. Carlos Cardoso' },
];

const initialClinicalScores = {
    katz: { score: 3, classification: 'D', description: 'Dependência moderada' },
    abemid: { score: 8, classification: 'Moderado', description: 'Necessita supervisão' },
};

// ========== STORE ==========

export const useClientPortalStore = create<ClientPortalState>()(
    persist(
        (set) => ({
            // Initial state
            patientDoctors: initialPatientDoctors,
            emergencyContacts: initialEmergencyContacts,
            medications: initialMedications,
            conditions: initialConditions,
            allergies: initialAllergies,
            evolutionRecords: initialEvolutionRecords,
            exams: initialExams,
            professionals: initialProfessionals,
            documents: initialDocuments,
            invoices: initialInvoices,
            clinicalScores: initialClinicalScores,

            // Patient Doctors
            addPatientDoctor: (doctor) => set((state) => ({
                patientDoctors: [...state.patientDoctors, { ...doctor, id: uuidv4() }],
            })),
            updatePatientDoctor: (id, data) => set((state) => ({
                patientDoctors: state.patientDoctors.map((d) => d.id === id ? { ...d, ...data } : d),
            })),
            deletePatientDoctor: (id) => set((state) => ({
                patientDoctors: state.patientDoctors.filter((d) => d.id !== id),
            })),

            // Emergency Contacts
            addEmergencyContact: (contact) => set((state) => ({
                emergencyContacts: [...state.emergencyContacts, { ...contact, id: uuidv4() }],
            })),
            updateEmergencyContact: (id, data) => set((state) => ({
                emergencyContacts: state.emergencyContacts.map((c) => c.id === id ? { ...c, ...data } : c),
            })),
            deleteEmergencyContact: (id) => set((state) => ({
                emergencyContacts: state.emergencyContacts.filter((c) => c.id !== id),
            })),

            // Medications
            addMedication: (medication) => set((state) => ({
                medications: [...state.medications, { ...medication, id: uuidv4() }],
            })),
            updateMedication: (id, data) => set((state) => ({
                medications: state.medications.map((m) => m.id === id ? { ...m, ...data } : m),
            })),
            deleteMedication: (id) => set((state) => ({
                medications: state.medications.filter((m) => m.id !== id),
            })),

            // Health Conditions
            addCondition: (condition) => set((state) => ({
                conditions: [...state.conditions, { ...condition, id: uuidv4() }],
            })),
            updateCondition: (id, data) => set((state) => ({
                conditions: state.conditions.map((c) => c.id === id ? { ...c, ...data } : c),
            })),
            deleteCondition: (id) => set((state) => ({
                conditions: state.conditions.filter((c) => c.id !== id),
            })),

            // Allergies
            addAllergy: (allergy) => set((state) => ({
                allergies: [...state.allergies, { ...allergy, id: uuidv4() }],
            })),
            updateAllergy: (id, data) => set((state) => ({
                allergies: state.allergies.map((a) => a.id === id ? { ...a, ...data } : a),
            })),
            deleteAllergy: (id) => set((state) => ({
                allergies: state.allergies.filter((a) => a.id !== id),
            })),

            // Evolution Records
            addEvolutionRecord: (record) => set((state) => ({
                evolutionRecords: [{ ...record, id: uuidv4() }, ...state.evolutionRecords],
            })),
            updateEvolutionRecord: (id, data) => set((state) => ({
                evolutionRecords: state.evolutionRecords.map((r) => r.id === id ? { ...r, ...data } : r),
            })),
            deleteEvolutionRecord: (id) => set((state) => ({
                evolutionRecords: state.evolutionRecords.filter((r) => r.id !== id),
            })),

            // Exams
            addExam: (exam) => set((state) => ({
                exams: [{ ...exam, id: uuidv4() }, ...state.exams],
            })),
            updateExam: (id, data) => set((state) => ({
                exams: state.exams.map((e) => e.id === id ? { ...e, ...data } : e),
            })),
            deleteExam: (id) => set((state) => ({
                exams: state.exams.filter((e) => e.id !== id),
            })),

            // Professionals
            addProfessional: (professional) => set((state) => ({
                professionals: [...state.professionals, { ...professional, id: uuidv4() }],
            })),
            updateProfessional: (id, data) => set((state) => ({
                professionals: state.professionals.map((p) => p.id === id ? { ...p, ...data } : p),
            })),
            deleteProfessional: (id) => set((state) => ({
                professionals: state.professionals.filter((p) => p.id !== id),
            })),

            // Documents
            addDocument: (doc) => set((state) => ({
                documents: [{ ...doc, id: uuidv4() }, ...state.documents],
            })),
            updateDocument: (id, data) => set((state) => ({
                documents: state.documents.map((d) => d.id === id ? { ...d, ...data } : d),
            })),
            deleteDocument: (id) => set((state) => ({
                documents: state.documents.filter((d) => d.id !== id),
            })),

            // Invoices
            addInvoice: (invoice) => set((state) => ({
                invoices: [{ ...invoice, id: uuidv4() }, ...state.invoices],
            })),
            updateInvoice: (id, data) => set((state) => ({
                invoices: state.invoices.map((i) => i.id === id ? { ...i, ...data } : i),
            })),
            deleteInvoice: (id) => set((state) => ({
                invoices: state.invoices.filter((i) => i.id !== id),
            })),

            // Reset
            reset: () => set({
                patientDoctors: initialPatientDoctors,
                emergencyContacts: initialEmergencyContacts,
                medications: initialMedications,
                conditions: initialConditions,
                allergies: initialAllergies,
                evolutionRecords: initialEvolutionRecords,
                exams: initialExams,
                professionals: initialProfessionals,
                documents: initialDocuments,
                invoices: initialInvoices,
                clinicalScores: initialClinicalScores,
            }),
        }),
        {
            name: 'maos-amigas-client-portal',
            storage: createJSONStorage(() => {
                if (typeof window === 'undefined') {
                    return localStorage;
                }
                return localStorage;
            }),
            onRehydrateStorage: () => {
                return (state, error) => {
                    if (error) {
                        console.error('[ClientPortalStore] Error rehydrating state:', error);
                        try {
                            localStorage.removeItem('maos-amigas-client-portal');
                        } catch (e) {
                            console.error('[ClientPortalStore] Could not clear storage:', e);
                        }
                    } else if (state) {
                        console.log('[ClientPortalStore] State rehydrated successfully', {
                            medications: state.medications.length,
                            professionals: state.professionals.length,
                            documents: state.documents.length,
                        });
                    }
                };
            },
        }
    )
);
