# GrammarGuru 🎓

AI-powered language learning app for English and German.  
Built with React + Vite, deployed on Vercel.

---

## Features

- ✏️ Fill in the Blank exercises
- 🔗 Word Matching
- 📖 Reading Comprehension  
- 🎯 CEFR Placement Test
- 🇩🇪 Artikel Game (12 levels, German only)
- 🎙️ Conversation Practice with voice input

---

## Deploy to Vercel (one-time setup ~10 minutes)

### Step 1 — Get your Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Click **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

### Step 2 — Push to GitHub
1. Create a new repo at [github.com/new](https://github.com/new)  
   Name it `grammar-guru`, keep it **Private**
2. Open a terminal in this folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/grammar-guru.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub** (free)
2. Click **Add New → Project**
3. Import your `grammar-guru` repo
4. Under **Environment Variables**, add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-your-key-here`
5. Click **Deploy**

✅ Your app is live at `https://grammar-guru-xxx.vercel.app`

---

## Updating the app

Every time you make changes in Claude and download a new `grammar-guru.jsx`:

1. Replace `src/App.jsx` with the new file
2. Run:
```bash
git add .
git commit -m "Update app"
git push
```
Vercel auto-deploys in ~30 seconds. Your customers see the update immediately.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your real API key
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project structure

```
grammar-guru/
├── api/
│   └── chat.js          ← Vercel serverless proxy (keeps API key safe)
├── src/
│   ├── main.jsx         ← React entry point
│   └── App.jsx          ← The full app (edit this when updating)
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```
