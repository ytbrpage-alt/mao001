# 📋 Mãos Amigas - Project Overview

> **Sistema de Avaliação Domiciliar para Cuidadores**  
> Versão 1.0.0 | Next.js 14 + React 18 + TypeScript

---

## 🎯 Resumo Executivo

Sistema web **mobile-first** para avaliação domiciliar de pacientes que necessitam de cuidadores. O sistema implementa uma jornada de descoberta em **10 etapas** que coleta dados do paciente, aplica escalas clínicas (ABEMID, KATZ), calcula precificação dinâmica e gera contratos automaticamente.

### Principais Características
- 🏠 **PWA Offline-First** com sincronização automática
- 📱 **Design Mobile-First** responsivo
- 🌙 **Dark Mode** com WCAG 2.2 AA/AAA
- 🔐 **Autenticação Multi-Role** (Admin, Avaliador, Cliente)
- 📄 **Geração de PDF/Contratos** automática
- ✍️ **Assinatura Digital** integrada

---

## 🛠️ Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND                                                    │
├─────────────────────────────────────────────────────────────┤
│ Framework:     Next.js 14.1 (App Router)                    │
│ UI Library:    React 18.2                                   │
│ Language:      TypeScript 5.3                               │
│ Styling:       Tailwind CSS 3.4 + CSS Variables             │
│ State:         Zustand 4.5 (6 stores)                       │
│ Forms:         React Hook Form 7.50 + Zod 3.22              │
│ Animations:    Framer Motion 11.0                           │
│ Icons:         Lucide React 0.330                           │
│ UI Primitives: Radix UI (Accordion, Dialog, Select, etc.)   │
├─────────────────────────────────────────────────────────────┤
│ FEATURES                                                    │
├─────────────────────────────────────────────────────────────┤
│ PDF:           jsPDF 2.5 + html2canvas 1.4                  │
│ Auth:          NextAuth.js 4.24                             │
│ Storage:       IndexedDB (idb 8.0)                          │
│ Crypto:        bcryptjs 3.0 + Web Crypto API                │
│ Dates:         date-fns 3.3                                 │
│ Signature:     react-signature-canvas 1.0                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Arquitetura de Pastas

```
maos-amigas-avaliacao/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (admin)/            # Rotas administrativas
│   │   ├── 📁 (auth)/             # Rotas de autenticação
│   │   ├── 📁 (portals)/          # Portais por role
│   │   │   ├── 📁 admin/          # Portal administrador
│   │   │   ├── 📁 cliente/        # Portal família/cliente
│   │   │   └── 📁 pro/            # Portal profissional
│   │   │       ├── 📁 cuidador/   # Sub-portal cuidador
│   │   │       └── 📁 enfermeiro/ # Sub-portal enfermeiro
│   │   ├── 📁 api/                # API Routes
│   │   ├── 📁 avaliacao/          # Fluxo de avaliação
│   │   │   ├── 📁 [id]/           # Avaliação dinâmica
│   │   │   └── 📁 nova/           # Nova avaliação
│   │   ├── layout.tsx             # Layout raiz
│   │   └── page.tsx               # Landing page
│   │
│   ├── 📁 components/             # 71 componentes
│   │   ├── 📁 ui/                 # 27 componentes UI base
│   │   ├── 📁 evaluation/         # 10 steps de avaliação
│   │   ├── 📁 dashboard/          # Componentes dashboard
│   │   ├── 📁 portals/            # Componentes por portal
│   │   ├── 📁 layout/             # Header, Sidebar, etc.
│   │   └── 📁 shared/             # Componentes compartilhados
│   │
│   ├── 📁 contexts/               # 4 React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── EvaluationContext.tsx
│   │   ├── OfflineContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── 📁 stores/                 # 6 Zustand Stores
│   │   ├── authStore.ts           # Autenticação (25KB)
│   │   ├── auditStore.ts          # Audit Trail (22KB)
│   │   ├── evaluationStore.ts     # Avaliações (23KB)
│   │   ├── chatStore.ts           # Mensagens (15KB)
│   │   ├── notificationStore.ts   # Notificações (5KB)
│   │   └── syncStore.ts           # Sincronização (10KB)
│   │
│   ├── 📁 hooks/                  # 9 Custom Hooks
│   ├── 📁 lib/                    # 48 arquivos utilitários
│   │   ├── 📁 calculations/       # Calculadoras (ABEMID, KATZ, Pricing)
│   │   ├── 📁 auth/               # Lógica de autenticação
│   │   ├── 📁 crypto/             # Criptografia e hashing
│   │   ├── 📁 schemas/            # Schemas Zod
│   │   ├── 📁 security/           # Segurança e sanitização
│   │   ├── 📁 sync/               # Sincronização offline
│   │   └── 📁 validations/        # Validadores (CPF, etc.)
│   │
│   ├── 📁 types/                  # 23 arquivos de tipos
│   ├── 📁 styles/                 # Design System
│   │   ├── globals.css            # Estilos globais
│   │   └── 📁 tokens/             # CSS Custom Properties
│   │
│   └── middleware.ts              # Middleware de auth/proteção
│
├── 📁 docs/                       # Documentação
├── 📁 public/                     # Assets estáticos
├── tailwind.config.ts             # Config Tailwind (12KB)
├── next.config.js                 # Config Next.js
├── tsconfig.json                  # Config TypeScript
└── package.json                   # Dependências
```

---

## 👥 Roles e Portais

| Role | Portal | Funcionalidades |
|------|--------|-----------------|
| **Admin** | `/admin/*` | Gerenciamento de usuários, auditoria, configurações |
| **Avaliador** | `/avaliacao/*` | Conduzir avaliações, gerar propostas |
| **Cliente** | `/cliente/*` | Ver agenda, mensagens, dados do paciente |
| **Cuidador** | `/pro/cuidador/*` | Agenda, pacientes, relatórios |
| **Enfermeiro** | `/pro/enfermeiro/*` | Agenda, pacientes, procedimentos |

---

## 📊 Métricas do Projeto

| Métrica | Valor |
|---------|-------|
| Arquivos TypeScript | 197 |
| Componentes React | 71 |
| Páginas/Rotas | 28 |
| Tipos TypeScript | 163 exports |
| Zustand Stores | 6 |
| Custom Hooks | 9 |
| Dependências Prod | 22 |
| Dependências Dev | 12 |

---

## 🔗 Links Úteis

- [Mapa de Páginas](./PAGES-MAP.md)
- [Lista de Funcionalidades](./FEATURES-LIST.md)
- [Catálogo de Componentes](./COMPONENTS-CATALOG.md)
- [Modelos de Dados](./DATA-MODELS.md)
