# 🌙 Plano de Sono — Atleta 17 Anos (PWA)

Web App progressivo (PWA) completo, pronto para GitHub Pages.

## 📁 Estrutura de arquivos

```
plano-sono-pwa/
├── index.html          ← Página principal (conteúdo completo + PWA tags)
├── manifest.json       ← Manifesto do app (nome, ícones, cores, display)
├── sw.js               ← Service Worker (cache offline + atualização)
└── icons/
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png   ← iOS "Adicionar à tela inicial"
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png       ← Windows tile
    ├── icon-152x152.png
    ├── icon-180x180.png
    ├── icon-192x192.png       ← Android Chrome mínimo
    ├── icon-384x384.png
    └── icon-512x512.png       ← Splash screen / install prompt
```

## 🚀 Como publicar no GitHub Pages

### Opção A — Repositório dedicado (mais simples)

1. Crie um repositório no GitHub (ex: `plano-sono`)
2. Faça upload de **todos os arquivos** mantendo a estrutura de pastas
3. Vá em **Settings → Pages**
4. Em *Source*, selecione **Deploy from a branch**
5. Escolha a branch `main` e a pasta `/ (root)`
6. Clique em **Save**
7. Seu app estará em: `https://seu-usuario.github.io/plano-sono/`

### Opção B — Via Git (linha de comando)

```bash
cd plano-sono-pwa
git init
git add .
git commit -m "feat: PWA Plano de Sono"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/plano-sono.git
git push -u origin main
```

Depois ative o GitHub Pages nas configurações do repositório.

---

## ✅ Funcionalidades PWA incluídas

| Recurso | Detalhe |
|---|---|
| **Instalável** | Banner automático no Android/Chrome; instrução manual no iOS |
| **Offline** | Service Worker com cache estratégico — funciona sem internet após 1º acesso |
| **Favicon** | 16×16 e 32×32 para browsers desktop |
| **Apple Touch Icon** | 180×180 para "Adicionar à tela inicial" no iPhone/iPad |
| **Ícones Android** | 192×192 e 512×512 (mínimo exigido pelo Chrome) |
| **Splash screen** | Cor de fundo `#07090f` com tema `#c4b5fd` durante abertura |
| **Status bar iOS** | `black-translucent` — integra com a tela toda |
| **Indicador offline** | Barra vermelha discreta quando sem conexão |
| **Shortcut** | Atalho direto para "Protocolo Champions" no menu do app |

## 🎨 Paleta de cores (baseada na imagem)

- **Fundo:** `#07090f` — preto profundo
- **Tema/Destaque:** `#c4b5fd` — lilás (moon)
- **Accent:** `#4a9eff` azul · `#fbbf24` amarelo · `#34d399` verde

---

> App baseado no protocolo de sono de atletas profissionais.  
> Ciência do sono + Protocolo CR7 + Protocolo CBF/Seleção.
