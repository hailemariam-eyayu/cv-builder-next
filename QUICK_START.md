# Quick Start Guide - CV Builder Pro

Get your CV Builder up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Google/GitHub account for OAuth setup

## Step 1: Install Dependencies

```bash
cd cv-builder
npm install
```

## Step 2: Set Up MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist your IP (or use 0.0.0.0/0 for development)

## Step 3: Configure OAuth

### Google OAuth (5 minutes)

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth credentials
4. Add redirect: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret

### GitHub OAuth (3 minutes)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret

## Step 4: Environment Variables

Create `.env.local` file:

```env
# MongoDB (replace with your connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cv-builder

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-jwt-secret-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate Secrets

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Step 5: Seed Database (Optional)

```bash
npm run seed
```

This creates 3 default templates and an admin user.

## Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Create Your First Account

1. Click "Get Started"
2. Sign up with email or OAuth
3. Create your first CV!

## Making Yourself Admin

After registration, update your role in MongoDB:

```javascript
// In MongoDB Atlas or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Then access admin panel at: [http://localhost:3000/admin](http://localhost:3000/admin)

## Common Issues

### Port 3000 Already in Use

```bash
# Kill the process
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### MongoDB Connection Error

- Check connection string format
- Verify database user credentials
- Ensure IP is whitelisted
- Check network access settings

### OAuth Errors

- Verify redirect URIs match exactly
- Check client ID and secret
- Ensure OAuth app is active
- Clear browser cookies

## Next Steps

1. Explore the CV builder
2. Try different templates
3. Create and export CVs
4. Check out the admin panel
5. Read full documentation

## Need Help?

- Check [INSTALLATION.md](./INSTALLATION.md) for detailed setup
- Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Review [README.md](./README.md) for features overview

## Production Deployment

Ready to deploy? Check out:
- [Vercel Deployment Guide](https://vercel.com/docs)
- Update OAuth redirect URIs to production URL
- Set environment variables in Vercel dashboard

---

Happy building! 🚀
