// src/types/safety.ts
// Types for safety checklist data

export interface RiskItem {
    id: string;
    label: string;
    checked: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendation?: string;
}

export interface RoomSafetyData {
    noGrabBarsShower: boolean;
    slipperyShowerFloor: boolean;
    noShowerSeat: boolean;
    highToilet: boolean;
    lowToilet: boolean;
    poorLighting: boolean;
    looseCarpets: boolean;
    obstacles: boolean;
    stairs: boolean;
    noHandrails: boolean;
    notes: string;
}

export type FamilyPosition = 'will_adapt' | 'wont_adapt' | 'partial' | '';

export interface SafetyChecklistData {
    bedroom: RoomSafetyData;
    bathroom: RoomSafetyData;
    kitchen: RoomSafetyData;
    livingAreas: RoomSafetyData;
    outdoor: RoomSafetyData;
    familyPosition: FamilyPosition;
    riskAcknowledged: boolean;
    adaptationsPending: string[];
    criticalRisks: string[];
    notes: string;
}

export const RISK_SEVERITY_LABELS: Record<RiskItem['severity'], string> = {
    low: 'Baixo',
    medium: 'Médio',
    high: 'Alto',
    critical: 'Crítico',
};

export const FAMILY_POSITION_OPTIONS: { value: FamilyPosition; label: string }[] = [
    { value: 'will_adapt', label: 'Vai fazer as adaptações necessárias' },
    { value: 'wont_adapt', label: 'Não vai fazer adaptações (assume risco)' },
    { value: 'partial', label: 'Vai fazer algumas adaptações' },
];
