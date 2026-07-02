# LexiGuard React Application (Vite)

This is the production-ready Vite frontend designed specifically for the **LexiGuard** n8n AI workflow.

## Features
- **Premium UI:** Glassmorphism design with a dark mode gradient theme.
- **Responsive:** Fully responsive across all devices.
- **Secure Architecture:** Built with Vite for the frontend, but utilizes **Vercel Serverless Functions** (`api/analyze.js`) to act as a secure proxy. This elegantly solves the "Mixed Content" error by allowing Vercel (HTTPS) to communicate with your EC2 instance (HTTP) securely on the backend without triggering browser blocks.

## 1. Local Development (Testing it out)

To run the application locally on your machine and test it:

1. Open your terminal in this directory (`C:\Users\karur\LexiGuard\lexiguard-app`).
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## 2. Production Deployment (Vercel)

1. Go to [Vercel.com](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New... -> Project**.
3. Import your `LexiGuard` repository from GitHub.
4. Set the **Root Directory** to `lexiguard-app`.
5. Vercel will automatically detect the **Vite** framework.
6. Click **Deploy**.

Within 60 seconds, Vercel will provide you with a live, production-ready HTTPS URL for your application!

## How it Connects to your EC2 Instance
If your EC2 IP address ever changes (currently `13.53.216.50`), simply update the `N8N_WEBHOOK_URL` constant inside `api/analyze.js` (and `vite.config.ts` for local testing) and push the code to GitHub. Vercel will automatically redeploy the update!
