# Contributing

Obrigado por considerar contribuir com o Mãos Amigas! 🙌

## 🚀 Setup de Desenvolvimento

```bash
# Fork e clone
git clone https://github.com/seu-usuario/maos-amigas-avaliacao.git
cd maos-amigas-avaliacao

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local

# Rodar em desenvolvimento
npm run dev
```

## 📋 Workflow

### 1. Criar branch
```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

### 2. Desenvolver
- Siga os padrões de código existentes
- Adicione testes quando aplicável
- Mantenha commits atômicos

### 3. Commit
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona validação de CPF
fix: corrige cálculo de idade
docs: atualiza README
refactor: refatora componente Step2Patient
test: adiciona testes para auditoria
```

### 4. Pull Request
- Descreva as mudanças claramente
- Referencie issues relacionadas
- Aguarde review

## 🎨 Padrões de Código

### TypeScript
- Tipar TUDO explicitamente
- Usar interfaces para objetos
- Evitar `any`

### React
- Componentes funcionais
- Custom hooks para lógica reutilizável
- Memoização quando necessário

### CSS
- Tailwind CSS
- Design tokens do sistema
- Mobile-first

## 🧪 Testes

```bash
# Rodar testes
npm test

# Com coverage
npm run test:coverage
```

## 📝 Checklist PR

- [ ] Código segue padrões do projeto
- [ ] Testes passando
- [ ] Sem erros de lint
- [ ] Documentação atualizada (se aplicável)
- [ ] PR descreve as mudanças
