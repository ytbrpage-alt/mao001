# Mãos Amigas - Sistema de Avaliação

Sistema de avaliação para cuidadores domiciliares com foco em compliance LGPD e experiência mobile-first.

## 🚀 Quick Start

```bash
# Clone o repositório
git clone https://github.com/maos-amigas/avaliacao.git
cd avaliacao

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Rode em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📋 Requisitos

- Node.js 18.17+
- npm 9+
- Navegador moderno (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)

## 🏗️ Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 3 |
| Estado | Zustand + persist |
| Validação | Zod |
| Auth | NextAuth.js v5 |
| UI | Radix UI Primitives |
| Ícones | Lucide React |

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Páginas de autenticação
│   ├── api/               # API routes
│   └── avaliacao/         # Páginas de avaliação
├── components/
│   ├── ui/                # Componentes base
│   ├── evaluation/        # Steps de avaliação
│   ├── contract/          # Geração de contrato
│   ├── dashboard/         # Analytics
│   └── shared/            # Componentes compartilhados
├── hooks/                 # Custom hooks
├── lib/
│   ├── analytics/         # Métricas e dashboard
│   ├── audit/             # Logging e versionamento
│   ├── auth/              # Autenticação
│   ├── crypto/            # Criptografia client-side
│   ├── storage/           # IndexedDB
│   ├── sync/              # Sincronização offline
│   ├── utils/             # Utilitários
│   └── validations/       # Schemas Zod
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## 🔐 Variáveis de Ambiente

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API (quando implementado)
API_URL=http://localhost:8080
```

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento com hot-reload |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm test` | Executa testes |

## 🎯 Funcionalidades

### Avaliação em 8 Etapas
1. **Descoberta** - Perfil inicial do cliente
2. **Dados do Paciente** - Informações pessoais
3. **Histórico de Saúde** - Condições e medicamentos
4. **ABEMID** - Escala de complexidade
5. **KATZ** - Índice de independência
6. **Lawton** - Atividades instrumentais
7. **Checklist de Segurança** - Ambiente domiciliar
8. **Cronograma** - Planejamento de cuidados

### Recursos Técnicos
- ✅ PWA com funcionamento offline
- ✅ Sincronização automática
- ✅ Criptografia client-side (AES-256-GCM)
- ✅ Autenticação com NextAuth.js
- ✅ Validação com Zod
- ✅ Logs de auditoria (LGPD)
- ✅ Versionamento de dados
- ✅ Geração de contrato PDF

## 📱 PWA

A aplicação funciona como PWA:
- Instalável no dispositivo
- Funciona 100% offline
- Sincroniza quando online
- Atualização automática

## 🔒 Segurança

- Dados sensíveis criptografados no localStorage
- Autenticação via JWT com refresh tokens
- Rate limiting (5 tentativas / 15 min)
- CSRF protection
- Sanitização de inputs
- Logs de auditoria completos

## 📊 Dashboard

Métricas disponíveis:
- Total de avaliações
- Taxa de conclusão
- Avaliações por mês
- Profissionais mais indicados
- Pontuações médias ABEMID/KATZ

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build
docker build -t maos-amigas-avaliacao .

# Run
docker run -p 3000:3000 maos-amigas-avaliacao
```

## 📖 Documentação Adicional

- [Guia de Deployment](./docs/DEPLOYMENT.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Proprietário - Mãos Amigas © 2026
