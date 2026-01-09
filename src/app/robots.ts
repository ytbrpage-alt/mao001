import { MetadataRoute } from 'next';

const BASE_URL = 'https://maosamigas.com.br';

/**
 * Generates robots.txt for SEO
 * Allows crawling of public pages, blocks private/internal areas
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/avaliacao/',
                    '/admin/',
                    '/cliente/',
                    '/profissional/',
                    '/login',
                    '/cadastro',
                    '/_next/',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
