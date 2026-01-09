// src/lib/analytics/events.ts
// Analytics event tracking utilities

declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'js',
            targetId: string | Date,
            config?: Record<string, unknown>
        ) => void;
        dataLayer?: unknown[];
    }
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
): void {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

/**
 * Track page view (for SPAs or custom routing)
 */
export function trackPageView(url: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
            page_path: url,
        });
    }
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, success: boolean): void {
    trackEvent(
        success ? 'form_submit_success' : 'form_submit_error',
        'Form',
        formName
    );
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaName: string, location: string): void {
    trackEvent('cta_click', 'CTA', `${ctaName} - ${location}`);
}

/**
 * Track phone call click
 */
export function trackPhoneClick(location: string): void {
    trackEvent('phone_click', 'Contact', location);
}

/**
 * Track WhatsApp click
 */
export function trackWhatsAppClick(location: string): void {
    trackEvent('whatsapp_click', 'Contact', location);
}

/**
 * Track lead conversion
 */
export function trackLeadConversion(source: string): void {
    trackEvent('generate_lead', 'Conversion', source);
}

/**
 * Track testimonial interaction
 */
export function trackTestimonialView(testimonialId: string): void {
    trackEvent('testimonial_view', 'Engagement', testimonialId);
}

/**
 * Track service page view
 */
export function trackServiceView(serviceName: string): void {
    trackEvent('service_view', 'Services', serviceName);
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number): void {
    trackEvent('scroll_depth', 'Engagement', `${percentage}%`, percentage);
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number): void {
    trackEvent('time_on_page', 'Engagement', `${seconds}s`, seconds);
}
