# LexiGuard Frontend Application

This is the production-ready Next.js frontend designed specifically for the **LexiGuard** n8n AI workflow.

## Features
- **Premium UI:** Glassmorphism design with a dark mode gradient theme.
- **Responsive:** Fully responsive across all devices.
- **Secure Architecture:** Built with Next.js API Routes (`/api/analyze`) to act as a secure proxy. This elegantly solves the "Mixed Content" error by allowing Vercel (HTTPS) to communicate with your EC2 instance (HTTP) securely on the backend without triggering browser blocks.

## 1. Local Development (Testing it out)

To run the application locally on your machine and test it:

1. Open your terminal in this directory (`C:\Users\karur\LexiGuard\lexiguard-app`).
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## 2. Version Control (Pushing to GitHub)

Because this requires your personal GitHub authentication, please run the following commands in your terminal inside the `lexiguard-app` folder:

```bash
# Initialize the repository
git init
git add .
git commit -m "Initial commit: LexiGuard Next.js Frontend"

# Link to your GitHub repository (replace with your actual GitHub username/repo)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lexiguard-frontend.git
git push -u origin main
```

## 3. Production Deployment (Vercel)

Vercel is the creator of Next.js, so deployment is perfectly seamless.

1. Go to [Vercel.com](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New... -> Project**.
3. Import your `lexiguard-frontend` repository from GitHub.
4. Leave all settings as their defaults (Framework Preset: Next.js).
5. Click **Deploy**.

Within 60 seconds, Vercel will provide you with a live, production-ready HTTPS URL for your application!

## How it Connects to your EC2 Instance
If your EC2 IP address ever changes (currently `13.53.216.50`), simply update the `N8N_WEBHOOK_URL` constant inside `src/app/api/analyze/route.ts` and push the code to GitHub. Vercel will automatically redeploy the update!
