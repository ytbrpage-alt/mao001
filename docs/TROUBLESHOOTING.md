# Troubleshooting

## 🔧 Problemas Comuns

### Build falha

#### "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
npm run build
```

#### Erros de TypeScript
```bash
# Verificar tipos
npm run type-check

# Se persistir, verificar versões
npm ls typescript
```

---

### Autenticação

#### "NEXTAUTH_URL is not set"
```env
# .env.local
NEXTAUTH_URL=http://localhost:3000  # Dev
NEXTAUTH_URL=https://seu-dominio.com  # Prod
```

#### "No secret configured"
```bash
# Gerar secret
openssl rand -base64 32
# Adicionar ao .env.local
NEXTAUTH_SECRET=sua-chave-gerada
```

#### "Error in callback" no login
- Verificar GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
- Confirmar redirect URIs no Google Console
- URIs devem incluir `/api/auth/callback/google`

---

### PWA / Offline

#### App não instala como PWA
1. Verificar HTTPS (obrigatório)
2. Checar manifest.json em `/public/manifest.json`
3. Verificar service worker registrado

#### Dados não sincronizam
```javascript
// No console do navegador
localStorage.getItem('maos-amigas-evaluations')
```

#### Limpar cache do PWA
```javascript
// Chrome DevTools > Application > Clear Storage
```

---

### Estado / Zustand

#### Dados perdidos após refresh
- Verificar se `persist` está configurado no store
- Checar localStorage não está bloqueado
- Confirmar `partialize` inclui os campos necessários

#### Idade não calcula
- O store agora auto-calcula idade quando birthDate muda
- Verificar se updatePatient está sendo chamado corretamente

---

### IndexedDB

#### "QuotaExceededError"
```javascript
// Limpar dados antigos
const { clearOldLogs } = await import('@/lib/audit/auditLogger');
await clearOldLogs(30); // Manter só últimos 30 dias
```

#### Dados corrompidos
```javascript
// Resetar IndexedDB (perderá dados!)
indexedDB.deleteDatabase('maos-amigas-db');
indexedDB.deleteDatabase('maos-amigas-audit');
indexedDB.deleteDatabase('maos-amigas-versions');
```

---

### Performance

#### Página lenta para carregar
1. Verificar bundle size: `npm run build` mostra tamanho
2. Verificar se há imports desnecessários
3. Usar lazy loading para componentes pesados

#### Re-renders excessivos
- Usar React DevTools Profiler
- Verificar selectors do Zustand (usar seletores específicos)
- Memorizar callbacks com useCallback

---

### Deploy

#### Vercel: Build timeout
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Docker: Container não inicia
```bash
# Verificar logs
docker logs <container_id>

# Verificar se porta está livre
lsof -i :3000
```

---

## 🔍 Debugging

### Logs de desenvolvimento
```javascript
// Store debug
import { useEvaluationStore } from '@/stores/evaluationStore';
console.log(useEvaluationStore.getState());
```

### Verificar sincronização
```javascript
import { syncService } from '@/lib/sync';
console.log(syncService?.getState());
```

### Verificar auditoria
```javascript
import { getAuditLogs } from '@/lib/audit';
const logs = await getAuditLogs();
console.table(logs);
```

---

## 🆘 Suporte

Se o problema persistir:
1. Verificar Issues no GitHub
2. Criar nova Issue com:
   - Descrição do problema
   - Steps para reproduzir
   - Logs de erro
   - Ambiente (browser, OS, Node version)
