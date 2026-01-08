// src/components/ui/AddressAutocomplete.tsx
// Address autocomplete using ViaCEP API

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatCEP, removeMask, validateCEP } from '@/lib/utils/masks';
import { MapPin, Search, Loader2, CheckCircle, X } from 'lucide-react';

interface Address {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
}

interface AddressAutocompleteProps {
    onAddressSelect: (address: Address) => void;
    initialCep?: string;
    className?: string;
}

export function AddressAutocomplete({
    onAddressSelect,
    initialCep = '',
    className,
}: AddressAutocompleteProps) {
    const [cep, setCep] = useState(initialCep);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [manualEdit, setManualEdit] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch address from ViaCEP API
    const fetchAddress = useCallback(async (cepValue: string) => {
        const cleanCep = removeMask(cepValue);
        if (cleanCep.length !== 8) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setError('CEP não encontrado');
                setAddress(null);
            } else {
                const addressData: Address = {
                    cep: data.cep,
                    logradouro: data.logradouro,
                    complemento: data.complemento,
                    bairro: data.bairro,
                    localidade: data.localidade,
                    uf: data.uf,
                };
                setAddress(addressData);
                onAddressSelect(addressData);
            }
        } catch (err) {
            setError('Erro ao buscar endereço');
            setAddress(null);
        } finally {
            setLoading(false);
        }
    }, [onAddressSelect]);

    // Handle CEP input change
    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCEP(e.target.value);
        setCep(formatted);
        setError(null);

        // Auto-fetch when CEP is complete
        if (removeMask(formatted).length === 8) {
            fetchAddress(formatted);
        }
    };

    // Get current location
    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocalização não suportada');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Use Google Geocoding API or similar to get address from coordinates
                    // For now, just show a message
                    setError('Digite o CEP manualmente');
                    setLoading(false);
                } catch {
                    setError('Erro ao obter localização');
                    setLoading(false);
                }
            },
            () => {
                setError('Permissão de localização negada');
                setLoading(false);
            }
        );
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* CEP Input */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    CEP
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={cep}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            maxLength={9}
                            className={cn(
                                'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors pr-10',
                                error
                                    ? 'border-danger-500 focus:ring-danger-500'
                                    : address
                                        ? 'border-success-500 focus:ring-success-500'
                                        : 'border-neutral-300 focus:ring-brand-500'
                            )}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {loading && <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />}
                            {!loading && address && <CheckCircle className="w-5 h-5 text-success-500" />}
                            {!loading && error && <X className="w-5 h-5 text-danger-500" />}
                        </div>
                    </div>
                    <button
                        onClick={useCurrentLocation}
                        type="button"
                        className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 border border-neutral-300"
                        title="Usar minha localização"
                    >
                        <MapPin className="w-5 h-5" />
                    </button>
                </div>
                {error && (
                    <p className="text-sm text-danger-600 mt-1">{error}</p>
                )}
            </div>

            {/* Address Fields (auto-filled) */}
            {address && (
                <div className="bg-success-50 rounded-lg p-4 border border-success-200 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-success-700">
                            ✓ Endereço encontrado
                        </span>
                        <button
                            onClick={() => setManualEdit(!manualEdit)}
                            type="button"
                            className="text-sm text-success-600 hover:underline"
                        >
                            {manualEdit ? 'Usar automático' : 'Editar manualmente'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1">Logradouro</label>
                            <input
                                type="text"
                                value={address.logradouro}
                                readOnly={!manualEdit}
                                onChange={(e) => setAddress({ ...address, logradouro: e.target.value })}
                                className={cn(
                                    'w-full px-3 py-2 rounded border text-sm',
                                    manualEdit
                                        ? 'border-neutral-300 bg-white'
                                        : 'border-transparent bg-success-100/50'
                                )}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1">Bairro</label>
                            <input
                                type="text"
                                value={address.bairro}
                                readOnly={!manualEdit}
                                onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                                className={cn(
                                    'w-full px-3 py-2 rounded border text-sm',
                                    manualEdit
                                        ? 'border-neutral-300 bg-white'
                                        : 'border-transparent bg-success-100/50'
                                )}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1">Cidade</label>
                            <input
                                type="text"
                                value={address.localidade}
                                readOnly
                                className="w-full px-3 py-2 rounded border border-transparent bg-success-100/50 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1">UF</label>
                            <input
                                type="text"
                                value={address.uf}
                                readOnly
                                className="w-full px-3 py-2 rounded border border-transparent bg-success-100/50 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-neutral-500 mb-1">
                            Número e Complemento
                        </label>
                        <input
                            type="text"
                            placeholder="Número, apto, bloco..."
                            className="w-full px-3 py-2 rounded border border-neutral-300 bg-white text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
