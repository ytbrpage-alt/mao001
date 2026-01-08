# 🗺️ Mãos Amigas - Mapa de Páginas e Rotas

> Documentação completa de todas as rotas do sistema

---

## 📊 Resumo das Rotas

```
Total de Rotas: 28
├── Públicas: 3
├── Autenticadas: 25
│   ├── Admin: 1
│   ├── Avaliador: 4
│   ├── Cliente: 5
│   └── Profissional: 15
```

---

## 🏠 Rotas Públicas

| Rota | Arquivo | Descrição | Auth |
|------|---------|-----------|------|
| `/` | `app/page.tsx` | Landing page principal | Pública |
| `/login` | `app/(auth)/login/page.tsx` | Tela de login | Pública |
| `/registro` | `app/(auth)/registro/page.tsx` | Cadastro de usuário | Pública |

---

## 🔐 Rotas Autenticadas

### 📋 Módulo de Avaliação

| Rota | Arquivo | Descrição | Roles |
|------|---------|-----------|-------|
| `/avaliacao` | `app/avaliacao/page.tsx` | Lista de avaliações | Avaliador |
| `/avaliacao/nova` | `app/avaliacao/nova/page.tsx` | Iniciar nova avaliação | Avaliador |
| `/avaliacao/[id]` | `app/avaliacao/[id]/page.tsx` | Avaliação em progresso | Avaliador |
| `/avaliacao/[id]/pdf` | `app/avaliacao/[id]/pdf/page.tsx` | Gerar PDF da avaliação | Avaliador |

### 👨‍💼 Portal Admin

| Rota | Arquivo | Descrição | Roles |
|------|---------|-----------|-------|
| `/admin` | `app/(portals)/admin/page.tsx` | Dashboard administrativo | Admin |
| `/usuarios` | `app/(admin)/usuarios/page.tsx` | Gerenciamento de usuários | Admin |

### 👨‍👩‍👧 Portal Cliente

| Rota | Arquivo | Descrição | Roles |
|------|---------|-----------|-------|
| `/cliente` | `app/(portals)/cliente/page.tsx` | Dashboard do cliente | Cliente |
| `/cliente/agenda` | `app/(portals)/cliente/agenda/page.tsx` | Calendário de atendimentos | Cliente |
| `/cliente/mensagens` | `app/(portals)/cliente/mensagens/page.tsx` | Chat com equipe | Cliente |
| `/cliente/paciente` | `app/(portals)/cliente/paciente/page.tsx` | Dados do paciente | Cliente |

### 🩺 Portal Profissional - Cuidador

| Rota | Arquivo | Descrição | Roles |
|------|---------|-----------|-------|
| `/pro/cuidador` | `app/(portals)/pro/cuidador/page.tsx` | Dashboard cuidador | Cuidador |
| `/pro/cuidador/agenda` | `app/(portals)/pro/cuidador/agenda/page.tsx` | Agenda de plantões | Cuidador |
| `/pro/cuidador/pacientes` | `app/(portals)/pro/cuidador/pacientes/page.tsx` | Lista de pacientes | Cuidador |
| `/pro/cuidador/relatorios` | `app/(portals)/pro/cuidador/relatorios/page.tsx` | Relatórios | Cuidador |
| `/pro/cuidador/mensagens` | `app/(portals)/pro/cuidador/mensagens/page.tsx` | Chat | Cuidador |

### 🏥 Portal Profissional - Enfermeiro

| Rota | Arquivo | Descrição | Roles |
|------|---------|-----------|-------|
| `/pro/enfermeiro` | `app/(portals)/pro/enfermeiro/page.tsx` | Dashboard enfermeiro | Enfermeiro |
| `/pro/enfermeiro/agenda` | `app/(portals)/pro/enfermeiro/agenda/page.tsx` | Agenda de plantões | Enfermeiro |
| `/pro/enfermeiro/pacientes` | `app/(portals)/pro/enfermeiro/pacientes/page.tsx` | Lista de pacientes | Enfermeiro |
| `/pro/enfermeiro/procedimentos` | `app/(portals)/pro/enfermeiro/procedimentos/page.tsx` | Procedimentos técnicos | Enfermeiro |
| `/pro/enfermeiro/mensagens` | `app/(portals)/pro/enfermeiro/mensagens/page.tsx` | Chat | Enfermeiro |

---

## 🔄 Fluxo de Navegação

```mermaid
flowchart TD
    subgraph Público
        A[/ Landing Page] --> B[/login]
        B --> C{Autenticado?}
        C -->|Não| B
        C -->|Sim| D{Role?}
    end

    subgraph Portais
        D -->|Admin| E[/admin]
        D -->|Avaliador| F[/avaliacao]
        D -->|Cliente| G[/cliente]
        D -->|Cuidador| H[/pro/cuidador]
        D -->|Enfermeiro| I[/pro/enfermeiro]
    end

    subgraph Avaliação
        F --> J[/avaliacao/nova]
        J --> K[Step 1: Discovery]
        K --> L[Step 2: Patient]
        L --> M[Step 3: Health]
        M --> N[Step 4: ABEMID]
        N --> O[Step 5: KATZ]
        O --> P[Step 6: Safety]
        P --> Q[Step 7: Proposal]
        Q --> R[Step 8: Evaluator]
        R --> S[Step 9: KYC]
        S --> T[PDF/Contract]
    end
```

---

## 📱 Layouts Aplicados

| Layout | Aplicado em | Descrição |
|--------|-------------|-----------|
| `RootLayout` | Todas as páginas | Theme provider, fonts |
| `PortalLayout` | `/cliente/*`, `/pro/*` | Header, Sidebar, BottomNav |
| `AdminLayout` | `/admin/*` | Admin sidebar, breadcrumbs |
| `AuthLayout` | `/login`, `/registro` | Layout limpo para auth |
| `EvaluationLayout` | `/avaliacao/[id]/*` | Progress bar, step navigation |

---

## 🛡️ Middleware de Proteção

```typescript
// src/middleware.ts
// Protege rotas baseado em roles

const PROTECTED_ROUTES = {
  '/admin': ['admin'],
  '/avaliacao': ['admin', 'evaluator'],
  '/cliente': ['admin', 'client'],
  '/pro/cuidador': ['admin', 'caregiver'],
  '/pro/enfermeiro': ['admin', 'nurse'],
};
```

---

## 📐 Parâmetros Dinâmicos

| Rota | Parâmetro | Tipo | Descrição |
|------|-----------|------|-----------|
| `/avaliacao/[id]` | `id` | UUID | ID da avaliação |
| `/avaliacao/[id]/pdf` | `id` | UUID | ID da avaliação |
