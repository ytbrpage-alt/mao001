'use client';

import { useEvaluationStore } from '@/stores/evaluationStore';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { MaskedInput } from '@/components/ui/MaskedInput';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { calculateAge } from '@/lib/utils/formatters';

const MARITAL_STATUS_OPTIONS = [
    { value: 'married', label: 'Casado(a)' },
    { value: 'widowed', label: 'Viúvo(a)' },
    { value: 'divorced', label: 'Divorciado(a)' },
    { value: 'single', label: 'Solteiro(a)' },
];

const HOBBIES = [
    { id: 'tv', label: 'Assistir TV' },
    { id: 'music', label: 'Ouvir música' },
    { id: 'reading', label: 'Ler' },
    { id: 'visits', label: 'Receber visitas' },
    { id: 'gardening', label: 'Jardinagem' },
    { id: 'games', label: 'Jogos (cartas, dominó)' },
    { id: 'crafts', label: 'Crochê/tricô/artesanato' },
    { id: 'talking', label: 'Conversar' },
    { id: 'religion', label: 'Religião/orações' },
];

const TEMPERAMENT_OPTIONS = [
    { value: 'calm', label: 'Calmo e tranquilo' },
    { value: 'communicative', label: 'Comunicativo e sociável' },
    { value: 'reserved', label: 'Reservado e introspectivo' },
    { value: 'anxious', label: 'Ansioso ou preocupado' },
    { value: 'irritable', label: 'Irritável ou impaciente' },
    { value: 'depressed', label: 'Deprimido ou apático' },
    { value: 'unstable', label: 'Varia muito (instável)' },
];

const PREFERENCES = [
    { id: 'female_caregiver', label: 'Prefere cuidador do sexo feminino' },
    { id: 'male_caregiver', label: 'Prefere cuidador do sexo masculino' },
    { id: 'no_tv', label: 'Não gosta de TV ligada' },
    { id: 'silence', label: 'Gosta de silêncio' },
    { id: 'background_music', label: 'Gosta de música ambiente' },
    { id: 'has_pet', label: 'Tem animal de estimação (cuidador precisa aceitar)' },
];

const SLEEP_OPTIONS = [
    { value: 'good', label: 'Sim, dorme a noite toda' },
    { value: 'bathroom', label: 'Acorda para ir ao banheiro' },
    { value: 'insomnia', label: 'Tem insônia' },
    { value: 'inverted', label: 'Troca o dia pela noite', badge: 'Comum em demências', badgeColor: 'warning' as const },
    { value: 'agitation', label: 'Agitação noturna', badge: 'Sundowner', badgeColor: 'warning' as const },
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
    value: `${i.toString().padStart(2, '0')}:00`,
    label: `${i.toString().padStart(2, '0')}:00`,
}));

export function Step2Patient() {
    const { patient, updatePatient } = useEvaluationStore((state) => ({
        patient: state.getCurrentEvaluation()?.patient,
        updatePatient: state.updatePatient,
    }));

    if (!patient) return null;

    const handleHobbyToggle = (hobbyId: string, checked: boolean) => {
        const hobbies = checked
            ? [...patient.hobbies, hobbyId]
            : patient.hobbies.filter((h) => h !== hobbyId);
        updatePatient({ hobbies });
    };

    const handlePreferenceToggle = (prefId: string, checked: boolean) => {
        const preferences = checked
            ? [...patient.preferences, prefId]
            : patient.preferences.filter((p) => p !== prefId);
        updatePatient({ preferences });
    };

    const handleBirthDateChange = (dateStr: string) => {
        const date = new Date(dateStr);
        const age = calculateAge(date);
        updatePatient({ birthDate: date, age });
    };

    const handleAddressSelect = (address: { logradouro: string; bairro: string; localidade: string; uf: string; cep: string }) => {
        updatePatient({
            address: address.logradouro,
            neighborhood: address.bairro,
            city: address.localidade,
            state: address.uf,
            cep: address.cep,
        });
    };

    return (
        <div className="space-y-6">
            {/* Dados Pessoais */}
            <QuestionCard title="DADOS PESSOAIS">
                <MaskedInput
                    label="Nome completo"
                    mask="name"
                    value={patient.fullName}
                    onChange={(formatted) => updatePatient({ fullName: formatted })}
                    errorMessage="Digite nome e sobrenome"
                    placeholder="Nome completo do paciente"
                />

                <Input
                    label="Como gosta de ser chamado(a)"
                    value={patient.preferredName}
                    onChange={(e) => updatePatient({ preferredName: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Data de nascimento"
                        type="date"
                        value={patient.birthDate instanceof Date ? patient.birthDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleBirthDateChange(e.target.value)}
                    />
                    <Input
                        label="Idade"
                        type="number"
                        value={patient.age.toString()}
                        readOnly
                        className="bg-neutral-100"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MaskedInput
                        label="CPF"
                        mask="cpf"
                        value={patient.cpf}
                        onChange={(formatted) => updatePatient({ cpf: formatted })}
                        placeholder="000.000.000-00"
                        errorMessage="CPF inválido"
                    />
                    <MaskedInput
                        label="Telefone"
                        mask="phone"
                        value={patient.phone || ''}
                        onChange={(formatted) => updatePatient({ phone: formatted })}
                        placeholder="(00) 00000-0000"
                        errorMessage="Telefone inválido"
                    />
                </div>

                <Select
                    label="Estado civil"
                    options={MARITAL_STATUS_OPTIONS}
                    value={patient.maritalStatus}
                    onValueChange={(value) => updatePatient({ maritalStatus: value })}
                />
            </QuestionCard>

            {/* Endereço */}
            <QuestionCard title="ENDEREÇO">
                <AddressAutocomplete
                    onAddressSelect={handleAddressSelect}
                    initialCep={patient.cep || ''}
                />
            </QuestionCard>

            {/* História de Vida */}
            <QuestionCard
                title="HISTÓRIA DE VIDA"
                script="O que o(a) paciente fazia antes? Qual era a profissão? O que gosta de fazer?"
            >
                <Input
                    label="Profissão anterior"
                    value={patient.previousOccupation}
                    onChange={(e) => updatePatient({ previousOccupation: e.target.value })}
                />

                <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-700">Hobbies e interesses</p>
                    {HOBBIES.map((hobby) => (
                        <Checkbox
                            key={hobby.id}
                            id={hobby.id}
                            label={hobby.label}
                            checked={patient.hobbies.includes(hobby.id)}
                            onCheckedChange={(checked) => handleHobbyToggle(hobby.id, checked)}
                        />
                    ))}
                    <Input
                        label="Outros hobbies"
                        value={patient.otherHobbies}
                        onChange={(e) => updatePatient({ otherHobbies: e.target.value })}
                    />
                </div>

                <p className="text-xs text-neutral-500 bg-brand-50 p-3 rounded-lg">
                    💡 Isso ajuda o cuidador a criar vínculo e estimular o paciente.
                </p>
            </QuestionCard>

            {/* Personalidade e Preferências */}
            <QuestionCard
                title="PERSONALIDADE E PREFERÊNCIAS"
                script="Como é o jeito do(a) paciente? É mais calmo(a), agitado(a), gosta de conversar?"
            >
                <RadioGroup
                    label="Temperamento predominante"
                    options={TEMPERAMENT_OPTIONS}
                    value={patient.temperament}
                    onValueChange={(value) => updatePatient({ temperament: value })}
                />

                <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-700">Preferências importantes</p>
                    {PREFERENCES.map((pref) => (
                        <Checkbox
                            key={pref.id}
                            id={pref.id}
                            label={pref.label}
                            checked={patient.preferences.includes(pref.id)}
                            onCheckedChange={(checked) => handlePreferenceToggle(pref.id, checked)}
                        />
                    ))}
                    <Input
                        label="Outras preferências"
                        value={patient.otherPreferences}
                        onChange={(e) => updatePatient({ otherPreferences: e.target.value })}
                    />
                </div>
            </QuestionCard>

            {/* Rotina Atual */}
            <QuestionCard
                title="ROTINA ATUAL"
                script="Como é um dia típico do(a) paciente?"
            >
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Acorda por volta de"
                        options={TIME_OPTIONS}
                        value={patient.wakeUpTime}
                        onValueChange={(value) => updatePatient({ wakeUpTime: value })}
                    />
                    <Select
                        label="Café da manhã"
                        options={TIME_OPTIONS}
                        value={patient.breakfastTime}
                        onValueChange={(value) => updatePatient({ breakfastTime: value })}
                    />
                    <Select
                        label="Almoço"
                        options={TIME_OPTIONS}
                        value={patient.lunchTime}
                        onValueChange={(value) => updatePatient({ lunchTime: value })}
                    />
                    <Select
                        label="Jantar"
                        options={TIME_OPTIONS}
                        value={patient.dinnerTime}
                        onValueChange={(value) => updatePatient({ dinnerTime: value })}
                    />
                </div>

                <Checkbox
                    id="takes_nap"
                    label="Costuma cochilar à tarde?"
                    checked={patient.takesNap}
                    onCheckedChange={(checked) => updatePatient({ takesNap: checked })}
                />

                <Select
                    label="Vai dormir"
                    options={TIME_OPTIONS}
                    value={patient.bedTime}
                    onValueChange={(value) => updatePatient({ bedTime: value })}
                />

                <RadioGroup
                    label="Dorme bem à noite?"
                    options={SLEEP_OPTIONS}
                    value={patient.sleepQuality}
                    onValueChange={(value) => updatePatient({ sleepQuality: value })}
                />

                {patient.sleepQuality === 'bathroom' && (
                    <Input
                        label="Quantas vezes acorda?"
                        type="number"
                        value={patient.nightWakeups.toString()}
                        onChange={(e) => updatePatient({ nightWakeups: parseInt(e.target.value) || 0 })}
                    />
                )}
            </QuestionCard>

            {/* Nota informativa */}
            <div className="bg-success-50 p-4 rounded-xl">
                <p className="text-sm text-success-700">
                    ✨ <strong>Por que isso importa?</strong> Conhecer a história e preferências
                    do paciente permite selecionar um cuidador com perfil compatível, aumentando
                    a chance de sucesso do atendimento.
                </p>
            </div>
        </div>
    );
}
