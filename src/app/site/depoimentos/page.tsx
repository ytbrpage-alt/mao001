import Link from 'next/link';
import { Star, Quote, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Depoimentos',
    description: 'Veja o que nossos clientes dizem sobre os serviços da Mãos Amigas Home Care. Histórias reais de famílias atendidas.',
};

const TESTIMONIALS = [
    {
        id: '1',
        name: 'Maria Helena Santos',
        role: 'Filha de paciente',
        location: 'São Paulo, SP',
        content: 'A Mãos Amigas transformou nossa rotina. Minha mãe de 87 anos tem Alzheimer e precisava de cuidados 24 horas. A equipe é extremamente profissional e carinhosa. Sinto que minha mãe está em boas mãos e nossa família pode ter mais tranquilidade.',
        rating: 5,
        service: 'Cuidador de Idosos',
    },
    {
        id: '2',
        name: 'Roberto Oliveira',
        role: 'Familiar de paciente',
        location: 'Campinas, SP',
        content: 'Após meu pai sofrer um AVC, precisávamos de um técnico de enfermagem para administrar medicações e fazer curativos. A resposta foi rápida e o profissional enviado era excelente. Recomendo demais!',
        rating: 5,
        service: 'Técnico de Enfermagem',
    },
    {
        id: '3',
        name: 'Ana Paula Mendes',
        role: 'Paciente',
        location: 'Santos, SP',
        content: 'Depois da minha cirurgia de quadril, precisei de fisioterapia domiciliar. A profissional da Mãos Amigas me ajudou muito na recuperação. Hoje já consigo caminhar normalmente. Sou muito grata!',
        rating: 5,
        service: 'Fisioterapia',
    },
    {
        id: '4',
        name: 'Carlos Eduardo Lima',
        role: 'Filho de paciente',
        location: 'São Paulo, SP',
        content: 'Meu pai precisa de ventilação mecânica e encontrar profissionais qualificados não é fácil. A Mãos Amigas nos proporcionou uma enfermeira excepcional que cuida dele com muito zelo. Estamos muito satisfeitos.',
        rating: 5,
        service: 'Enfermeiro',
    },
    {
        id: '5',
        name: 'Fernanda Costa',
        role: 'Neta de paciente',
        location: 'São Bernardo, SP',
        content: 'A cuidadora que cuida da minha avó é um anjo! Muito paciente, carinhosa e competente. Minha avó até ganhou peso e está mais animada desde que ela chegou. Obrigada, Mãos Amigas!',
        rating: 5,
        service: 'Cuidador de Idosos',
    },
    {
        id: '6',
        name: 'Pedro Augusto Silva',
        role: 'Familiar de paciente',
        location: 'Guarulhos, SP',
        content: 'O portal do cliente é sensacional! Consigo acompanhar todas as evoluções do meu pai, ver os medicamentos, conversar com a equipe. A tecnologia junto com o cuidado humano faz toda diferença.',
        rating: 5,
        service: 'Tecnologia',
    },
];

/**
 * Testimonials page with client reviews and success stories
 */
export default function DepoimentosPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-50 to-white py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900">
                            O que nossos clientes dizem
                        </h1>
                        <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                            Histórias reais de famílias que confiam na Mãos Amigas para
                            cuidar de quem eles mais amam.
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <span className="text-neutral-600 font-medium">4.9/5 baseado em 500+ avaliações</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-neutral-50 p-6 rounded-2xl hover:shadow-lg transition-shadow"
                            >
                                <Quote className="w-10 h-10 text-brand-200 mb-4" />
                                <p className="text-neutral-700 leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="mt-6 pt-6 border-t border-neutral-200">
                                    <div className="flex gap-1 mb-3">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-brand-200 rounded-full flex items-center justify-center">
                                            <span className="text-brand-600 font-bold">
                                                {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                                            <p className="text-sm text-neutral-500">{testimonial.role}</p>
                                            <p className="text-xs text-neutral-400">{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
                                            {testimonial.service}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section (placeholder) */}
            <section className="py-16 lg:py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900">
                            Veja histórias em vídeo
                        </h2>
                        <p className="mt-4 text-neutral-600">
                            Depoimentos em vídeo de famílias que confiam na Mãos Amigas.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[1, 2].map((i) => (
                            <div key={i} className="aspect-video bg-neutral-200 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
                                    </div>
                                    <p className="text-neutral-500">Vídeo em breve</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 lg:py-24 bg-brand-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">
                        Junte-se a milhares de famílias satisfeitas
                    </h2>
                    <p className="mt-4 text-lg text-brand-100">
                        Solicite uma avaliação gratuita e descubra como podemos ajudar sua família.
                    </p>
                    <Link
                        href="/site/contato"
                        className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
                    >
                        Quero Fazer Parte
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
