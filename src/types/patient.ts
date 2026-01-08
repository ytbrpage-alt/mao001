// src/types/patient.ts
// Types for patient data

export type MaritalStatus = 'married' | 'widowed' | 'divorced' | 'single';

export type Temperament =
    | 'calm'
    | 'communicative'
    | 'reserved'
    | 'anxious'
    | 'irritable'
    | 'depressed'
    | 'unstable';

export type SleepQuality =
    | 'good'
    | 'bathroom'
    | 'insomnia'
    | 'inverted'
    | 'agitation';

export interface PatientData {
    fullName: string;
    preferredName: string;
    birthDate: Date;
    age: number;
    cpf: string;
    phone: string;
    cep: string;
    address: string;
    addressNumber: string;
    addressComplement: string;
    neighborhood: string;
    city: string;
    state: string;
    maritalStatus: MaritalStatus | string;
    previousOccupation: string;
    hobbies: string[];
    otherHobbies: string;
    temperament: Temperament | string;
    preferences: string[];
    otherPreferences: string;
    wakeUpTime: string;
    breakfastTime: string;
    lunchTime: string;
    takesNap: boolean;
    dinnerTime: string;
    bedTime: string;
    sleepQuality: SleepQuality | string;
    nightWakeups: number;
}

export const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] = [
    { value: 'married', label: 'Casado(a)' },
    { value: 'widowed', label: 'Viúvo(a)' },
    { value: 'divorced', label: 'Divorciado(a)' },
    { value: 'single', label: 'Solteiro(a)' },
];

export const TEMPERAMENT_OPTIONS: { value: Temperament; label: string }[] = [
    { value: 'calm', label: 'Calmo e tranquilo' },
    { value: 'communicative', label: 'Comunicativo e sociável' },
    { value: 'reserved', label: 'Reservado e introspectivo' },
    { value: 'anxious', label: 'Ansioso ou preocupado' },
    { value: 'irritable', label: 'Irritável ou impaciente' },
    { value: 'depressed', label: 'Deprimido ou apático' },
    { value: 'unstable', label: 'Varia muito (instável)' },
];
