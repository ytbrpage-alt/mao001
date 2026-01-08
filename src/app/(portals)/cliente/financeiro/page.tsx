'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, Calendar, Clock, CheckCircle, AlertCircle, FileText, Wallet, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils/cn';
import { useClientPortalStore, type Invoice } from '@/stores/clientPortalStore';

const getStatusConfig = (status: Invoice['status']) => {
    switch (status) {
        case 'paid': return { label: 'Pago', icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        case 'pending': return { label: 'Pendente', icon: Clock, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
        case 'overdue': return { label: 'Vencido', icon: AlertCircle, color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
    }
};

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function ClientFinanceiroPage() {
    const { invoices, updateInvoice } = useClientPortalStore();

    const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const filteredInvoices = invoices.filter(inv => filter === 'all' || inv.status === filter);

    const stats = {
        totalPending: invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0),
        totalOverdue: invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0),
    };

    const handlePay = (id: string) => {
        updateInvoice(id, { status: 'paid', paidAt: new Date(), paymentMethod: 'PIX' });
        setSelectedInvoice(null);
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div><h1 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Financeiro</h1><p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Faturas e pagamentos</p></div>

            {/* Summary Cards */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                <div className="card"><div className="flex items-center gap-2 mb-2"><Wallet className="w-5 h-5 text-warning-500" /><span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>A Pagar</span></div><p className="text-xl font-bold text-warning-600">{formatCurrency(stats.totalPending)}</p></div>
                <div className="card"><div className="flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5 text-error-500" /><span className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Vencido</span></div><p className="text-xl font-bold text-error-600">{formatCurrency(stats.totalOverdue)}</p></div>
            </motion.div>

            {/* Overdue Alert */}
            {stats.totalOverdue > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
                    <div className="flex items-center gap-3"><AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" /><div><p className="font-medium text-error-700 dark:text-error-400">Você possui faturas em atraso</p><p className="text-sm text-error-600 dark:text-error-500">Regularize para evitar interrupção nos serviços</p></div></div>
                </motion.div>
            )}

            {/* Filter */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">{(['all', 'pending', 'paid', 'overdue'] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors', filter === f ? 'bg-brand-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800')} style={{ color: filter === f ? undefined : 'rgb(var(--color-text-secondary))' }}>
                        {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : f === 'paid' ? 'Pagas' : 'Vencidas'}
                    </button>
                ))}</div>
            </motion.div>

            {/* Invoices List */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3">
                {filteredInvoices.length === 0 ? (
                    <div className="card text-center py-12"><Receipt className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" /><p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhuma fatura encontrada</p></div>
                ) : (
                    filteredInvoices.map((invoice, index) => {
                        const statusConfig = getStatusConfig(invoice.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                            <motion.div key={invoice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedInvoice(invoice)} className={cn('card cursor-pointer hover:shadow-md transition-shadow', invoice.status === 'overdue' && 'border-l-4 border-l-error-500')}>
                                <div className="flex items-start justify-between mb-2">
                                    <div><h3 className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{invoice.description}</h3><span className={cn('badge text-xs mt-1 flex items-center gap-1 w-fit', statusConfig.bg, statusConfig.color)}><StatusIcon className="w-3 h-3" />{statusConfig.label}</span></div>
                                    <p className="text-lg font-bold" style={{ color: 'rgb(var(--color-text))' }}>{formatCurrency(invoice.amount)}</p>
                                </div>
                                <div className="flex items-center justify-between text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{invoice.status === 'paid' ? `Pago em ${format(new Date(invoice.paidAt!), 'dd/MM/yyyy')}` : `Vence em ${format(new Date(invoice.dueDate), 'dd/MM/yyyy')}`}</span></div>
                                    {invoice.paymentMethod && <span>{invoice.paymentMethod}</span>}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedInvoice && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedInvoice(null)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <div className="text-center mb-6">
                                <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{selectedInvoice.description}</p>
                                <p className="text-3xl font-bold mt-2" style={{ color: 'rgb(var(--color-text))' }}>{formatCurrency(selectedInvoice.amount)}</p>
                                <span className={cn('badge mt-2 flex items-center gap-1 w-fit mx-auto', getStatusConfig(selectedInvoice.status).bg, getStatusConfig(selectedInvoice.status).color)}>
                                    {(() => { const Icon = getStatusConfig(selectedInvoice.status).icon; return <Icon className="w-3 h-3" />; })()}{getStatusConfig(selectedInvoice.status).label}
                                </span>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Vencimento</span><span style={{ color: 'rgb(var(--color-text))' }}>{format(new Date(selectedInvoice.dueDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span></div>
                                {selectedInvoice.paidAt && <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Data do Pagamento</span><span style={{ color: 'rgb(var(--color-text))' }}>{format(new Date(selectedInvoice.paidAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span></div>}
                                {selectedInvoice.paymentMethod && <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Forma de Pagamento</span><span style={{ color: 'rgb(var(--color-text))' }}>{selectedInvoice.paymentMethod}</span></div>}
                            </div>
                            {selectedInvoice.status === 'paid' && selectedInvoice.receiptUrl ? (
                                <button className="w-full btn-secondary flex items-center justify-center gap-2"><Download className="w-5 h-5" />Baixar Comprovante</button>
                            ) : selectedInvoice.status !== 'paid' ? (
                                <div className="space-y-3">
                                    <button onClick={() => handlePay(selectedInvoice.id)} className="w-full btn-primary flex items-center justify-center gap-2"><CreditCard className="w-5 h-5" />Pagar Agora</button>
                                    <button className="w-full btn-secondary flex items-center justify-center gap-2"><FileText className="w-5 h-5" />Gerar Boleto</button>
                                </div>
                            ) : (
                                <button onClick={() => setSelectedInvoice(null)} className="w-full btn-primary">Fechar</button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
