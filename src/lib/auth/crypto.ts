/**
 * Utilitários de criptografia para autenticação
 * Usa Web Crypto API (disponível em browsers modernos e PWAs)
 */

// Gerar salt aleatório
export async function generateSalt(): Promise<string> {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash de PIN usando PBKDF2
export async function hashPin(pin: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const useSalt = salt || await generateSalt();

    // Converter PIN para ArrayBuffer
    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin);
    const saltData = encoder.encode(useSalt);

    // Importar PIN como chave
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        pinData,
        'PBKDF2',
        false,
        ['deriveBits']
    );

    // Derivar hash
    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: saltData,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        256
    );

    // Converter para hex string
    const hashArray = new Uint8Array(hashBuffer);
    const hash = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');

    return { hash, salt: useSalt };
}

// Verificar PIN
export async function verifyPin(pin: string, storedHash: string, salt: string): Promise<boolean> {
    const { hash } = await hashPin(pin, salt);
    return hash === storedHash;
}

// Gerar token de sessão
export function generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Gerar ID de dispositivo (persistente)
export function getOrCreateDeviceId(): string {
    const DEVICE_ID_KEY = 'maos-amigas-device-id';

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        deviceId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
}

// Criptografar dados sensíveis para armazenamento
export async function encryptData(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Derivar chave de criptografia
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    const cryptoKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode('maos-amigas-salt'),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
    );

    // Gerar IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Criptografar
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        dataBuffer
    );

    // Combinar IV + dados criptografados
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Converter para base64
    return btoa(String.fromCharCode(...combined));
}

// Descriptografar dados
export async function decryptData(encryptedData: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Converter de base64
    const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );

    // Separar IV e dados
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    // Derivar chave
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    const cryptoKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode('maos-amigas-salt'),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    // Descriptografar
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
    );

    return decoder.decode(decryptedBuffer);
}

// Validar formato de PIN
export function validatePinFormat(pin: string): { valid: boolean; error?: string } {
    if (!/^\d{6}$/.test(pin)) {
        return { valid: false, error: 'PIN deve ter exatamente 6 dígitos numéricos' };
    }

    // Verificar sequências óbvias
    const obviousPatterns = ['123456', '654321', '000000', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999'];
    if (obviousPatterns.includes(pin)) {
        return { valid: false, error: 'PIN muito simples. Escolha uma combinação mais segura' };
    }

    // Verificar repetição excessiva
    const uniqueDigits = new Set(pin.split('')).size;
    if (uniqueDigits < 3) {
        return { valid: false, error: 'PIN deve ter pelo menos 3 dígitos diferentes' };
    }

    return { valid: true };
}
