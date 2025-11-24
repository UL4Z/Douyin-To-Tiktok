# DTT Web App - MVP Deployment Guide

## ✅ What's Been Built

### Frontend (Next.js)
- ✅ Landing page with TikTok dark theme
- ✅ Hero section with features showcase
- ✅ Dashboard page (profile + stats)
- ✅ TailwindCSS with custom TikTok colors
- ✅ Responsive design

### Backend (Flask)
- ✅ OAuth callback endpoint (existing)
- ✅ Logout API endpoint
- ✅ Profile API endpoint (placeholder)

### Discord Bot
- ✅ Disconnect button in OAuth menu
- ✅ Clears tokens and profile data

## 🚀 Quick Deploy to Vercel

### 1. Install Dependencies
```bash
cd c:\DTT\web
npm install
```

### 2. Test Locally
```bash
npm run dev
```
Visit `http://localhost:3000`

### 3. Deploy to Vercel

**Option A: Via GitHub (Recommended)**
```bash
# In c:\DTT\web directory
git init
git add .
git commit -m "Initial web app"
git remote add origin https://github.com/yourusername/dtt-web.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
cd c:\DTT\web
npx vercel
```
Follow the prompts.

### 4. Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:
```
API_URL=https://your-callback-endpoint.vercel.app
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=https://your-web-app.vercel.app/auth/tiktok/callback
```

### 5. Redeploy
After adding environment variables, trigger a new deployment.

## 📋 Next Steps (Phase 2)

### To Complete Full Functionality:
1. **Set up PostgreSQL database** (Vercel Postgres)
2. **Implement TikTok OAuth flow** for web
3. **Connect dashboard to real data**
4. **Add Discord OAuth** for account linking
5. **Build configuration pages**
6. **Add analytics charts**

### Estimated Time:
- Database setup: 2-3 hours
- OAuth implementation: 3-4 hours
- Dashboard features: 5-6 hours
- **Total Phase 2:** ~10-13 hours

## 🎯 Current MVP Features

✅ **Working:**
- Landing page
- TikTok dark theme
- Basic dashboard layout
- Logout button (bot)

⏸️ **Needs Database (Phase 2):**
- TikTok OAuth login
- Real profile data
- Analytics
- Configuration

## 📝 File Structure

```
web/
├── app/
│   ├── page.tsx (Landing page)
│   ├── dashboard/page.tsx (Dashboard)
│   ├── layout.tsx (Root layout)
│   └── globals.css (Styles)
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🔧 Customization

### Change Colors:
Edit `tailwind.config.js`:
```js
colors: {
  tiktok: {
    cyan: '#00f2ea',  // Change these
    pink: '#ff0050',
  },
}
```

### Update Content:
- Landing page: `app/page.tsx`
- Dashboard: `app/dashboard/page.tsx`

## 💡 Tips

1. **Free Hosting:** Vercel is free for personal projects
2. **Auto-Deploy:** Connect GitHub for automatic deployments on push
3. **Custom Domain:** Add your own domain in Vercel settings
4. **Analytics:** Vercel provides built-in analytics

## 🐛 Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
Check that all TypeScript files are valid. Run:
```bash
npm run build
```

**Can't access dashboard:**
Dashboard requires authentication (Phase 2). For now, it shows placeholder data.

## 📞 Support

Need help with Phase 2 implementation? The foundation is ready - just need to connect the database and OAuth!
