# 🚀 Vercel Deployment Guide

## Project Name: cv-deploy

---

## 📋 Environment Variables for Vercel

Copy and paste these **exact values** into Vercel's Environment Variables section:

### **1. Database**
```
MONGODB_URI
```
Value:
```
mongodb+srv://cv-build:cv-build@cv-builder.pcxrkv7.mongodb.net/?retryWrites=true&w=majority&appName=cv-builder
```

---

### **2. NextAuth URL** (Update after deployment)
```
NEXTAUTH_URL
```
Value (temporary - update after getting Vercel URL):
```
https://cv-deploy.vercel.app
```

---

### **3. NextAuth Secret**
```
NEXTAUTH_SECRET
```
Value:
```
ui/i77T9CLO0slE4R7szpHY0F2nkdkG3okNlskWTtfY=
```

---

### **4. GitHub OAuth (Production)**
```
GITHUB_CLIENT_ID
```
Value: `[Use your GitHub production Client ID]`

```
GITHUB_CLIENT_SECRET
```
Value: `[Use your GitHub production Client Secret]`

**GitHub Callback URL to add:**
After deployment, go to GitHub OAuth settings and add:
```
https://your-actual-vercel-url.vercel.app/api/auth/callback/github
```

---

### **5. LinkedIn OAuth (Production)**
```
LINKEDIN_CLIENT_ID
```
Value: `[Use your LinkedIn production Client ID]`

```
LINKEDIN_CLIENT_SECRET
```
Value: `[Use your LinkedIn production Client Secret]`

**LinkedIn Callback URL to add:**
After deployment, go to LinkedIn Developer Portal and add:
```
https://your-actual-vercel-url.vercel.app/api/auth/callback/linkedin
```

---

### **6. JWT Secret**
```
JWT_SECRET
```
Value:
```
HDb9TBoies8Qwkyx2vAuIBg8bz1J/sS65n6uLz7Ta+4=
```

---

### **7. App URL** (Update after deployment)
```
NEXT_PUBLIC_APP_URL
```
Value (temporary - update after getting Vercel URL):
```
https://cv-deploy.vercel.app
```

---

## 🔧 Step-by-Step Deployment

### **Step 1: Push to GitHub**
```bash
cd cv-builder
git add .
git commit -m "Production ready with LinkedIn OAuth"
git push origin main
```

### **Step 2: Import to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `hailemariam-eyayu/cv-builder-next`
4. Project name: `cv-deploy`

### **Step 3: Add Environment Variables**
In Vercel dashboard, go to **Settings → Environment Variables**

Add all 7 variables listed above (copy-paste the exact values)

### **Step 4: Deploy**
Click **"Deploy"**

Wait for deployment to complete (~2-3 minutes)

### **Step 5: Get Your Vercel URL**
After deployment, you'll get a URL like:
```
https://cv-deploy-abc123.vercel.app
```

### **Step 6: Update Environment Variables**
Go back to **Settings → Environment Variables** and update:

1. **NEXTAUTH_URL** → Your actual Vercel URL
2. **NEXT_PUBLIC_APP_URL** → Your actual Vercel URL

Then **redeploy** (Deployments → click "..." → Redeploy)

### **Step 7: Update OAuth Redirect URIs**

#### **GitHub:**
1. Go to: https://github.com/settings/developers
2. Find your OAuth App
3. Add Authorization callback URL:
   ```
   https://your-actual-vercel-url.vercel.app/api/auth/callback/github
   ```

#### **LinkedIn:**
1. Go to: https://www.linkedin.com/developers/apps
2. Find your app (Client ID: 7840l12y9h1xol)
3. Go to **Auth** tab
4. Add Redirect URL:
   ```
   https://your-actual-vercel-url.vercel.app/api/auth/callback/linkedin
   ```

### **Step 8: Test Your Deployment**
1. Visit your Vercel URL
2. Try signing up with email
3. Try GitHub OAuth login
4. Try LinkedIn OAuth login
5. Create a CV
6. Test all features

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] All 7 environment variables added
- [ ] First deployment successful
- [ ] Vercel URL obtained
- [ ] NEXTAUTH_URL updated with real URL
- [ ] NEXT_PUBLIC_APP_URL updated with real URL
- [ ] Redeployed after URL updates
- [ ] GitHub OAuth callback URL added
- [ ] LinkedIn OAuth callback URL added
- [ ] Tested email registration
- [ ] Tested GitHub login
- [ ] Tested LinkedIn login
- [ ] Tested CV creation

---

## 🐛 Troubleshooting

### **OAuth Not Working**
✅ Check redirect URIs in provider dashboards  
✅ Verify NEXTAUTH_URL matches your Vercel URL  
✅ Clear browser cookies and try again

### **Database Connection Error**
✅ Check MONGODB_URI is correct  
✅ Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### **Environment Variables Not Loading**
✅ Redeploy after adding/changing variables  
✅ Check variable names are exact (case-sensitive)  
✅ No extra spaces in values

### **Build Errors**
✅ Check build logs in Vercel dashboard  
✅ Verify all dependencies are in package.json  
✅ Check for TypeScript errors

---

## 📊 What's Enabled in Production

✅ **Email/Password** - Registration and login  
✅ **GitHub OAuth** - Social login  
✅ **LinkedIn OAuth** - Social login  
❌ **Google OAuth** - Disabled (daily limit reached)

---

## 🔄 To Enable Google OAuth Later

When Google OAuth is available:

1. Add to Vercel environment variables:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

2. Add redirect URI in Google Cloud Console:
   ```
   https://your-vercel-url.vercel.app/api/auth/callback/google
   ```

3. Uncomment Google button in:
   - `app/auth/signin/page.tsx`
   - `app/auth/signup/page.tsx`

4. Redeploy

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **NextAuth Docs:** https://next-auth.js.org/
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/

---

**Your app is ready for production deployment!** 🎉
