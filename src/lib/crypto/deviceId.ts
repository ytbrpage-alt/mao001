// src/lib/crypto/deviceId.ts
// Generate a unique device identifier for encryption key derivation

/**
 * Generate a fingerprint based on device/browser characteristics
 */
export async function getDeviceId(): Promise<string> {
    const components = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset().toString(),
        screen.width + 'x' + screen.height,
        screen.colorDepth.toString(),
        navigator.hardwareConcurrency?.toString() || 'unknown',
        // Canvas fingerprint (simplified)
        getCanvasFingerprint(),
    ];

    const data = components.join('|');

    // Hash the fingerprint
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Get a simple canvas fingerprint
 */
function getCanvasFingerprint(): string {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'no-canvas';

        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('MaosAmigas', 2, 15);

        return canvas.toDataURL().slice(-50);
    } catch {
        return 'canvas-error';
    }
}

/**
 * Get or create a persistent device salt
 */
export function getDeviceSalt(): string {
    const SALT_KEY = 'maos-amigas-device-salt';

    let salt = localStorage.getItem(SALT_KEY);
    if (!salt) {
        const randomBytes = crypto.getRandomValues(new Uint8Array(32));
        salt = Array.from(randomBytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        localStorage.setItem(SALT_KEY, salt);
    }

    return salt;
}

/**
 * Generate encryption password from device ID and user ID
 */
export async function generateEncryptionPassword(userId?: string): Promise<string> {
    const deviceId = await getDeviceId();
    const deviceSalt = getDeviceSalt();

    const components = [
        deviceId,
        deviceSalt,
        userId || 'anonymous',
    ];

    const data = components.join(':');

    // Additional hash for the password
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}
