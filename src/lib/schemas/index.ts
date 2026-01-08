// src/lib/schemas/index.ts
// Central export for all validation schemas

// Patient schemas
export {
    cpfSchema,
    phoneSchema,
    cepSchema,
    nameSchema,
    patientSchema,
    type PatientFormData,
} from './patient.schema';

// Discovery schemas
export {
    triggerCategorySchema,
    urgencyLevelSchema,
    discoverySchema,
    type DiscoveryFormData,
} from './discovery.schema';

// Evaluator schemas
export {
    emailSchema,
    evaluatorRoleSchema,
    branchOfficeSchema,
    evaluatorSchema,
    type EvaluatorFormData,
} from './evaluator.schema';

// KYC schemas
export {
    documentTypeSchema,
    verificationStatusSchema,
    kycSchema,
    kycMinimalSchema,
    type KYCFormData,
    type KYCMinimalFormData,
} from './kyc.schema';
