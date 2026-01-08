import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
    Evaluation,
    EvaluationStatus,
    DiscoveryData,
    PatientData,
    HealthHistoryData,
    AbemidData,
    KatzData,
    LawtonData,
    SafetyChecklistData,
    ScheduleData,
    EvaluatorData,
    KYCData,
    EvaluationResults,
    ProposalData,
    ContractData,
} from '@/types';

interface EvaluationState {
    // Estado atual
    currentEvaluationId: string | null;
    currentStep: number;
    totalSteps: number;

    // Lista de avaliações
    evaluations: Record<string, Evaluation>;

    // Ações de navegação
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;

    // Ações de avaliação
    createEvaluation: (evaluatorId: string) => string;
    loadEvaluation: (id: string) => void;
    updateEvaluation: (id: string, data: Partial<Evaluation>) => void;
    deleteEvaluation: (id: string) => void;

    // Ações de cada seção
    updateDiscovery: (data: Partial<DiscoveryData>) => void;
    updatePatient: (data: Partial<PatientData>) => void;
    updateHealthHistory: (data: Partial<HealthHistoryData>) => void;
    updateAbemid: (data: Partial<AbemidData>) => void;
    updateKatz: (data: Partial<KatzData>) => void;
    updateLawton: (data: Partial<LawtonData>) => void;
    updateSafetyChecklist: (data: Partial<SafetyChecklistData>) => void;
    updateSchedule: (data: Partial<ScheduleData>) => void;
    updateEvaluatorInfo: (data: Partial<EvaluatorData>) => void;
    updateKYC: (data: Partial<KYCData>) => void;

    // Ações de resultado
    calculateResults: () => void;
    updateResults: (data: Partial<EvaluationResults>) => void;

    // Getters
    getCurrentEvaluation: () => Evaluation | null;
    getEvaluationById: (id: string) => Evaluation | null;
    getAllEvaluations: () => Evaluation[];

    // Reset
    reset: () => void;
}

const TOTAL_STEPS = 10; // Discovery, Patient, History, ABEMID, KATZ, Lawton, Safety, Schedule, Evaluator, KYC

const initialDiscovery: DiscoveryData = {
    triggerEvent: '',
    triggerCategory: '',
    triggerDetails: '',
    urgencyLevel: '',
    referralSource: '',
    initialExpectations: '',
    familyDecisionMaker: '',
    budgetRange: '',
    currentCaregiver: '',
    familyBurdenLevel: 5,
    concerns: [],
    mainConcern: '',
    previousExperience: '',
    previousIssues: [],
    previousIssueDetails: '',
    notes: '',
};

const initialPatient: PatientData = {
    fullName: '',
    preferredName: '',
    birthDate: new Date(),
    age: 0,
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    addressNumber: '',
    addressComplement: '',
    neighborhood: '',
    city: '',
    state: '',
    maritalStatus: 'single',
    previousOccupation: '',
    hobbies: [],
    otherHobbies: '',
    temperament: 'calm',
    preferences: [],
    otherPreferences: '',
    wakeUpTime: '07:00',
    breakfastTime: '08:00',
    lunchTime: '12:00',
    takesNap: false,
    dinnerTime: '19:00',
    bedTime: '21:00',
    sleepQuality: 'good',
    nightWakeups: 0,
};

const initialHealthHistory: HealthHistoryData = {
    neurologicalConditions: [],
    cardiovascularConditions: [],
    respiratoryConditions: [],
    mobilityConditions: [],
    otherConditions: [],
    recentHospitalizations: false,
    recentFalls: 'none',
    recentSurgery: false,
    medicationCount: '1-3',
    specialMedications: [],
    hasAllergies: false,
    medicationAllergies: '',
    foodAllergies: '',
    latexAllergy: false,
    otherAllergies: '',
    dietaryRestrictions: [],
    otherDietaryRestrictions: '',
};

const initialAbemid: AbemidData = {
    consciousness: 0,
    breathing: 0,
    feeding: 0,
    mobility: 0,
    skinCare: 0,
    skin: 0,
    procedures: 0,
    medications: 0,
    medication: 0,
    monitoring: 0,
    elimination: 0,
    activeTriggers: [],
    notes: '',
};

const initialKatz: KatzData = {
    bathing: 1,
    bathingDetails: [],
    dressing: 1,
    dressingDetails: [],
    toileting: 1,
    toiletingDetails: [],
    transferring: 1,
    transferringDetails: [],
    mobilityAids: [],
    continence: 1,
    continenceDetails: [],
    feeding: 1,
    feedingDetails: [],
    totalScore: 6,
    classification: 'A',
    complexityMultiplier: 1,
};

const initialLawton: LawtonData = {
    medicationManagement: 'capable',
    medicationSeparation: 'family_separates',
    medicationAdministration: 'self_administered',
    supplyProvision: 'family',
    supplyList: [],
    mealPreparation: 'family_prepares',
    hasSpecialDiet: false,
    houseworkScope: false,
    clausesToGenerate: [],
};

const initialSafetyChecklist: SafetyChecklistData = {
    circulation: {
        looseRugs: false,
        exposedWires: false,
        obstructedPaths: false,
        slipperyFloors: false,
        poorLighting: false,
    },
    bathroom: {
        noGrabBarsShower: false,
        noGrabBarsToilet: false,
        slipperyShowerFloor: false,
        lowToilet: false,
        noNonSlipMat: false,
        noShowerChair: false,
    },
    bedroom: {
        bedTooLow: false,
        bedTooHigh: false,
        noSideAccess: false,
        noNightLight: false,
        inadequateMattress: false,
    },
    hasStairs: false,
    totalRisks: 0,
    criticalRisks: 0,
    riskList: [],
    familyPosition: 'will_adapt_all',
    adaptationsCommitted: [],
    photos: [],
};

const initialSchedule: ScheduleData = {
    startTime: '07:00',
    endTime: '19:00',
    totalHoursPerDay: 12,
    shiftType: 'day',
    weekDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    shiftsPerMonth: 20,
    startDate: new Date(),
    contractType: 'indefinite',
};

const initialResults: EvaluationResults = {
    abemidScore: 0,
    abemidTriggers: [],
    indicatedProfessional: 'caregiver',
    professionalJustification: '',
    katzScore: 6,
    katzClassification: 'A',
    complexityMultiplier: 1,
    complexityJustification: '',
    totalRisks: 0,
    criticalRisks: 0,
    riskAssumptionRequired: false,
    pricing: {
        baseHourlyRate: 0,
        complexityMultiplier: 1,
        nightShiftMultiplier: 1,
        weekendMultiplier: 1,
        dailyCost: 0,
        monthlyCost: 0,
        taxes: 0,
        totalMonthly: 0,
    },
    requiredClauses: [],
    urgencyLevel: 'low',
    urgencyFactors: [],
    recommendations: [],
    upsellOpportunities: [],
};

const initialEvaluatorInfo: EvaluatorData = {
    evaluatorId: '',
    evaluatorName: '',
    evaluatorRole: '',
    evaluatorEmail: '',
    evaluatorPhone: '',
    branchOffice: '',
    evaluationStartTime: new Date(),
    evaluationLocation: '',
    evaluationNotes: '',
};

const initialKYC: KYCData = {
    documentType: 'rg',
    documentNumber: '',
    documentIssuer: '',
    documentFrontPhoto: '',
    documentBackPhoto: '',
    verificationStatus: 'pending',
    verificationNotes: '',
    consentGiven: false,
};

export const useEvaluationStore = create<EvaluationState>()(
    persist(
        (set, get) => ({
            currentEvaluationId: null,
            currentStep: 0,
            totalSteps: TOTAL_STEPS,
            evaluations: {},

            // Navegação
            setCurrentStep: (step) => set({ currentStep: step }),

            nextStep: () => {
                const { currentStep, totalSteps } = get();
                if (currentStep < totalSteps - 1) {
                    set({ currentStep: currentStep + 1 });
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                if (currentStep > 0) {
                    set({ currentStep: currentStep - 1 });
                }
            },

            goToStep: (step) => {
                const { totalSteps } = get();
                if (step >= 0 && step < totalSteps) {
                    set({ currentStep: step });
                }
            },

            // Criar avaliação
            createEvaluation: (evaluatorId) => {
                const id = uuidv4();
                const now = new Date();

                const newEvaluation: Evaluation = {
                    id,
                    status: 'draft',
                    createdAt: now,
                    updatedAt: now,
                    evaluatorId,
                    discovery: initialDiscovery,
                    patient: initialPatient,
                    healthHistory: initialHealthHistory,
                    abemid: initialAbemid,
                    katz: initialKatz,
                    lawton: initialLawton,
                    safetyChecklist: initialSafetyChecklist,
                    schedule: initialSchedule,
                    evaluatorInfo: initialEvaluatorInfo,
                    kyc: initialKYC,
                    results: initialResults,
                    proposal: {} as ProposalData,
                    contract: {} as ContractData,
                };

                set((state) => ({
                    evaluations: { ...state.evaluations, [id]: newEvaluation },
                    currentEvaluationId: id,
                    currentStep: 0,
                }));

                return id;
            },

            // Carregar avaliação
            loadEvaluation: (id) => {
                const evaluation = get().evaluations[id];
                if (evaluation) {
                    set({ currentEvaluationId: id, currentStep: 0 });
                }
            },

            // Atualizar avaliação
            updateEvaluation: (id, data) => {
                set((state) => {
                    const evaluation = state.evaluations[id];
                    if (!evaluation) return state;

                    return {
                        evaluations: {
                            ...state.evaluations,
                            [id]: {
                                ...evaluation,
                                ...data,
                                updatedAt: new Date(),
                            },
                        },
                    };
                });
            },

            // Deletar avaliação
            deleteEvaluation: (id) => {
                set((state) => {
                    const { [id]: deleted, ...rest } = state.evaluations;
                    return {
                        evaluations: rest,
                        currentEvaluationId: state.currentEvaluationId === id ? null : state.currentEvaluationId,
                    };
                });
            },

            // Atualizar seções específicas
            updateDiscovery: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            discovery: { ...evaluation.discovery, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updatePatient: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                // Auto-calculate age when birthDate changes
                let updatedData = { ...data };
                if (data.birthDate) {
                    const birthDate = data.birthDate instanceof Date
                        ? data.birthDate
                        : new Date(data.birthDate);

                    if (!isNaN(birthDate.getTime())) {
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        // Validate age is in valid range
                        if (age >= 0 && age <= 120) {
                            updatedData = { ...updatedData, age, birthDate };
                        }
                    }
                }

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            patient: { ...evaluation.patient, ...updatedData },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateHealthHistory: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            healthHistory: { ...evaluation.healthHistory, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateAbemid: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            abemid: { ...evaluation.abemid, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateKatz: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            katz: { ...evaluation.katz, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateLawton: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            lawton: { ...evaluation.lawton, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateSafetyChecklist: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            safetyChecklist: { ...evaluation.safetyChecklist, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateSchedule: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            schedule: { ...evaluation.schedule, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateEvaluatorInfo: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            evaluatorInfo: { ...evaluation.evaluatorInfo, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            updateKYC: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            kyc: { ...evaluation.kyc, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            // Calcular resultados
            calculateResults: () => {
                // Implementado no Prompt 6
            },

            updateResults: (data) => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return;

                const evaluation = evaluations[currentEvaluationId];
                if (!evaluation) return;

                set((state) => ({
                    evaluations: {
                        ...state.evaluations,
                        [currentEvaluationId]: {
                            ...evaluation,
                            results: { ...evaluation.results, ...data },
                            updatedAt: new Date(),
                        },
                    },
                }));
            },

            // Getters
            getCurrentEvaluation: () => {
                const { currentEvaluationId, evaluations } = get();
                if (!currentEvaluationId) return null;
                return evaluations[currentEvaluationId] || null;
            },

            getEvaluationById: (id) => {
                return get().evaluations[id] || null;
            },

            getAllEvaluations: () => {
                return Object.values(get().evaluations);
            },

            // Reset
            reset: () => {
                set({
                    currentEvaluationId: null,
                    currentStep: 0,
                    evaluations: {},
                });
            },
        }),
        {
            name: 'maos-amigas-evaluations',
            // Use secure encrypted storage in production
            // Falls back to localStorage in development for easier debugging
            storage: createJSONStorage(() => {
                // Check if we're in a browser environment
                if (typeof window === 'undefined') {
                    return localStorage;
                }

                // In production, we would use createSecureStorage()
                // For now, use localStorage with a warning
                if (process.env.NODE_ENV === 'production') {
                    console.warn(
                        '[EvaluationStore] Using localStorage in production. ' +
                        'Configure IndexedDB encryption for sensitive data.'
                    );
                }

                return localStorage;
            }),
            partialize: (state) => ({
                evaluations: state.evaluations,
                currentStep: state.currentStep,
                currentEvaluationId: state.currentEvaluationId,
            }),
            // Rehydration handling with error recovery
            onRehydrateStorage: () => {
                return (state, error) => {
                    if (error) {
                        console.error('[EvaluationStore] Error rehydrating state:', error);
                        // Clear corrupted storage
                        try {
                            localStorage.removeItem('maos-amigas-evaluations');
                        } catch (e) {
                            console.error('[EvaluationStore] Could not clear storage:', e);
                        }
                    } else if (state) {
                        console.log('[EvaluationStore] State rehydrated successfully', {
                            currentStep: state.currentStep,
                            currentEvaluationId: state.currentEvaluationId,
                            evaluationCount: Object.keys(state.evaluations).length,
                        });
                    }
                };
            },
        }
    )
);
