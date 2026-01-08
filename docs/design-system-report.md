# 🎨 Design System Report - Mãos Amigas

> **Gerado em:** 2026-01-08  
> **Versão:** 1.0  
> **Arquitetura:** Enterprise Dark Mode (Linear, Notion, Vercel inspired)

---

## 📑 Índice

1. [Etapa 1: Dark Mode](#etapa-1-dark-mode)
2. [Etapa 2: Light Mode](#etapa-2-light-mode)
3. [Etapa 3: Tipografia](#etapa-3-tipografia)
4. [Etapa 4: Análise de Legibilidade](#etapa-4-análise-de-legibilidade)
5. [Etapa 5: Componentes](#etapa-5-componentes)

---

# Etapa 1: Dark Mode

## 1.1 Cores de Fundo (Backgrounds)

| Token | Uso | HEX | RGB | HSL |
|-------|-----|-----|-----|-----|
| `--color-bg` | Body, App background | `#0F0F12` | `rgb(15, 15, 18)` | `hsl(240, 9%, 6%)` |
| `--color-bg-elevated` | Cards, Modais | `#16161A` | `rgb(22, 22, 26)` | `hsl(240, 8%, 9%)` |
| `--color-bg-surface` | Hover states | `#1C1C21` | `rgb(28, 28, 33)` | `hsl(240, 8%, 12%)` |
| `--color-bg-muted` | Inputs, Wells | `#24242B` | `rgb(36, 36, 43)` | `hsl(240, 9%, 15%)` |
| `dark-hover` | Hover interativo | `rgba(255,255,255,0.05)` | - | - |
| `dark-pressed` | Estado pressionado | `rgba(255,255,255,0.12)` | - | - |

## 1.2 Cores de Texto

| Token | Uso | HEX | RGB | HSL | Contraste* |
|-------|-----|-----|-----|-----|------------|
| `--color-text` | Primário (headings) | `#F5F5F8` | `rgb(245, 245, 248)` | `hsl(240, 20%, 97%)` | ✅ 18.1:1 |
| `--color-text-secondary` | Labels, descrições | `#C4C4CC` | `rgb(196, 196, 204)` | `hsl(240, 8%, 78%)` | ✅ 10.2:1 |
| `--color-text-tertiary` | Placeholders, hints | `#9898A3` | `rgb(152, 152, 163)` | `hsl(240, 6%, 62%)` | ✅ 5.8:1 |
| Disabled | Texto inativo | `#71717A` | `rgb(113, 113, 122)` | `hsl(240, 4%, 46%)` | ⚠️ 4.1:1 |

> *Contraste calculado contra background `#0F0F12`

## 1.3 Cores de Interface

| Token | Uso | HEX | RGB |
|-------|-----|-----|-----|
| `--color-border` | Bordas principais | `#2E2E36` | `rgb(46, 46, 54)` |
| `--color-border-subtle` | Bordas sutis | `#232329` | `rgb(35, 35, 41)` |
| `dark-border-strong` | Bordas de destaque | `#3D3D47` | `rgb(61, 61, 71)` |
| `modal-overlay` | Backdrop modais | `rgba(0,0,0,0.75)` | - |
| `shadow-dark-soft` | Sombras suaves | `0 1px 3px rgba(0,0,0,0.5)` | - |
| `shadow-dark-glow` | Borda luminosa | `0 0 0 1px rgba(255,255,255,0.05)` | - |

## 1.4 Cores Funcionais

### Brand (Primária)

| Estado | HEX | RGB | HSL |
|--------|-----|-----|-----|
| Base | `#1E8AAD` | `rgb(30, 138, 173)` | `hsl(195, 70%, 40%)` |
| Hover | `#47BFD7` | `rgb(71, 191, 215)` | `hsl(190, 63%, 56%)` |
| Active | `#186E8A` | `rgb(24, 110, 138)` | `hsl(195, 70%, 32%)` |
| Glow | `rgba(30, 138, 173, 0.5)` | - | - |

### Status Colors (Dark Mode)

| Status | Cor | HEX | Background |
|--------|-----|-----|------------|
| ✅ Success | Texto | `#34D399` | `rgba(16, 185, 129, 0.15)` |
| ⚠️ Warning | Texto | `#FBBF24` | `rgba(245, 158, 11, 0.15)` |
| ❌ Danger | Texto | `#F87171` | `rgba(239, 68, 68, 0.15)` |
| ℹ️ Info | Texto | `#47BFD7` | `rgba(30, 138, 173, 0.15)` |

---

# Etapa 2: Light Mode

## 2.1 Cores de Fundo (Backgrounds)

| Token | Uso | HEX | RGB | HSL |
|-------|-----|-----|-----|-----|
| `--color-bg` | Body, App | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` |
| `--color-bg-elevated` | Cards | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` |
| `--color-bg-surface` | Hover states | `#FAFAFA` | `rgb(250, 250, 250)` | `hsl(0, 0%, 98%)` |
| `--color-bg-muted` | Inputs | `#F4F4F5` | `rgb(244, 244, 245)` | `hsl(240, 5%, 96%)` |

## 2.2 Cores de Texto

| Token | Uso | HEX | RGB | HSL | Contraste* |
|-------|-----|-----|-----|-----|------------|
| `--color-text` | Primário | `#18181B` | `rgb(24, 24, 27)` | `hsl(240, 6%, 10%)` | ✅ 19.4:1 |
| `--color-text-secondary` | Secundário | `#52525B` | `rgb(82, 82, 91)` | `hsl(240, 5%, 34%)` | ✅ 7.5:1 |
| `--color-text-tertiary` | Terciário | `#A1A1AA` | `rgb(161, 161, 170)` | `hsl(240, 5%, 65%)` | ✅ 3.4:1 |

> *Contraste calculado contra background `#FFFFFF`

## 2.3 Cores de Interface

| Token | Uso | HEX | RGB |
|-------|-----|-----|-----|
| `--color-border` | Bordas | `#E4E4E7` | `rgb(228, 228, 231)` |
| `--color-border-subtle` | Bordas sutis | `#F4F4F5` | `rgb(244, 244, 245)` |
| `border-strong` | Destaque | `#D4D4D8` | `rgb(212, 212, 216)` |
| `modal-overlay` | Backdrop | `rgba(0,0,0,0.5)` | - |

## 2.4 Cores Funcionais

### Brand Palette (Completa)

| Shade | HEX | RGB | Uso |
|-------|-----|-----|-----|
| 50 | `#E8F7FA` | `rgb(232, 247, 250)` | Backgrounds sutis |
| 100 | `#D1EFF5` | `rgb(209, 239, 245)` | Hover leve |
| 200 | `#A3DFEB` | `rgb(163, 223, 235)` | Badges info |
| 300 | `#75CFE1` | `rgb(117, 207, 225)` | - |
| 400 | `#47BFD7` | `rgb(71, 191, 215)` | Hover buttons |
| **500** | `#1E8AAD` | `rgb(30, 138, 173)` | **Primária** |
| 600 | `#186E8A` | `rgb(24, 110, 138)` | Active |
| 700 | `#125268` | `rgb(18, 82, 104)` | - |
| 800 | `#0C3745` | `rgb(12, 55, 69)` | - |
| 900 | `#061B23` | `rgb(6, 27, 35)` | - |

### Success Palette

| Shade | HEX | Uso |
|-------|-----|-----|
| 50 | `#ECFDF5` | Background |
| 100 | `#D1FAE5` | Badges |
| 500 | `#10B981` | Ícones, texto |
| 600 | `#059669` | Botões |
| 700 | `#047857` | Hover |

### Warning Palette

| Shade | HEX | Uso |
|-------|-----|-----|
| 50 | `#FFFBEB` | Background |
| 100 | `#FEF3C7` | Badges |
| 500 | `#F59E0B` | Ícones |
| 600 | `#D97706` | Botões |
| 700 | `#B45309` | Hover |

### Danger Palette

| Shade | HEX | Uso |
|-------|-----|-----|
| 50 | `#FEF2F2` | Background |
| 100 | `#FEE2E2` | Badges |
| 500 | `#EF4444` | Ícones |
| 600 | `#DC2626` | Botões |
| 700 | `#B91C1C` | Hover |

---

# Etapa 3: Tipografia

## Font Families

| Tipo | Família | Fallbacks |
|------|---------|-----------|
| Primária | Sistema (Inter expected) | `-apple-system, BlinkMacSystemFont, sans-serif` |
| Monospace | Sistema | `ui-monospace, monospace` |

## Escala de Tamanhos

| Token | Size | Line Height | Uso |
|-------|------|-------------|-----|
| `xs` | 0.75rem (12px) | 1rem | Captions |
| `sm` | 0.875rem (14px) | 1.25rem | Labels, helper text |
| `base` | 1rem (16px) | 1.5rem | Body text |
| `lg` | 1.125rem (18px) | 1.75rem | Subtitles |
| `xl` | 1.25rem (20px) | 1.75rem | Headings |
| `2xl` | 1.5rem (24px) | 2rem | H3 |
| `3xl` | 1.875rem (30px) | 2.25rem | H2 |
| `4xl` | 2.25rem (36px) | 2.5rem | H1 |
| `5xl` | 3rem (48px) | 1 | Display |

## Font Weights

| Weight | Valor | Uso |
|--------|-------|-----|
| Normal | 400 | Body text |
| Medium | 500 | Labels |
| Semibold | 600 | Buttons, headings |
| Bold | 700 | Emphasis |

---

# Etapa 4: Análise de Legibilidade

## ⚠️ Problemas Identificados (Dark Mode)

| Elemento | Cor Atual | Background | Ratio | WCAG | Correção Sugerida |
|----------|-----------|------------|-------|------|-------------------|
| Texto disabled | `#71717A` | `#0F0F12` | 4.1:1 | ⚠️ AA Large | `#8A8A94` (4.8:1) |
| Placeholder input | `#71717A` | `#16161A` | 3.7:1 | ❌ Falha | `#9898A3` (5.2:1) |
| Text tertiary em cards | `#9898A3` | `#24242B` | 4.3:1 | ⚠️ AA Large | `#A8A8B3` (5.1:1) |

## ✅ Elementos Aprovados (Dark Mode)

| Elemento | Ratio | Status |
|----------|-------|--------|
| Texto primário | 18.1:1 | ✅ AAA |
| Texto secundário | 10.2:1 | ✅ AAA |
| Brand-400 em bg-elevated | 6.8:1 | ✅ AA |
| Success text | 8.3:1 | ✅ AAA |
| Warning text | 11.2:1 | ✅ AAA |
| Danger text | 7.1:1 | ✅ AA |

## ⚠️ Problemas Identificados (Light Mode)

| Elemento | Cor Atual | Background | Ratio | WCAG | Correção Sugerida |
|----------|-----------|------------|-------|------|-------------------|
| Text tertiary | `#A1A1AA` | `#FFFFFF` | 3.4:1 | ❌ Falha | `#717179` (4.6:1) |
| Placeholder | `#A1A1AA` | `#F4F4F5` | 2.9:1 | ❌ Falha | `#6B6B73` (5.0:1) |

---

# Etapa 5: Componentes

## Botões

| Variante | Background | Texto | Border | Dark Override |
|----------|------------|-------|--------|---------------|
| Primary | `brand-500` | white | - | Glow effect |
| Secondary | `neutral-100` | `neutral-900` | - | `rgba(255,255,255,0.05)` |
| Ghost | transparent | `neutral-700` | - | `rgba(255,255,255,0.05)` hover |
| Danger | `danger-500` | white | - | `danger-600` |
| Outline | transparent | `brand-600` | `brand-500` | `brand-400` text |

## Tamanhos de Botão

| Size | Min Height | Padding |
|------|------------|---------|
| sm | 36px | px-3 py-1.5 |
| md | 44px | px-4 py-2.5 |
| lg | 52px | px-6 py-3.5 |
| icon | 44px | p-2.5 |

## Cards

| Variante | Background | Border | Shadow |
|----------|------------|--------|--------|
| Default | `bg-elevated` | `border-subtle` | - |
| Outlined | white | `neutral-300` 2px | - |
| Elevated | white | `neutral-100` | `shadow-lg` |
| Interactive | + hover state | - | `shadow-md` hover |

## Badges

| Variante | Bg Light | Text Light | Bg Dark | Text Dark |
|----------|----------|------------|---------|-----------|
| Success | `success-100` | `success-700` | `rgba(16,185,129,0.15)` | `#34D399` |
| Warning | `warning-100` | `warning-700` | `rgba(251,191,36,0.15)` | `#FBBF24` |
| Danger | `danger-100` | `danger-700` | `rgba(248,113,113,0.15)` | `#F87171` |
| Info | `brand-100` | `brand-700` | `rgba(30,138,173,0.15)` | `#47BFD7` |
| Neutral | `neutral-100` | `neutral-700` | `rgba(255,255,255,0.1)` | `#A1A1AA` |

## Inputs

| Estado | Border Light | Border Dark | Focus Ring |
|--------|--------------|-------------|------------|
| Default | `neutral-300` | `#2E2E36` | `brand-500` |
| Error | `danger-500` | `danger-500` | `danger-500` |
| Success | `success-500` | `success-500` | `success-500` |
| Disabled | `neutral-200` | - | - |

---

# Apêndice: Espaçamentos

## Spacing Scale

| Token | Valor | Uso |
|-------|-------|-----|
| touch | 44px | Touch targets mínimos |
| touch-lg | 48px | Botões grandes |
| touch-xl | 56px | CTAs principais |

## Border Radius

| Token | Valor |
|-------|-------|
| sm | 6px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| 2xl | 20px |
| 3xl | 24px |
| full | 9999px |

## Z-Index Layers

| Token | Valor | Uso |
|-------|-------|-----|
| 10 | 10 | Elementos elevados |
| 20 | 20 | Dropdowns |
| 30 | 30 | Sticky headers |
| 40 | 40 | Modais overlay |
| 50 | 50 | Modais content |
| 60-100 | 60-100 | Toasts, tooltips |

## Breakpoints

| Token | Valor | Tipo |
|-------|-------|------|
| xs | 375px | min-width |
| sm | 640px | min-width |
| md | 768px | min-width |
| lg | 1024px | min-width |
| xl | 1280px | min-width |
| 2xl | 1536px | min-width |
| mobile | max-639px | max-width |
| tablet | 640px-1023px | range |
| desktop | min-1024px | min-width |

---

> 📁 **Arquivos relacionados:**
> - [tokens-dark.json](./tokens-dark.json)
> - [tokens-light.json](./tokens-light.json)
> - [tokens-unified.json](./tokens-unified.json)
> - [preview.html](./preview.html)
