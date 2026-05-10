# 🌙 Plano de Sono — Atleta PWA

App progressivo (PWA) do plano de sono para atletas. Funciona offline, instalável na tela inicial.

## 📁 Estrutura de arquivos

```
/
├── index.html          ← Página principal (todo o conteúdo)
├── manifest.json       ← Manifesto PWA (nome, ícones, cores)
├── sw.js               ← Service Worker (cache offline)
├── README.md           ← Este arquivo
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    ├── apple-touch-icon.png
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    └── screenshot.png
```

## 🚀 Deploy no GitHub Pages

### Passo 1 — Crie o repositório
1. Acesse [github.com/new](https://github.com/new)
2. Dê um nome ao repositório (ex: `plano-sono-atleta`)
3. Deixe **Public** marcado
4. Clique em **Create repository**

### Passo 2 — Faça upload dos arquivos
**Opção A — Via interface web (mais fácil):**
1. No repositório criado, clique em **Add file → Upload files**
2. Arraste **todos** os arquivos e a pasta `icons/` 
3. Clique em **Commit changes**

**Opção B — Via Git (terminal):**
```bash
git init
git add .
git commit -m "feat: PWA plano de sono atleta"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/plano-sono-atleta.git
git push -u origin main
```

### Passo 3 — Ative o GitHub Pages
1. Vá em **Settings → Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Selecione a branch **main** e pasta **/ (root)**
4. Clique em **Save**

### Passo 4 — Acesse o app
Após 1–2 minutos, seu app estará em:
```
https://SEU_USUARIO.github.io/plano-sono-atleta/
```

## 📱 Instalar no celular

### Android (Chrome)
- Abra a URL no Chrome → menu (⋮) → **"Adicionar à tela inicial"**
- Ou aguarde o banner automático aparecer na página

### iPhone/iPad (Safari)
- Abra a URL no Safari → botão compartilhar (□↑) → **"Adicionar à Tela de Início"**

## ✅ Funcionalidades PWA

| Recurso | Status |
|---------|--------|
| Instalável na tela inicial | ✅ |
| Funciona offline | ✅ |
| Ícones para iOS e Android | ✅ |
| Favicon no browser | ✅ |
| Banner de instalação automático | ✅ |
| Indicador de modo offline | ✅ |
| Atalhos de app (shortcuts) | ✅ |
| Cache inteligente (Stale-While-Revalidate) | ✅ |
| Safe area para iPhones com notch | ✅ |
| Status bar personalizada | ✅ |
