# DTT Web App - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Vercel Postgres recommended)
- TikTok Developer Account

## Installation

1. **Install Dependencies:**
   ```bash
   cd web
   npm install
   ```

2. **Set Up Environment Variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your actual values.

3. **Set Up Database:**
   - Create a Vercel Postgres database (free tier)
   - Copy the connection string to `DATABASE_URL` in `.env.local`
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial web app"
   git push
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

## Features

- ✅ Landing page with TikTok dark theme
- ✅ TikTok OAuth authentication
- ✅ Dashboard with profile & stats
- ✅ Logout functionality
- ⏸️ Discord OAuth linking (Phase 2)
- ⏸️ Full configuration panel (Phase 2)
- ⏸️ Analytics charts (Phase 2)

## Next Steps

1. Set up Vercel Postgres database
2. Configure TikTok OAuth credentials
3. Deploy to Vercel
4. Test OAuth flow
5. Add Discord OAuth (optional)
6. Expand dashboard features
