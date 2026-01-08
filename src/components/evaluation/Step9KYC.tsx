// src/components/evaluation/Step9KYC.tsx
// Step 9: KYC - Document verification with photo upload

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useEvaluationStore } from '@/stores/evaluationStore';
import {
    Camera,
    Upload,
    FileCheck,
    AlertCircle,
    CheckCircle,
    X,
    RotateCcw,
    CreditCard,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const DOCUMENT_TYPES = [
    { value: 'rg', label: 'RG', icon: '🪪' },
    { value: 'cnh', label: 'CNH', icon: '🚗' },
    { value: 'passport', label: 'Passaporte', icon: '✈️' },
    { value: 'other', label: 'Outro', icon: '📄' },
];

interface PhotoUploadProps {
    label: string;
    value: string;
    onChange: (base64: string) => void;
    placeholder: string;
}

function PhotoUpload({ label, value, onChange, placeholder }: PhotoUploadProps) {
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [onChange]);

    const handleRemove = () => {
        onChange('');
        if (uploadInputRef.current) uploadInputRef.current.value = '';
    };

    const openCamera = async () => {
        setCameraError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            setStream(mediaStream);
            setIsCameraOpen(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                }
            }, 100);
        } catch (err) {
            console.error('Camera error:', err);
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    setCameraError('Permissão para câmera negada. Por favor, permita o acesso.');
                } else if (err.name === 'NotFoundError') {
                    setCameraError('Nenhuma câmera encontrada no dispositivo.');
                } else {
                    setCameraError('Erro ao acessar a câmera. Tente fazer upload.');
                }
            }
        }
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg', 0.8);
            onChange(base64);
            closeCamera();
        }
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
                {label}
            </label>

            {/* Camera View */}
            {isCameraOpen && (
                <div className="relative rounded-lg overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                        <button
                            onClick={closeCamera}
                            type="button"
                            className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button
                            onClick={capturePhoto}
                            type="button"
                            className="w-16 h-16 bg-white rounded-full border-4 border-brand-500 hover:bg-brand-50 flex items-center justify-center"
                        >
                            <div className="w-12 h-12 bg-brand-500 rounded-full" />
                        </button>
                    </div>
                </div>
            )}

            {/* Photo Preview */}
            {!isCameraOpen && value && (
                <div className="relative rounded-lg overflow-hidden border-2 border-success-300 bg-success-50">
                    <img src={value} alt={label} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="p-2 bg-danger-500 text-white rounded-full hover:bg-danger-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-success-500 text-white px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Anexado
                    </div>
                </div>
            )}

            {/* Upload Options */}
            {!isCameraOpen && !value && (
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 font-medium text-center mb-4">{placeholder}</p>

                    {cameraError && (
                        <div className="bg-danger-50 text-danger-700 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {cameraError}
                        </div>
                    )}

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={openCamera}
                            type="button"
                            className="flex flex-col items-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                        >
                            <Camera className="w-6 h-6" />
                            <span className="text-sm font-medium">Tirar Foto</span>
                        </button>

                        <button
                            onClick={() => uploadInputRef.current?.click()}
                            type="button"
                            className="flex flex-col items-center gap-2 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 border border-neutral-300"
                        >
                            <Upload className="w-6 h-6" />
                            <span className="text-sm font-medium">Enviar Arquivo</span>
                        </button>
                    </div>
                </div>
            )}

            <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}

export function Step9KYC() {
    const { getCurrentEvaluation, updateKYC } = useEvaluationStore();
    const evaluation = getCurrentEvaluation();
    const kyc = evaluation?.kyc || {
        documentType: 'rg' as const,
        documentNumber: '',
        documentIssuer: '',
        documentFrontPhoto: '',
        documentBackPhoto: '',
        selfiePhoto: '',
        verificationStatus: 'pending' as const,
        verificationNotes: '',
        consentGiven: false,
    };

    const handleChange = (field: string, value: string | boolean | Date) => {
        updateKYC({ [field]: value });
    };

    const handleConsentChange = (checked: boolean) => {
        handleChange('consentGiven', checked);
        if (checked) {
            handleChange('consentTimestamp', new Date());
        }
    };

    const isComplete = kyc.documentFrontPhoto && kyc.documentBackPhoto && kyc.consentGiven;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-4">
                    <Shield className="w-8 h-8 text-brand-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                    Verificação de Documentos
                </h2>
                <p className="text-sm text-neutral-500 mt-2">
                    KYC - Conhecimento do Cliente (LGPD Compliance)
                </p>
            </div>

            {/* Document Type Selection */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tipo de Documento
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {DOCUMENT_TYPES.map((doc) => (
                        <button
                            key={doc.value}
                            onClick={() => handleChange('documentType', doc.value)}
                            className={cn(
                                'flex flex-col items-center px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                                kyc.documentType === doc.value
                                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                                    : 'border-neutral-200 hover:border-neutral-300'
                            )}
                        >
                            <span className="text-2xl mb-1">{doc.icon}</span>
                            {doc.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Document Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Número do Documento
                    </label>
                    <input
                        type="text"
                        value={kyc.documentNumber}
                        onChange={(e) => handleChange('documentNumber', e.target.value)}
                        placeholder="Digite o número"
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Órgão Emissor
                    </label>
                    <input
                        type="text"
                        value={kyc.documentIssuer}
                        onChange={(e) => handleChange('documentIssuer', e.target.value)}
                        placeholder="Ex: SSP-SP"
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>

            {/* Photo Uploads */}
            <div className="bg-neutral-50 rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Fotos do Documento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhotoUpload
                        label="Frente do Documento *"
                        value={kyc.documentFrontPhoto}
                        onChange={(v) => handleChange('documentFrontPhoto', v)}
                        placeholder="Foto da frente"
                    />
                    <PhotoUpload
                        label="Verso do Documento *"
                        value={kyc.documentBackPhoto}
                        onChange={(v) => handleChange('documentBackPhoto', v)}
                        placeholder="Foto do verso"
                    />
                </div>

                {/* Optional Selfie */}
                <div className="pt-4 border-t border-neutral-200">
                    <PhotoUpload
                        label="Selfie com Documento (opcional)"
                        value={kyc.selfiePhoto || ''}
                        onChange={(v) => handleChange('selfiePhoto', v)}
                        placeholder="Selfie segurando o documento"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                        A selfie ajuda a confirmar a identidade do titular.
                    </p>
                </div>
            </div>

            {/* Consent Checkbox */}
            <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={kyc.consentGiven}
                        onChange={(e) => handleConsentChange(e.target.checked)}
                        className="w-5 h-5 rounded border-warning-400 text-brand-500 focus:ring-brand-500 mt-0.5"
                    />
                    <div>
                        <p className="font-medium text-warning-800">
                            Consentimento para Coleta de Dados *
                        </p>
                        <p className="text-sm text-warning-700 mt-1">
                            Autorizo a coleta e armazenamento das imagens do meu documento de identificação
                            para fins de verificação de identidade, em conformidade com a LGPD.
                        </p>
                        {kyc.consentGiven && kyc.consentTimestamp && (
                            <p className="text-xs text-warning-600 mt-2">
                                ✓ Consentido em: {new Date(kyc.consentTimestamp).toLocaleString('pt-BR')}
                            </p>
                        )}
                    </div>
                </label>
            </div>

            {/* Status Indicator */}
            <div className={cn(
                'rounded-lg p-4 border',
                isComplete
                    ? 'bg-success-50 border-success-200'
                    : 'bg-neutral-50 border-neutral-200'
            )}>
                <div className="flex items-center gap-3">
                    {isComplete ? (
                        <>
                            <CheckCircle className="w-6 h-6 text-success-600" />
                            <div>
                                <p className="font-medium text-success-800">Documentos Completos</p>
                                <p className="text-sm text-success-600">
                                    Pronto para prosseguir para geração do contrato
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-6 h-6 text-neutral-400" />
                            <div>
                                <p className="font-medium text-neutral-700">Pendente</p>
                                <p className="text-sm text-neutral-500">
                                    {!kyc.documentFrontPhoto && 'Foto da frente • '}
                                    {!kyc.documentBackPhoto && 'Foto do verso • '}
                                    {!kyc.consentGiven && 'Consentimento'}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Observações da Verificação (uso interno)
                </label>
                <textarea
                    value={kyc.verificationNotes}
                    onChange={(e) => handleChange('verificationNotes', e.target.value)}
                    placeholder="Notas sobre a qualidade dos documentos, observações..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
            </div>
        </div>
    );
}
