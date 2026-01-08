// src/lib/crypto/encryption.ts
// Client-side encryption using Web Crypto API (AES-GCM)

export interface EncryptedData {
    ciphertext: string; // Base64
    iv: string;         // Initialization Vector (Base64)
    salt: string;       // For key derivation (Base64)
}

/**
 * Derive an AES-GCM key from a password using PBKDF2
 */
async function deriveKey(
    password: string,
    salt: Uint8Array
): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import password as base key material
    const baseKey = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    // Derive AES-GCM key using PBKDF2
    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000, // High iteration count for security
            hash: 'SHA-256',
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Encrypt plaintext data
 */
export async function encryptData(
    plaintext: string,
    password: string
): Promise<EncryptedData> {
    try {
        // Generate random salt and IV
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // Derive key from password
        const key = await deriveKey(password, salt);

        // Encrypt the data
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);

        const ciphertext = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            data
        );

        // Return Base64-encoded result
        return {
            ciphertext: arrayBufferToBase64(ciphertext),
            iv: arrayBufferToBase64(iv),
            salt: arrayBufferToBase64(salt),
        };
    } catch (error) {
        console.error('[Encryption] Failed to encrypt:', error);
        throw new Error('Falha na criptografia');
    }
}

/**
 * Decrypt encrypted data
 */
export async function decryptData(
    encrypted: EncryptedData,
    password: string
): Promise<string> {
    try {
        // Convert from Base64
        const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);
        const iv = base64ToArrayBuffer(encrypted.iv);
        const salt = base64ToArrayBuffer(encrypted.salt);

        // Derive key from password
        const key = await deriveKey(password, new Uint8Array(salt));

        // Decrypt the data
        const plaintext = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: new Uint8Array(iv),
            },
            key,
            ciphertext
        );

        // Decode and return
        const decoder = new TextDecoder();
        return decoder.decode(plaintext);
    } catch (error) {
        console.error('[Encryption] Failed to decrypt:', error);
        throw new Error('Falha na descriptografia');
    }
}

/**
 * Generate SHA-256 hash for integrity verification
 */
export async function generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return arrayBufferToBase64(hashBuffer);
}

/**
 * Verify data integrity
 */
export async function verifyIntegrity(
    data: string,
    expectedHash: string
): Promise<boolean> {
    const computedHash = await generateHash(data);
    return computedHash === expectedHash;
}

/**
 * Encrypt a specific field value
 */
export async function encryptField(
    value: string,
    password: string
): Promise<string> {
    if (!value) return '';
    const encrypted = await encryptData(value, password);
    return JSON.stringify(encrypted);
}

/**
 * Decrypt a specific field value
 */
export async function decryptField(
    encryptedValue: string,
    password: string
): Promise<string> {
    if (!encryptedValue) return '';
    try {
        const encrypted = JSON.parse(encryptedValue) as EncryptedData;
        return await decryptData(encrypted, password);
    } catch {
        // Return original if not encrypted (for migration)
        return encryptedValue;
    }
}
