const BASE_URL = 'https://maosamigas.com.br';

/**
 * Organization Schema.org structured data
 * Helps search engines understand company information
 */
export function OrganizationJsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Mãos Amigas Home Care',
        description: 'Serviços profissionais de cuidado domiciliar para idosos em Toledo-PR. Equipe qualificada, atendimento 24h e planos personalizados.',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        image: `${BASE_URL}/og-image.jpg`,
        telephone: '+55-45-99999-9999',
        email: 'contato@maosamigas.com.br',
        foundingDate: '2011',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rua São Paulo, 1234',
            addressLocality: 'Toledo',
            addressRegion: 'PR',
            postalCode: '85900-000',
            addressCountry: 'BR',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '-24.7134',
            longitude: '-53.7428',
        },
        sameAs: [
            'https://www.facebook.com/maosamigashomecare',
            'https://www.instagram.com/maosamigashomecare',
            'https://wa.me/554599999999',
        ],
        areaServed: {
            '@type': 'City',
            name: 'Toledo',
            '@id': 'https://www.wikidata.org/wiki/Q939062',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * LocalBusiness Schema.org structured data
 * Helps with local SEO and rich search results
 */
export function LocalBusinessJsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'HealthAndBeautyBusiness',
        '@id': BASE_URL,
        name: 'Mãos Amigas Home Care',
        description: 'Cuidadores de idosos profissionais em Toledo-PR. Atendimento 24h, planos personalizados.',
        url: BASE_URL,
        telephone: '+55-45-99999-9999',
        priceRange: '$$',
        image: `${BASE_URL}/og-image.jpg`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rua São Paulo, 1234',
            addressLocality: 'Toledo',
            addressRegion: 'PR',
            postalCode: '85900-000',
            addressCountry: 'BR',
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '18:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '08:00',
                closes: '12:00',
            },
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '500',
            bestRating: '5',
            worstRating: '1',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Service Schema.org structured data
 * Describes the home care services offered
 */
export function ServiceJsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Home Care',
        provider: {
            '@type': 'Organization',
            name: 'Mãos Amigas Home Care',
            url: BASE_URL,
        },
        areaServed: {
            '@type': 'City',
            name: 'Toledo',
            addressRegion: 'PR',
            addressCountry: 'BR',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Serviços de Cuidado Domiciliar',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Cuidado Domiciliar 24h',
                        description: 'Assistência completa no conforto do lar com profissionais qualificados.',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Acompanhamento Médico',
                        description: 'Acompanhamento em consultas, exames e procedimentos médicos.',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Cuidados Especializados',
                        description: 'Cuidados específicos para Alzheimer, Parkinson e outras condições.',
                    },
                },
            ],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * FAQ Schema.org structured data
 * Helps with FAQ rich snippets in search results
 */
export function FAQJsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Como funciona o serviço de cuidadores de idosos?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Realizamos uma avaliação gratuita para entender as necessidades do idoso. Em seguida, criamos um plano de cuidados personalizado e selecionamos o profissional ideal para atendê-lo.',
                },
            },
            {
                '@type': 'Question',
                name: 'Qual o custo do serviço de home care?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'O valor varia de acordo com o tipo de cuidado necessário, carga horária e profissional requisitado. Oferecemos avaliação gratuita e orçamento personalizado sem compromisso.',
                },
            },
            {
                '@type': 'Question',
                name: 'Os profissionais são qualificados?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sim, todos os nossos profissionais passam por rigoroso processo de seleção, verificação de antecedentes e treinamentos contínuos. Temos cuidadores, técnicos de enfermagem e enfermeiros.',
                },
            },
            {
                '@type': 'Question',
                name: 'Vocês atendem 24 horas?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sim, oferecemos atendimento 24 horas, 7 dias por semana. Temos escalas de dia, noite, 12x36 e plantões conforme a necessidade da família.',
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
