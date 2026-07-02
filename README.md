<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="100" height="100" alt="LexiGuard Logo">
  <h1>🛡️ LexiGuard</h1>
  <p><strong>AI-Powered Terms & Conditions Analysis Platform</strong></p>
  
  [![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](#)
  [![React](https://img.shields.io/badge/Frontend-React_18-blue?logo=react)](#)
  [![n8n](https://img.shields.io/badge/Backend-n8n_Workflow-ff6600?logo=n8n)](#)
  [![AI](https://img.shields.io/badge/AI_Engine-Google_Gemini-4285F4?logo=google)](#)
</div>

---

## 📖 Overview

**LexiGuard** is an intelligent assistant designed to protect consumers by instantly analyzing long, complex Terms & Conditions (T&C) documents. Simply upload a PDF of the agreement, ask a question (e.g., *"Can they sell my data?"* or *"Is this fair?"*), and LexiGuard will extract the exact clauses and explain them in simple, everyday language.

## ✨ Features

- 📄 **Client-Side PDF Parsing:** Securely extracts text from PDFs directly in the browser using Mozilla's `pdfjs-dist`, preventing server memory crashes.
- 🧠 **Multi-Agent AI Routing:** Uses a specialized Intent Classifier Agent to route your request to the best AI model (Summary, Fairness Audit, or Specific Concern).
- ⚡ **Resilient Architecture:** Features an automated 20-attempt retry mechanism to ensure you always get an answer, even if the backend is under heavy load.
- 🎨 **Beautiful UI:** A clean, glassmorphism-inspired interface with seamless markdown rendering for AI responses.

## 🏗️ Architecture

LexiGuard is built with a highly decoupled modern stack:

1. **Frontend (Vercel):** React + Vite application that handles UI, client-side PDF text extraction, and resilient backend polling.
2. **API Gateway (Vercel Serverless):** A lightweight proxy (`api/analyze.js`) that securely forwards requests to the private AWS infrastructure.
3. **Backend Engine (AWS EC2 + n8n):** An automated workflow orchestrator running on an EC2 instance that dynamically triggers LangChain AI Agents.
4. **AI Models (Google Gemini 2.5 Flash):** Performs the heavy lifting of semantic understanding and intent classification.

---

## 🚀 Getting Started

### 1. Frontend Setup
The frontend is built with React and Vite.

```bash
# Navigate to the app directory
cd lexiguard-app

# Install dependencies
npm install

# Run the local development server
npm run dev
```

### 2. Backend Setup
LexiGuard's backend relies on an active **n8n** instance with the LexiGuard workflow imported.
1. Start your n8n instance (e.g., on AWS EC2).
2. Import the `workflow_details.json` (or manually configure the Webhook trigger to point to `/webhook/LexiGuard`).
3. Ensure your Google Gemini API credentials are valid inside n8n.

### 3. Vercel Deployment
To deploy this project to Vercel:
1. Push this repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. Set the **Root Directory** in Vercel to `lexiguard-app`.
4. Deploy!

## 🛠️ Built With
- **React.js** - Frontend UI library
- **Vite** - Build tool
- **pdfjs-dist** - Client-side PDF text extraction
- **React Markdown** - Beautiful LLM response formatting
- **n8n** - Backend workflow automation
- **Google Gemini** - Generative AI Models

## 🛡️ License
This project is open-source and available under the MIT License.
