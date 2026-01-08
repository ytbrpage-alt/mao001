// src/types/index.ts
// Central export for all types

// Discovery types
export type {
    TriggerCategory,
    DiscoveryData,
} from './discovery';
export { TRIGGER_CATEGORIES } from './discovery';

// Patient types
export type {
    MaritalStatus,
    Temperament,
    SleepQuality,
    PatientData,
} from './patient';
export { MARITAL_STATUS_OPTIONS, TEMPERAMENT_OPTIONS } from './patient';

// Health types
export type {
    NeurologicalCondition,
    CardiovascularCondition,
    RespiratoryCondition,
    MobilityCondition,
    SpecialMedication,
    DietaryRestriction,
    HealthHistoryData,
} from './health';
export { NEUROLOGICAL_CONDITIONS, CARDIOVASCULAR_CONDITIONS } from './health';

// Scales types
export type {
    AbemidData,
    KatzData,
    LawtonData,
    AbemidResult,
    KatzResult,
    LawtonResult,
} from './scales';

// Safety types
export type {
    RiskItem,
    RoomSafetyData,
    FamilyPosition,
    SafetyChecklistData,
} from './safety';
export { RISK_SEVERITY_LABELS, FAMILY_POSITION_OPTIONS } from './safety';

// Schedule types
export type {
    ShiftType,
    WeekDay,
    ScheduleData,
} from './schedule';
export { WEEKDAYS, SHIFT_TYPE_OPTIONS } from './schedule';

// Pricing types
export type {
    PriceBreakdown,
    PricingAdjustment,
    PricingData,
    FrequencyOption,
} from './pricing';
export { PROFESSIONAL_RATES } from './pricing';

// Proposal types
export type {
    ProposalData,
} from './proposal';
export { PROPOSAL_STATUS_LABELS } from './proposal';

// Contract types
export type {
    ClauseType,
    ContractClause,
    ContractData,
} from './contract';
export { CLAUSE_TYPES, CONTRACT_STATUS_LABELS } from './contract';

// Evaluation types
export type {
    EvaluationStatus,
    EvaluatorData,
    KYCDocumentType,
    KYCVerificationStatus,
    KYCData,
    EvaluationResults,
    Evaluation,
} from './evaluation';
export { EVALUATION_STATUS_LABELS } from './evaluation';

// UI types
export type {
    BaseInputProps,
    ButtonVariant,
    ButtonSize,
    ButtonProps,
    CardProps,
    ModalProps,
    ToastType,
    ToastProps,
    StepLayoutProps,
    QuestionCardProps,
    SelectOption,
    RadioGroupProps,
    CheckboxProps,
    BadgeVariant,
    BadgeProps,
} from './ui';

// Auth types
export type {
    UserRole,
    UserStatus,
    User,
    UserPreferences,
    UserStats,
    AuthSession,
    LoginAttempt,
    AccountLock,
    CreateUserData,
    UpdateUserData,
    AuthResult,
    AuthError,
    Permissions,
} from './auth';
export { ROLE_PERMISSIONS } from './auth';

// Audit types
export type {
    AuditEventType,
    AuditSeverity,
    AuditCategory,
    AuditLogEntry,
    AuditChange,
    AuditLogFilters,
    AuditLogPage,
    VersionSnapshot,
    VersionDiff,
    AuditStats,
    AuditRetentionConfig,
} from './audit';
export {
    AUDIT_EVENT_LABELS,
    AUDIT_CATEGORY_LABELS,
    AUDIT_SEVERITY_CONFIG,
} from './audit';

// Sync types
export type {
    SyncStatus,
    SyncDirection,
    SyncOperation,
    SyncConflict,
    SyncResult,
    SyncState,
    SyncConfig,
    VersionMetadata,
    ApiResponse,
} from './sync';
