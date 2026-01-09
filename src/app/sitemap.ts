import { MetadataRoute } from 'next';

const BASE_URL = 'https://maosamigas.com.br';

/**
 * Generates sitemap.xml for SEO
 * Includes all public pages with appropriate priorities and change frequencies
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: BASE_URL,
            lastModified,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/servicos`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/sobre`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/depoimentos`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/contato`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/privacidade`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/termos`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}
