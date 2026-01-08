import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatar data
export function formatDate(date: Date | string, pattern: string = 'dd/MM/yyyy'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern, { locale: ptBR });
}

// Formatar data relativa
export function formatRelativeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { locale: ptBR, addSuffix: true });
}

// Formatar moeda
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

// Formatar CPF
export function formatCPF(cpf: string): string {
    const digits = cpf.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar telefone
export function formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

// Formatar CEP
export function formatCEP(cep: string): string {
    const digits = cep.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Formatar hora
export function formatTime(time: string): string {
    return time.replace(/(\d{2})(\d{2})/, '$1:$2');
}

// Calcular idade
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

// Formatar porcentagem
export function formatPercent(value: number, decimals: number = 0): string {
    return `${(value * 100).toFixed(decimals)}%`;
}
