# Guia de Deployment

## 🎯 Opções de Deploy

### 1. Vercel (Recomendado)

**Vantagens:** Zero config, preview deployments, CI/CD integrado.

#### Via Dashboard
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure variáveis de ambiente
4. Deploy automático a cada push

#### Via CLI
```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod
```

#### Variáveis de Ambiente no Vercel
```
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=sua-chave-secreta-32-chars
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-secret
```

---

### 2. Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### Build e Run
```bash
# Build imagem
docker build -t maos-amigas-avaliacao .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=sua-chave-secreta \
  maos-amigas-avaliacao
```

#### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    restart: unless-stopped
```

---

### 3. AWS

#### Amplify (Mais simples)
1. Conecte repositório no AWS Amplify Console
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

#### EC2 + PM2
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone e build
git clone <repo>
cd maos-amigas-avaliacao
npm ci
npm run build

# PM2
npm i -g pm2
pm2 start npm --name "maos-amigas" -- start
pm2 save
pm2 startup
```

---

## 🔧 Configuração de Produção

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Para Docker
  poweredByHeader: false, // Security
  compress: true,
  images: {
    domains: ['seu-cdn.com'],
  },
};

module.exports = nextConfig;
```

### Headers de Segurança
```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
];
```

---

## 📋 Checklist de Deploy

### Pré-deploy
- [ ] Todas as variáveis de ambiente configuradas
- [ ] `npm run build` passa sem erros
- [ ] `npm run lint` sem warnings
- [ ] Testes passando
- [ ] NEXTAUTH_SECRET gerado (mín 32 chars)

### Pós-deploy
- [ ] Verificar HTTPS funcionando
- [ ] Testar login/logout
- [ ] Verificar PWA instalável
- [ ] Testar modo offline
- [ ] Verificar sincronização
- [ ] Checar Core Web Vitals

---

## 🔑 Gerando NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📊 Monitoramento

### Vercel Analytics
Habilitado automaticamente em projetos Vercel.

### Sentry (Erros)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Logs
Produção: Use serviços como LogRocket, Datadog ou AWS CloudWatch.
