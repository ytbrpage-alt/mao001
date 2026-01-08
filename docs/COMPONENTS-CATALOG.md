# 🧩 Mãos Amigas - Catálogo de Componentes

> Inventário completo de todos os componentes React do sistema

---

## 📊 Resumo

| Categoria | Quantidade |
|-----------|------------|
| UI Base | 27 |
| Evaluation Steps | 10 |
| Layout | 2 |
| Dashboard | 4 |
| Shared | 5 |
| Portals | 8 |
| Auth | 3 |
| Chat | 3 |
| Audit | 2 |
| Sync | 2 |
| Proposal | 1 |
| **Total** | **71** |

---

## 🎨 Componentes UI Base (`/components/ui/`)

### Button
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success' \| 'outline'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` | Tamanho |
| `loading` | `boolean` | `false` | Estado de loading |
| `fullWidth` | `boolean` | `false` | Largura total |
| `leftIcon` | `ReactNode` | - | Ícone à esquerda |
| `rightIcon` | `ReactNode` | - | Ícone à direita |

### Input
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | `string` | - | Label do campo |
| `error` | `string` | - | Mensagem de erro |
| `helperText` | `string` | - | Texto de ajuda |
| `leftIcon` | `ReactNode` | - | Ícone à esquerda |
| `rightIcon` | `ReactNode` | - | Ícone à direita |

### Select
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `options` | `SelectOption[]` | `[]` | Opções do select |
| `label` | `string` | - | Label |
| `placeholder` | `string` | - | Placeholder |
| `error` | `string` | - | Mensagem de erro |

### Checkbox
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | `string` | - | Texto do checkbox |
| `checked` | `boolean` | `false` | Estado |
| `indeterminate` | `boolean` | `false` | Estado indeterminado |

### RadioGroup
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `options` | `RadioOption[]` | `[]` | Opções |
| `value` | `string` | - | Valor selecionado |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientação |

### Card
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `'default' \| 'outlined' \| 'elevated' \| 'interactive'` | `'default'` | Estilo |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Padding interno |
| `interactive` | `boolean` | `false` | Hover effect |

### Badge
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | Cor |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| `outlined` | `boolean` | `false` | Estilo outlined |

### Modal
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `isOpen` | `boolean` | `false` | Visibilidade |
| `onClose` | `() => void` | - | Callback de fechamento |
| `title` | `string` | - | Título |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Tamanho |

### Toast
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Tipo |
| `title` | `string` | - | Título |
| `description` | `string` | - | Descrição |
| `duration` | `number` | `5000` | Duração em ms |

### Progress
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `value` | `number` | `0` | Valor (0-100) |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Cor |
| `showLabel` | `boolean` | `false` | Exibe porcentagem |

### Skeleton
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'text'` | Formato |
| `width` | `string \| number` | `'100%'` | Largura |
| `height` | `string \| number` | - | Altura |
| `animation` | `'pulse' \| 'wave' \| 'none'` | `'pulse'` | Animação |

### Accordion
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `items` | `AccordionItem[]` | `[]` | Itens |
| `type` | `'single' \| 'multiple'` | `'single'` | Comportamento |
| `defaultValue` | `string \| string[]` | - | Valor inicial |

### BottomSheet
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `isOpen` | `boolean` | `false` | Visibilidade |
| `onClose` | `() => void` | - | Callback |
| `snapPoints` | `number[]` | `[0.5, 1]` | Pontos de snap |

### Switch
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `checked` | `boolean` | `false` | Estado |
| `label` | `string` | - | Label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |

### Slider
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `min` | `number` | `0` | Valor mínimo |
| `max` | `number` | `100` | Valor máximo |
| `step` | `number` | `1` | Incremento |
| `value` | `number[]` | - | Valor atual |

### StepIndicator
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `steps` | `Step[]` | `[]` | Lista de steps |
| `currentStep` | `number` | `0` | Step atual |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout |

### MaskedInput
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `mask` | `'cpf' \| 'phone' \| 'cep' \| 'date' \| 'currency'` | - | Tipo de máscara |
| `...InputProps` | - | - | Props do Input |

### AddressAutocomplete
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `onSelect` | `(address) => void` | - | Callback de seleção |
| `label` | `string` | - | Label |

### Header
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `title` | `string` | - | Título da página |
| `showBack` | `boolean` | `false` | Botão voltar |
| `actions` | `ReactNode` | - | Ações à direita |

### BottomNavigation
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `items` | `NavItem[]` | `[]` | Itens de navegação |
| `activeItem` | `string` | - | Item ativo |

### EmptyState / EmptyStates
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `icon` | `ReactNode` | - | Ícone |
| `title` | `string` | - | Título |
| `description` | `string` | - | Descrição |
| `action` | `ReactNode` | - | Botão de ação |

### LoadingStates
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `'spinner' \| 'dots' \| 'skeleton' \| 'progress'` | `'spinner'` | Tipo de loading |
| `text` | `string` | - | Texto de loading |

### ErrorBoundary
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `fallback` | `ReactNode` | - | UI de fallback |
| `onError` | `(error) => void` | - | Callback de erro |

### Textarea
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | `string` | - | Label |
| `error` | `string` | - | Erro |
| `rows` | `number` | `3` | Linhas |
| `maxLength` | `number` | - | Máximo de caracteres |

### Transitions
Componente wrapper para animações com Framer Motion:
- `FadeIn`
- `SlideIn`
- `ScaleIn`
- `StaggerChildren`

---

## 📋 Componentes de Avaliação (`/components/evaluation/`)

| Componente | Arquivo | Tamanho | Descrição |
|------------|---------|---------|-----------|
| `RecoveryBanner` | `RecoveryBanner.tsx` | 4KB | Banner de recuperação de avaliação |
| `Step1Discovery` | `Step1Discovery.tsx` | 12KB | Etapa 1: Gatilho de descoberta |
| `Step2Patient` | `Step2Patient.tsx` | 13KB | Etapa 2: Dados do paciente |
| `Step3Health` | `Step3Health.tsx` | 15KB | Etapa 3: Histórico de saúde |
| `Step4Abemid` | `Step4Abemid.tsx` | 15KB | Etapa 4: Escala ABEMID |
| `Step5Katz` | `Step5Katz.tsx` | 14KB | Etapa 5: Escala KATZ |
| `Step6Responsibilities` | `Step6Responsibilities.tsx` | 16KB | Etapa 6: Segurança |
| `Step7Proposal` | `Step7Proposal.tsx` | 69KB | Etapa 7: Proposta de preço |
| `Step8Evaluator` | `Step8Evaluator.tsx` | 9KB | Etapa 8: Dados do avaliador |
| `Step9KYC` | `Step9KYC.tsx` | 18KB | Etapa 9: Verificação e contrato |

---

## 🏗️ Componentes de Layout (`/components/layout/`)

| Componente | Descrição |
|------------|-----------|
| `Sidebar` | Menu lateral responsivo |
| `PageWrapper` | Wrapper de página com header |

---

## 📊 Componentes de Dashboard (`/components/dashboard/`)

| Componente | Descrição |
|------------|-----------|
| `StatsCard` | Card de estatística |
| `RecentActivity` | Lista de atividades recentes |
| `QuickActions` | Ações rápidas |
| `Overview` | Visão geral do sistema |

---

## 🔗 Componentes Compartilhados (`/components/shared/`)

| Componente | Descrição |
|------------|-----------|
| `QuestionCard` | Card para perguntas do formulário |
| `PageHeader` | Header de página |
| `DataTable` | Tabela de dados |
| `Filters` | Componente de filtros |
| `SearchInput` | Input de busca |

---

## 🏠 Componentes de Portal (`/components/portals/`)

| Componente | Portal | Descrição |
|------------|--------|-----------|
| `ClientDashboard` | Cliente | Dashboard do cliente |
| `CaregiverDashboard` | Cuidador | Dashboard do cuidador |
| `NurseDashboard` | Enfermeiro | Dashboard do enfermeiro |
| `AdminDashboard` | Admin | Dashboard administrativo |
| `AgendaView` | Todos | Visualização de agenda |
| `PatientCard` | Pro | Card de paciente |
| `MessageList` | Todos | Lista de mensagens |
| `ProfileSettings` | Todos | Configurações de perfil |
