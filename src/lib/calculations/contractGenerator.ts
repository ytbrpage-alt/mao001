import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Evaluation } from '@/types';
import { calculateAbemid } from './abemidCalculator';
import { calculateKatz } from './katzCalculator';
import { calculatePricing, formatCurrency } from './pricingCalculator';

export interface ContractData {
    contractNumber: string;
    generatedAt: Date;
    // Partes
    clientName: string;
    clientCpf: string;
    clientAddress: string;
    patientName: string;
    patientCpf: string;
    patientAge: number;
    // Serviço
    professionalType: string;
    professionalDescription: string;
    schedule: {
        days: string;
        hours: string;
        totalHoursPerDay: number;
        shiftsPerMonth: number;
    };
    // Valores
    shiftValue: number;
    monthlyValue: number;
    paymentDueDay: number;
    // Cláusulas
    clauses: ContractClause[];
    // Responsabilidades
    responsibilities: string[];
    // Riscos
    risks: string[];
    riskAssumption: boolean;
}

export interface ContractClause {
    number: string;
    title: string;
    content: string;
}

export function generateContractNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `MA-${year}-${random}`;
}

export function generateContract(evaluation: Evaluation): ContractData {
    const { patient, schedule, abemid, katz, lawton, safetyChecklist, discovery } = evaluation;

    // Calcular resultados
    const abemidResult = calculateAbemid(abemid);
    const katzResult = calculateKatz(katz);

    // Calcular horas
    const startHour = parseInt(schedule.startTime?.split(':')[0] || '7');
    const endHour = parseInt(schedule.endTime?.split(':')[0] || '19');
    const hoursPerDay = endHour > startHour ? endHour - startHour : 24 - startHour + endHour;

    // Calcular preço
    const pricing = calculatePricing({
        professionalType: abemidResult.indicatedProfessional,
        complexityMultiplier: katzResult.complexityMultiplier,
        schedule: {
            ...schedule,
            totalHoursPerDay: hoursPerDay,
        },
    });

    // Formatação de dias
    const weekdayLabels: Record<string, string> = {
        mon: 'Segunda-feira', tue: 'Terça-feira', wed: 'Quarta-feira',
        thu: 'Quinta-feira', fri: 'Sexta-feira', sat: 'Sábado', sun: 'Domingo',
    };

    const daysLabel = schedule.weekDays.length === 7
        ? 'Todos os dias da semana'
        : schedule.weekDays.length === 5 && !schedule.weekDays.includes('sat') && !schedule.weekDays.includes('sun')
            ? 'Segunda a Sexta-feira'
            : schedule.weekDays.map(d => weekdayLabels[d]).join(', ');

    // Gerar cláusulas baseadas na avaliação
    const clauses = generateClauses(evaluation, abemidResult, katzResult, pricing);

    // Gerar responsabilidades
    const responsibilities = generateResponsibilities(lawton);

    // Gerar riscos
    const risks = generateRisks(safetyChecklist);

    return {
        contractNumber: generateContractNumber(),
        generatedAt: new Date(),
        clientName: '', // Será preenchido na interface
        clientCpf: '',
        clientAddress: '',
        patientName: patient.fullName || patient.preferredName || 'Não informado',
        patientCpf: patient.cpf || '',
        patientAge: patient.age || 0,
        professionalType: abemidResult.professionalLabel,
        professionalDescription: abemidResult.justification,
        schedule: {
            days: daysLabel,
            hours: `${schedule.startTime || '07:00'} às ${schedule.endTime || '19:00'}`,
            totalHoursPerDay: hoursPerDay,
            shiftsPerMonth: pricing.shiftsPerMonth,
        },
        shiftValue: pricing.shiftCost,
        monthlyValue: pricing.totalMonthly,
        paymentDueDay: 10,
        clauses,
        responsibilities,
        risks,
        riskAssumption: safetyChecklist.familyPosition === 'wont_adapt',
    };
}

function generateClauses(
    evaluation: Evaluation,
    abemidResult: ReturnType<typeof calculateAbemid>,
    katzResult: ReturnType<typeof calculateKatz>,
    pricing: ReturnType<typeof calculatePricing>
): ContractClause[] {
    const clauses: ContractClause[] = [];

    // Cláusula 1: Objeto
    clauses.push({
        number: '1',
        title: 'DO OBJETO',
        content: `O presente contrato tem por objeto a prestação de serviços de cuidador domiciliar, 
na modalidade ${abemidResult.professionalLabel}, para acompanhamento e assistência ao(à) 
paciente ${evaluation.patient.fullName || 'identificado(a) neste instrumento'}, 
nascido(a) em ${evaluation.patient.birthDate ? format(new Date(evaluation.patient.birthDate), 'dd/MM/yyyy') : '___/___/____'}, 
portador(a) do CPF nº ${evaluation.patient.cpf || '___.___.___-__'}.`
    });

    // Cláusula 2: Horário
    clauses.push({
        number: '2',
        title: 'DO HORÁRIO E FREQUÊNCIA',
        content: `2.1. Os serviços serão prestados nos seguintes dias: ${evaluation.schedule.weekDays.length === 7 ? 'todos os dias' : evaluation.schedule.weekDays.map(d => ({ mon: 'segunda', tue: 'terça', wed: 'quarta', thu: 'quinta', fri: 'sexta', sat: 'sábado', sun: 'domingo' }[d])).join(', ')}.

2.2. O horário de prestação de serviços será das ${evaluation.schedule.startTime || '07:00'} às ${evaluation.schedule.endTime || '19:00'}, totalizando ${pricing.shiftsPerMonth} plantões mensais.

2.3. Eventuais alterações de horário deverão ser comunicadas com antecedência mínima de 48 (quarenta e oito) horas.`
    });

    // Cláusula 3: Valor
    clauses.push({
        number: '3',
        title: 'DO VALOR E FORMA DE PAGAMENTO',
        content: `3.1. O valor do plantão é de ${formatCurrency(pricing.shiftCost)} (${extensoCurrency(pricing.shiftCost)}).

3.2. O valor mensal estimado é de ${formatCurrency(pricing.totalMonthly)} (${extensoCurrency(pricing.totalMonthly)}), considerando ${pricing.shiftsPerMonth} plantões por mês.

3.3. O pagamento deverá ser efetuado até o dia 10 (dez) de cada mês subsequente ao da prestação dos serviços.

3.4. O não pagamento até a data de vencimento acarretará multa de 2% (dois por cento) sobre o valor devido, acrescido de juros de mora de 1% (um por cento) ao mês.`
    });

    // Cláusula 4: Obrigações da Contratada
    clauses.push({
        number: '4',
        title: 'DAS OBRIGAÇÕES DA CONTRATADA',
        content: `4.1. Fornecer profissional devidamente habilitado e qualificado para a função de ${abemidResult.professionalLabel}.

4.2. Garantir a substituição do profissional em caso de falta, férias ou afastamento, no prazo máximo de 2 (duas) horas.

4.3. Supervisionar periodicamente a qualidade dos serviços prestados.

4.4. Manter sigilo absoluto sobre todas as informações relativas ao paciente e sua família.

4.5. Comunicar imediatamente à família qualquer alteração no estado de saúde do paciente.`
    });

    // Cláusula 5: Escopo de Trabalho
    const services = [];
    if (katzResult.totalScore < 6) {
        if (evaluation.katz.bathing < 1) services.push('auxílio no banho');
        if (evaluation.katz.dressing < 1) services.push('auxílio para vestir-se');
        if (evaluation.katz.toileting < 1) services.push('auxílio na higiene');
        if (evaluation.katz.transferring < 1) services.push('auxílio na transferência/mobilidade');
        if (evaluation.katz.feeding < 1) services.push('auxílio na alimentação');
    }
    services.push('administração de medicamentos conforme prescrição médica');
    services.push('acompanhamento e supervisão');
    if (abemidResult.activeTriggers.includes('subcutaneous_injection')) {
        services.push('aplicação de insulina/medicamentos subcutâneos');
    }

    clauses.push({
        number: '5',
        title: 'DO ESCOPO DOS SERVIÇOS',
        content: `5.1. Os serviços prestados incluem: ${services.join('; ')}.

5.2. Os serviços NÃO incluem: limpeza geral da residência; preparo de refeições para a família; cuidados com outras pessoas que não o paciente; serviços de jardinagem, lavagem de veículos ou similares.

5.3. Atividades relacionadas exclusivamente ao paciente que estão incluídas: organização do quarto do paciente; lavagem da roupa do paciente; troca de roupa de cama; preparo das refeições do paciente.`
    });

    // Cláusula 6: Medicamentos (se aplicável)
    if (abemidResult.activeTriggers.length > 0 || evaluation.healthHistory.medicationCount !== '1-3') {
        clauses.push({
            number: '6',
            title: 'DA ADMINISTRAÇÃO DE MEDICAMENTOS',
            content: `6.1. A administração de medicamentos será realizada exclusivamente conforme prescrição médica apresentada pela família.

6.2. É vedado ao profissional alterar dosagens, horários ou medicamentos sem expressa autorização médica.

6.3. A família é responsável por manter os medicamentos em estoque suficiente e informar sobre quaisquer alterações na prescrição.

6.4. A CONTRATADA não se responsabiliza por efeitos adversos decorrentes do uso dos medicamentos prescritos.`
        });
    }

    // Cláusula 7: Fornecimento de Insumos
    if (evaluation.lawton.supplyProvision === 'family') {
        clauses.push({
            number: '7',
            title: 'DO FORNECIMENTO DE INSUMOS',
            content: `7.1. A família CONTRATANTE é responsável pelo fornecimento de todos os insumos necessários ao cuidado do paciente, incluindo, mas não se limitando a: fraldas geriátricas, lenços umedecidos, luvas de procedimento, cremes para prevenção de assaduras, materiais de higiene.

7.2. A falta de insumos que impossibilite a prestação adequada dos serviços não é de responsabilidade da CONTRATADA.`
        });
    }

    // Cláusula 8: Riscos Ambientais (se houver)
    if (evaluation.safetyChecklist.familyPosition === 'wont_adapt') {
        clauses.push({
            number: '8',
            title: 'DA ASSUNÇÃO DE RISCOS AMBIENTAIS',
            content: `8.1. A CONTRATADA realizou avaliação ambiental da residência e identificou os seguintes riscos:

${generateRisks(evaluation.safetyChecklist).map((r, i) => `   ${i + 1}. ${r}`).join('\n')}

8.2. A família CONTRATANTE foi devidamente informada dos riscos acima e declara expressamente que:
   a) Está ciente dos riscos identificados;
   b) Opta por não realizar as adaptações sugeridas;
   c) Assume integral responsabilidade por eventuais acidentes decorrentes das condições ambientais.

8.3. A CONTRATADA fica isenta de qualquer responsabilidade por quedas, acidentes ou lesões que possam ocorrer em decorrência das condições ambientais não adaptadas.`
        });
    }

    // Cláusula: Rescisão
    clauses.push({
        number: String(clauses.length + 1),
        title: 'DA RESCISÃO',
        content: `${clauses.length + 1}.1. O presente contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio de 30 (trinta) dias.

${clauses.length + 1}.2. A rescisão imediata, sem aviso prévio, poderá ocorrer nos seguintes casos:
   a) Descumprimento de quaisquer cláusulas deste contrato;
   b) Maus tratos ao paciente;
   c) Desvio de conduta do profissional;
   d) Inadimplência superior a 30 (trinta) dias.`
    });

    // Cláusula: Disposições Gerais
    clauses.push({
        number: String(clauses.length + 1),
        title: 'DAS DISPOSIÇÕES GERAIS',
        content: `${clauses.length + 1}.1. A CONTRATADA não mantém vínculo empregatício com o profissional designado, tratando-se de prestação de serviços.

${clauses.length + 1}.2. A substituição do profissional poderá ocorrer a qualquer momento, a critério da CONTRATADA, sem que isso configure descumprimento contratual (cláusula de não-pessoalidade).

${clauses.length + 1}.3. As partes elegem o Foro da Comarca de [CIDADE] para dirimir quaisquer questões oriundas deste contrato.`
    });

    return clauses;
}

function generateResponsibilities(lawton: Evaluation['lawton']): string[] {
    const responsibilities: string[] = [];

    if (lawton.medicationSeparation === 'family') {
        responsibilities.push('Separação dos medicamentos em porta-comprimidos pela família');
    } else if (lawton.medicationSeparation === 'caregiver') {
        responsibilities.push('Separação dos medicamentos pelo cuidador conforme receita');
    }

    if (lawton.medicationAdministration === 'self') {
        responsibilities.push('Paciente toma medicamentos sozinho, cuidador apenas lembra');
    } else if (lawton.medicationAdministration === 'supervised') {
        responsibilities.push('Cuidador administra medicamentos e supervisiona');
    } else {
        responsibilities.push('Cuidador administra medicamentos (inclusive amassar se necessário)');
    }

    if (lawton.supplyProvision === 'family') {
        responsibilities.push('Família fornece todos os insumos (fraldas, luvas, etc.)');
    } else if (lawton.supplyProvision === 'company') {
        responsibilities.push('Empresa fornece insumos (valor incluído na mensalidade)');
    }

    if (lawton.mealPreparation === 'ready') {
        responsibilities.push('Família deixa refeições prontas/congeladas');
    } else if (lawton.mealPreparation === 'simple') {
        responsibilities.push('Cuidador prepara refeições simples para o paciente');
    }

    return responsibilities;
}

function generateRisks(safetyChecklist: Evaluation['safetyChecklist']): string[] {
    const risks: string[] = [];

    // Circulação
    if (safetyChecklist.circulation.looseRugs) risks.push('Tapetes soltos nas áreas de circulação');
    if (safetyChecklist.circulation.exposedWires) risks.push('Fios expostos no caminho');
    if (safetyChecklist.circulation.obstructedPaths) risks.push('Móveis obstruindo passagem');
    if (safetyChecklist.circulation.slipperyFloors) risks.push('Piso escorregadio');
    if (safetyChecklist.circulation.poorLighting) risks.push('Iluminação inadequada');

    // Banheiro
    if (safetyChecklist.bathroom.noGrabBarsShower) risks.push('Ausência de barras de apoio no box (CRÍTICO)');
    if (safetyChecklist.bathroom.noGrabBarsToilet) risks.push('Ausência de barras de apoio ao lado do vaso');
    if (safetyChecklist.bathroom.slipperyShowerFloor) risks.push('Piso do box escorregadio (CRÍTICO)');
    if (safetyChecklist.bathroom.lowToilet) risks.push('Vaso sanitário muito baixo');
    if (safetyChecklist.bathroom.noNonSlipMat) risks.push('Ausência de tapete antiderrapante');
    if (safetyChecklist.bathroom.noShowerChair) risks.push('Ausência de cadeira de banho');

    // Quarto
    if (safetyChecklist.bedroom.bedTooLow) risks.push('Cama muito baixa (< 55cm)');
    if (safetyChecklist.bedroom.bedTooHigh) risks.push('Cama muito alta (> 65cm)');
    if (safetyChecklist.bedroom.noSideAccess) risks.push('Cama sem acesso pelos dois lados');
    if (safetyChecklist.bedroom.noNightLight) risks.push('Ausência de luz noturna para banheiro');
    if (safetyChecklist.bedroom.inadequateMattress) risks.push('Colchão inadequado');

    return risks;
}

function extensoCurrency(value: number): string {
    // Versão simplificada - em produção usaria biblioteca como extenso.js
    const inteiro = Math.floor(value);
    const centavos = Math.round((value - inteiro) * 100);

    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const dezADezenove = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    function porExtenso(n: number): string {
        if (n === 0) return 'zero';
        if (n === 100) return 'cem';

        let resultado = '';

        if (n >= 1000) {
            const milhares = Math.floor(n / 1000);
            resultado += milhares === 1 ? 'mil' : porExtenso(milhares) + ' mil';
            n = n % 1000;
            if (n > 0) resultado += ' e ';
        }

        if (n >= 100) {
            resultado += centenas[Math.floor(n / 100)];
            n = n % 100;
            if (n > 0) resultado += ' e ';
        }

        if (n >= 20) {
            resultado += dezenas[Math.floor(n / 10)];
            n = n % 10;
            if (n > 0) resultado += ' e ';
        } else if (n >= 10) {
            resultado += dezADezenove[n - 10];
            return resultado;
        }

        if (n > 0) {
            resultado += unidades[n];
        }

        return resultado;
    }

    let texto = porExtenso(inteiro) + ' reais';
    if (centavos > 0) {
        texto += ' e ' + porExtenso(centavos) + ' centavos';
    }

    return texto;
}

export function generateContractHTML(contract: ContractData, clientInfo: {
    name: string;
    cpf: string;
    address: string;
}, witnesses?: {
    witness1Name: string;
    witness1Cpf: string;
    witness2Name: string;
    witness2Cpf: string;
}): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Prestação de Serviços - ${contract.contractNumber}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 2cm; }
    h1 { text-align: center; font-size: 14pt; margin-bottom: 20px; }
    h2 { font-size: 12pt; margin-top: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 18pt; font-weight: bold; color: #1E8AAD; }
    .contract-number { font-size: 10pt; color: #666; }
    .clause { margin-bottom: 15px; text-align: justify; }
    .clause-title { font-weight: bold; }
    .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature-box { width: 45%; text-align: center; }
    .signature-line { border-top: 1px solid #000; margin-top: 60px; padding-top: 5px; }
    .footer { margin-top: 30px; text-align: center; font-size: 10pt; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">MÃOS AMIGAS</div>
    <div>Serviços de Cuidadores Domiciliares</div>
    <div class="contract-number">Contrato nº ${contract.contractNumber}</div>
  </div>

  <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CUIDADOR DOMICILIAR</h1>

  <p>Pelo presente instrumento particular, de um lado:</p>

  <p><strong>CONTRATANTE:</strong> ${clientInfo.name || '________________________________'}, 
  inscrito(a) no CPF sob o nº ${clientInfo.cpf || '___.___.___-__'}, 
  residente e domiciliado(a) em ${clientInfo.address || '________________________________'}, 
  doravante denominado(a) simplesmente "CONTRATANTE";</p>

  <p>E, de outro lado:</p>

  <p><strong>CONTRATADA:</strong> MÃOS AMIGAS SERVIÇOS DE CUIDADORES LTDA, 
  pessoa jurídica de direito privado, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, 
  com sede na Rua Exemplo, nº 123, Bairro, Cidade/UF, 
  doravante denominada simplesmente "CONTRATADA";</p>

  <p>Têm entre si justo e contratado o seguinte:</p>

  ${contract.clauses.map(clause => `
    <div class="clause">
      <h2>CLÁUSULA ${clause.number} - ${clause.title}</h2>
      <p>${clause.content.replace(/\n/g, '<br>')}</p>
    </div>
  `).join('')}

  <p class="footer">
    E, por estarem assim justos e contratados, assinam o presente instrumento em 2 (duas) vias 
    de igual teor e forma, na presença de 2 (duas) testemunhas.
  </p>

  <p style="text-align: center; margin-top: 20px;">
    ${format(contract.generatedAt, "'Local, 'dd' de 'MMMM' de 'yyyy", { locale: ptBR })}
  </p>

  <div class="signatures">
    <div class="signature-box">
      <div class="signature-line">
        CONTRATANTE<br>
        ${clientInfo.name || 'Nome'}
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        CONTRATADA<br>
        Mãos Amigas Serviços de Cuidadores Ltda
      </div>
    </div>
  </div>

  <div class="signatures" style="margin-top: 30px;">
    <div class="signature-box">
      <div class="signature-line">
        Testemunha 1<br>
        Nome: ${witnesses?.witness1Name || '________________________'}<br>
        CPF: ${witnesses?.witness1Cpf || '___.___.___-__'}
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        Testemunha 2<br>
        Nome: ${witnesses?.witness2Name || '________________________'}<br>
        CPF: ${witnesses?.witness2Cpf || '___.___.___-__'}
      </div>
    </div>
  </div>
</body>
</html>
`;
}
