# 🔐 Mãos Amigas - Template de Variáveis de Ambiente

> Documentação completa das variáveis de ambiente necessárias

---

## 📋 Resumo

| Categoria | Variáveis | Obrigatórias |
|-----------|-----------|--------------|
| NextAuth.js | 2 | ✅ Sim |
| Google OAuth | 3 | ❌ Opcional |
| Database | 1 | ❌ Prod only |
| Security | 1 | ❌ Prod only |
| Development | 1 | ❌ Opcional |

---

## ⚙️ Variáveis de Ambiente

### 🔑 NextAuth.js (OBRIGATÓRIAS)

| Variável | Obrigatória | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `NEXTAUTH_SECRET` | ✅ Sim | Chave secreta para criptografia de tokens JWT | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ Sim | URL base da aplicação | `http://localhost:3000` |

```bash
# Gerar secret automaticamente:
openssl rand -base64 32
```

---

### 🌐 Google OAuth (Opcional)

| Variável | Obrigatória | Descrição | Onde obter |
|----------|-------------|-----------|------------|
| `GOOGLE_CLIENT_ID` | ❌ | ID do cliente OAuth | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | ❌ | Secret do cliente OAuth | Google Cloud Console |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ❌ | ID público para frontend | Mesmo do GOOGLE_CLIENT_ID |

---

### 🗄️ Database (Produção)

| Variável | Obrigatória | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `DATABASE_URL` | ❌ (Prod) | Connection string PostgreSQL | `postgresql://user:pass@host:5432/db?schema=public` |

**Nota**: O sistema funciona offline com IndexedDB. O banco de dados é necessário apenas para sincronização em produção.

---

### 🔒 Segurança (Produção)

| Variável | Obrigatória | Descrição | Como gerar |
|----------|-------------|-----------|------------|
| `DATA_ENCRYPTION_KEY` | ❌ (Prod) | Chave para criptografia de dados sensíveis | `openssl rand -base64 32` |

---

### 🛠️ Desenvolvimento

| Variável | Obrigatória | Descrição | Valores |
|----------|-------------|-----------|---------|
| `NODE_ENV` | ❌ | Ambiente de execução | `development`, `production`, `test` |

---

## 📝 Template Completo

Copie o conteúdo abaixo para `.env.local`:

```bash
# ============================================
# NEXTAUTH.JS - OBRIGATÓRIAS
# ============================================

# Gerar: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# URL da aplicação
NEXTAUTH_URL=http://localhost:3000

# ============================================
# GOOGLE OAUTH - OPCIONAL
# ============================================
# Obter em: https://console.cloud.google.com/apis/credentials

# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# ============================================
# DATABASE - SOMENTE PRODUÇÃO
# ============================================

# DATABASE_URL=postgresql://user:password@localhost:5432/maos_amigas?schema=public

# ============================================
# SEGURANÇA - PRODUÇÃO
# ============================================

# DATA_ENCRYPTION_KEY=your-encryption-key-here

# ============================================
# DESENVOLVIMENTO
# ============================================

# NODE_ENV=development
```

---

## 🚀 Setup Rápido

### Desenvolvimento Local

```bash
# 1. Copiar template
cp .env.example .env.local

# 2. Gerar secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local

# 3. Definir URL
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

# 4. Iniciar desenvolvimento
npm run dev
```

### Produção

```bash
# Variáveis obrigatórias em produção:
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://seu-dominio.com
DATABASE_URL=postgresql://...
DATA_ENCRYPTION_KEY=<generated-key>
```

---

## ⚠️ Notas de Segurança

- ⛔ **NUNCA** commite `.env.local` no Git
- 🔄 Gere um novo `NEXTAUTH_SECRET` para cada ambiente
- 🔐 Use secrets diferentes para desenvolvimento e produção
- 📝 O `.env.example` contém apenas placeholders, nunca valores reais
