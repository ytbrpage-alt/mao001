'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Download, Eye, Upload, File, FileCheck, FileWarning, ChevronRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils/cn';
import { useClientPortalStore, type Document } from '@/stores/clientPortalStore';

const getTypeConfig = (type: Document['type']) => {
    switch (type) {
        case 'contract': return { label: 'Contrato', color: 'text-brand-600', bg: 'bg-brand-100 dark:bg-brand-900/30' };
        case 'prescription': return { label: 'Receita', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        case 'report': return { label: 'Laudo', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' };
        case 'exam': return { label: 'Exame', color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        default: return { label: 'Outro', color: 'text-neutral-600', bg: 'bg-neutral-100 dark:bg-neutral-800' };
    }
};

const getStatusConfig = (status: Document['status']) => {
    switch (status) {
        case 'valid': return { label: 'Válido', icon: FileCheck, color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30' };
        case 'expiring': return { label: 'Vencendo', icon: FileWarning, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
        case 'expired': return { label: 'Vencido', icon: FileWarning, color: 'text-error-600', bg: 'bg-error-100 dark:bg-error-900/30' };
    }
};

export default function ClientDocumentsPage() {
    const { documents, addDocument, deleteDocument } = useClientPortalStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'contract' | 'prescription' | 'report' | 'exam'>('all');
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadForm, setUploadForm] = useState({ name: '', type: 'contract' as Document['type'] });

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || doc.type === filter;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: documents.length,
        expiring: documents.filter(d => d.status === 'expiring').length,
        expired: documents.filter(d => d.status === 'expired').length,
    };

    const handleUpload = () => {
        if (!uploadForm.name) return;
        addDocument({
            name: uploadForm.name,
            type: uploadForm.type,
            uploadDate: new Date(),
            status: 'valid',
            fileUrl: '/docs/new-doc.pdf',
            fileSize: '1.2 MB',
            uploadedBy: 'Você',
        });
        setShowUploadModal(false);
        setUploadForm({ name: '', type: 'contract' });
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div><h1 className="text-xl font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Documentos</h1><p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>Contratos, receitas e laudos</p></div>
                <button onClick={() => setShowUploadModal(true)} className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"><Upload className="w-5 h-5" /></button>
            </div>

            {/* Alerts */}
            {(stats.expiring > 0 || stats.expired > 0) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    {stats.expired > 0 && <div className="card bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800"><div className="flex items-center gap-3"><FileWarning className="w-5 h-5 text-error-600 flex-shrink-0" /><p className="text-sm text-error-700 dark:text-error-400">{stats.expired} documento(s) vencido(s)</p></div></div>}
                    {stats.expiring > 0 && <div className="card bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800"><div className="flex items-center gap-3"><FileWarning className="w-5 h-5 text-warning-600 flex-shrink-0" /><p className="text-sm text-warning-700 dark:text-warning-400">{stats.expiring} documento(s) a vencer</p></div></div>}
                </motion.div>
            )}

            {/* Search & Filter */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar documentos..." className="input-base pl-10" /></div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">{(['all', 'contract', 'prescription', 'report', 'exam'] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors', filter === f ? 'bg-brand-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800')} style={{ color: filter === f ? undefined : 'rgb(var(--color-text-secondary))' }}>
                        {f === 'all' ? 'Todos' : f === 'contract' ? 'Contratos' : f === 'prescription' ? 'Receitas' : f === 'report' ? 'Laudos' : 'Exames'}
                    </button>
                ))}</div>
            </motion.div>

            {/* Documents List */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="space-y-3">
                {filteredDocuments.length === 0 ? (
                    <div className="card text-center py-12"><FileText className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" /><p style={{ color: 'rgb(var(--color-text-secondary))' }}>Nenhum documento encontrado</p></div>
                ) : (
                    filteredDocuments.map((doc, index) => {
                        const typeConfig = getTypeConfig(doc.type);
                        const statusConfig = getStatusConfig(doc.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedDocument(doc)} className="card cursor-pointer hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', typeConfig.bg)}><File className={cn('w-5 h-5', typeConfig.color)} /></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-medium truncate" style={{ color: 'rgb(var(--color-text))' }}>{doc.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={cn('badge text-xs', typeConfig.bg, typeConfig.color)}>{typeConfig.label}</span>
                                                    <span className={cn('badge text-xs flex items-center gap-1', statusConfig.bg, statusConfig.color)}><StatusIcon className="w-3 h-3" />{statusConfig.label}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }} className="p-1 hover:bg-error-50 dark:hover:bg-error-900/20 rounded"><Trash2 className="w-4 h-4 text-error-500" /></button>
                                                <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                                            <span>{format(new Date(doc.uploadDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                                            <span>{doc.fileSize}</span>
                                        </div>
                                        {doc.expiresAt && <p className="text-xs mt-1" style={{ color: doc.status === 'expired' ? 'rgb(239, 68, 68)' : 'rgb(var(--color-text-secondary))' }}>{doc.status === 'expired' ? 'Venceu em' : 'Vence em'} {format(new Date(doc.expiresAt), 'dd/MM/yyyy')}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowUploadModal(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>Enviar Documento</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Nome do Documento</label><input type="text" value={uploadForm.name} onChange={(e) => setUploadForm(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="Ex: Receita Médica" /></div>
                                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>Tipo de Documento</label><select value={uploadForm.type} onChange={(e) => setUploadForm(p => ({ ...p, type: e.target.value as Document['type'] }))} className="input-base"><option value="contract">Contrato</option><option value="prescription">Receita</option><option value="report">Laudo</option><option value="exam">Exame</option><option value="other">Outro</option></select></div>
                                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-8 text-center"><Upload className="w-12 h-12 mx-auto text-neutral-400 mb-3" /><p className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>Arraste ou clique para enviar</p><p className="text-sm mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>PDF, JPG ou PNG (máx. 10MB)</p></div>
                            </div>
                            <div className="flex gap-3 mt-6"><button onClick={() => setShowUploadModal(false)} className="flex-1 btn-secondary">Cancelar</button><button onClick={handleUpload} className="flex-1 btn-primary">Enviar</button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedDocument && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedDocument(null)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                            <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto mb-6" />
                            <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>{selectedDocument.name}</h2>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Tipo</span><span className={cn('badge', getTypeConfig(selectedDocument.type).bg, getTypeConfig(selectedDocument.type).color)}>{getTypeConfig(selectedDocument.type).label}</span></div>
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Status</span><span className={cn('badge', getStatusConfig(selectedDocument.status).bg, getStatusConfig(selectedDocument.status).color)}>{getStatusConfig(selectedDocument.status).label}</span></div>
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Enviado em</span><span style={{ color: 'rgb(var(--color-text))' }}>{format(new Date(selectedDocument.uploadDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span></div>
                                {selectedDocument.expiresAt && <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Validade</span><span style={{ color: 'rgb(var(--color-text))' }}>{format(new Date(selectedDocument.expiresAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span></div>}
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Tamanho</span><span style={{ color: 'rgb(var(--color-text))' }}>{selectedDocument.fileSize}</span></div>
                                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"><span style={{ color: 'rgb(var(--color-text-secondary))' }}>Enviado por</span><span style={{ color: 'rgb(var(--color-text))' }}>{selectedDocument.uploadedBy}</span></div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 btn-secondary flex items-center justify-center gap-2"><Eye className="w-5 h-5" />Visualizar</button>
                                <button className="flex-1 btn-primary flex items-center justify-center gap-2"><Download className="w-5 h-5" />Baixar</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
