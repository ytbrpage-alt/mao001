/**
 * HTML Sanitization Utilities
 * 
 * Prevents XSS attacks by escaping dangerous HTML characters
 */

/**
 * HTML entity map for escaping
 */
const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
};

/**
 * Escape HTML special characters to prevent XSS
 * 
 * @example
 * escapeHtml('<script>alert("XSS")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function escapeHtml(str: string | null | undefined): string {
    if (str === null || str === undefined) {
        return '';
    }

    return String(str).replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Escape for use in HTML attributes
 * More strict than regular HTML escaping
 */
export function escapeHtmlAttr(str: string | null | undefined): string {
    if (str === null || str === undefined) {
        return '';
    }

    // Remove any characters that could break out of attributes
    return String(str)
        .replace(/[&<>"'`=\n\r\t]/g, (char) => HTML_ENTITIES[char] || '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '');
}

/**
 * Escape for use in URLs
 * Prevents javascript: and data: URL attacks
 */
export function escapeUrl(url: string | null | undefined): string {
    if (url === null || url === undefined) {
        return '';
    }

    const trimmed = String(url).trim().toLowerCase();

    // Block dangerous protocols
    if (
        trimmed.startsWith('javascript:') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('vbscript:')
    ) {
        return '';
    }

    return encodeURI(String(url));
}

/**
 * Escape for use in JavaScript strings
 */
export function escapeJs(str: string | null | undefined): string {
    if (str === null || str === undefined) {
        return '';
    }

    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/<\/script/gi, '<\\/script');
}

/**
 * Strip all HTML tags from string
 */
export function stripHtml(str: string | null | undefined): string {
    if (str === null || str === undefined) {
        return '';
    }

    return String(str)
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, '') // Also remove HTML entities
        .trim();
}

/**
 * Sanitize string for use in SQL (defense in depth)
 * Note: Always use parameterized queries as primary protection
 */
export function escapeSql(str: string | null | undefined): string {
    if (str === null || str === undefined) {
        return '';
    }

    return String(str)
        .replace(/'/g, "''")
        .replace(/\\/g, '\\\\')
        .replace(/\x00/g, '')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\x1a/g, '\\Z');
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string | null | undefined): string {
    if (filename === null || filename === undefined) {
        return 'file';
    }

    return String(filename)
        .replace(/\.\./g, '') // Remove path traversal
        .replace(/[/\\]/g, '') // Remove slashes
        .replace(/[<>:"|?*\x00-\x1f]/g, '') // Remove illegal chars
        .substring(0, 255); // Limit length
}

/**
 * Sanitize path component
 */
export function sanitizePath(path: string | null | undefined): string {
    if (path === null || path === undefined) {
        return '';
    }

    // Prevent path traversal attacks
    return String(path)
        .replace(/\.\./g, '')
        .replace(/\/+/g, '/')
        .replace(/^\//, '')
        .replace(/\x00/g, '');
}

/**
 * Validate and sanitize CPF format
 */
export function sanitizeCpf(cpf: string | null | undefined): string {
    if (cpf === null || cpf === undefined) {
        return '';
    }

    // Only allow digits, dots, and hyphens
    const cleaned = String(cpf).replace(/[^\d.-]/g, '');

    // Validate format
    if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(cleaned.replace(/[.-]/g, ''))) {
        return '';
    }

    return cleaned;
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string | null | undefined): string {
    if (phone === null || phone === undefined) {
        return '';
    }

    // Only allow digits, parentheses, hyphens, spaces, and plus
    return String(phone).replace(/[^\d()\-\s+]/g, '');
}

/**
 * Validate email format (basic)
 */
export function sanitizeEmail(email: string | null | undefined): string {
    if (email === null || email === undefined) {
        return '';
    }

    const cleaned = String(email).trim().toLowerCase();

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
        return '';
    }

    return escapeHtml(cleaned);
}

/**
 * Create a safe HTML template tagged function
 * 
 * @example
 * const name = '<script>alert("xss")</script>';
 * const html = safeHtml`<p>Hello, ${name}!</p>`;
 * // Returns: '<p>Hello, &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;!</p>'
 */
export function safeHtml(
    strings: TemplateStringsArray,
    ...values: unknown[]
): string {
    let result = strings[0];

    for (let i = 0; i < values.length; i++) {
        result += escapeHtml(String(values[i])) + strings[i + 1];
    }

    return result;
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(
    obj: T,
    options: {
        htmlFields?: string[];
        sqlFields?: string[];
        cpfFields?: string[];
    } = {}
): T {
    const result = { ...obj };

    for (const [key, value] of Object.entries(result)) {
        if (typeof value === 'string') {
            if (options.htmlFields?.includes(key)) {
                (result as Record<string, unknown>)[key] = escapeHtml(value);
            } else if (options.sqlFields?.includes(key)) {
                (result as Record<string, unknown>)[key] = escapeSql(value);
            } else if (options.cpfFields?.includes(key)) {
                (result as Record<string, unknown>)[key] = sanitizeCpf(value);
            }
        } else if (value && typeof value === 'object') {
            (result as Record<string, unknown>)[key] = sanitizeObject(
                value as Record<string, unknown>,
                options
            );
        }
    }

    return result;
}
