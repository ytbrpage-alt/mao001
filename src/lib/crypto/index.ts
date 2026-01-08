// src/lib/crypto/index.ts
// Crypto module barrel exports

// Core encryption
export {
    encryptData,
    decryptData,
    generateHash,
    verifyIntegrity,
    encryptField,
    decryptField,
    type EncryptedData,
} from './encryption';

// Device identification
export {
    getDeviceId,
    getDeviceSalt,
    generateEncryptionPassword,
} from './deviceId';

// Secure storage
export {
    SecureStorage,
    initSecureStorage,
    getSecureStorage,
    isSecureStorageInitialized,
} from './secureStorage';

// Sensitive field helpers
export {
    SENSITIVE_PATIENT_FIELDS,
    SENSITIVE_HEALTH_FIELDS,
    encryptPatientData,
    decryptPatientData,
    encryptHealthData,
    decryptHealthData,
    isEncrypted,
    maskCPF,
    maskName,
} from './sensitiveFields';
