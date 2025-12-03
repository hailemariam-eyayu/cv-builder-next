# 🌍 Environment Setup Guide

## Overview

This project uses different environment variables for **local development** and **production (cloud)** deployment.

---

## 📁 Environment Files

### **1. `.env.local` (Local Development)**
- Used when running `npm run dev` on your computer
- Not committed to Git (in `.gitignore`)
- Uses `localhost:3000`

### **2. `.env.production` (Production/Cloud)**
- Used when deployed to Vercel or other cloud platforms
- Not committed to Git (in `.gitignore`)
- Uses your production domain

### **3. `.env.example` (Template)**
- Template file showing what variables are needed
- Committed to Git
- Safe to share (no real credentials)

---

## 🔧 Setup Instructions

### **For Local Development:**

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your local settings:**
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # ... other variables
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

---

### **For Production (Vercel):**

**Option 1: Use Vercel Dashboard (Recommended)**

1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add each variable from `.env.production.example`
4. Update URLs to your Vercel domain

**Option 2: Use Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_URL
# ... add all variables
```

---

## 🔑 Key Differences Between Environments

| Variable | Local | Production |
|----------|-------|------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |
| `MONGODB_URI` | Same | Same |
| OAuth Secrets | Same | Same |

---

## 🎯 Current Setup

### **Local Development (`.env.local`):**
```env
# Database
MONGODB_URI=mongodb+srv://cv-build:cv-build@cv-builder.pcxrkv7.mongodb.net/?retryWrites=true&w=majority&appName=cv-builder

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ui/i77T9CLO0slE4R7szpHY0F2nkdkG3okNlskWTtfY=

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# JWT
JWT_SECRET=HDb9TBoies8Qwkyx2vAuIBg8bz1J/sS65n6uLz7Ta+4=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Production (Vercel Environment Variables):**
```env
# Same as above, but change these:
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🔐 OAuth Redirect URIs

You need to add **both** local and production URLs to your OAuth apps:

### **Google Cloud Console:**
Authorized redirect URIs:
- `http://localhost:3000/api/auth/callback/google` (local)
- `https://your-app.vercel.app/api/auth/callback/google` (production)

### **GitHub OAuth Settings:**
Authorization callback URLs:
- `http://localhost:3000/api/auth/callback/github` (local)
- `https://your-app.vercel.app/api/auth/callback/github` (production)

### **LinkedIn Developer Portal:**
Redirect URLs:
- `http://localhost:3000/api/auth/callback/linkedin` (local)
- `https://your-app.vercel.app/api/auth/callback/linkedin` (production)

---

## 🚀 Deployment Workflow

### **Step 1: Test Locally**
```bash
npm run dev
# Test at http://localhost:3000
```

### **Step 2: Push to GitHub**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### **Step 3: Deploy to Vercel**
1. Vercel auto-deploys from GitHub
2. Or manually: `vercel --prod`

### **Step 4: Update OAuth Redirect URIs**
- Add production URLs to all OAuth providers

### **Step 5: Test Production**
- Visit your Vercel URL
- Test all OAuth logins

---

## 🛠️ Troubleshooting

### **OAuth Not Working in Production**
✅ Check redirect URIs include production URL  
✅ Verify `NEXTAUTH_URL` is set to production URL  
✅ Clear browser cookies and try again

### **Database Connection Issues**
✅ Check `MONGODB_URI` is correct  
✅ Verify IP whitelist includes `0.0.0.0/0`  
✅ Test connection with `node test-db-connection.js`

### **Environment Variables Not Loading**
✅ Restart dev server after changing `.env.local`  
✅ In Vercel, redeploy after adding variables  
✅ Check variable names match exactly (case-sensitive)

---

## 📋 Checklist

### **Local Development:**
- [ ] `.env.local` file created
- [ ] All variables filled in
- [ ] OAuth redirect URIs include `localhost:3000`
- [ ] Server runs with `npm run dev`
- [ ] Can login with all OAuth providers

### **Production Deployment:**
- [ ] Environment variables added to Vercel
- [ ] `NEXTAUTH_URL` updated to production URL
- [ ] `NEXT_PUBLIC_APP_URL` updated to production URL
- [ ] OAuth redirect URIs include production URL
- [ ] Deployed successfully
- [ ] Can login with all OAuth providers

---

## 🎯 Quick Reference

### **Local:**
```bash
# Start local server
npm run dev

# Test at
http://localhost:3000
```

### **Production:**
```bash
# Deploy to Vercel
git push origin main
# Or
vercel --prod

# Test at
https://your-app.vercel.app
```

---

## 📞 Need Help?

- **Local issues:** Check `.env.local` file
- **Production issues:** Check Vercel environment variables
- **OAuth issues:** Verify redirect URIs in provider dashboards
- **Database issues:** Check MongoDB Atlas network access

---

**Remember:** Never commit `.env.local` or `.env.production` to Git! They contain sensitive credentials.
