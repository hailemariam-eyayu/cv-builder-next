# Installation Guide - CV Builder Pro

## Quick Start

### 1. Install Dependencies

```bash
cd cv-builder
npm install
```

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" > "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `cv-builder`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cv-builder?retryWrites=true&w=majority
```

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/cv-builder`

### 3. Configure OAuth Providers

#### Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret

#### GitHub OAuth Setup

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" > "New OAuth App"
3. Fill in details:
   - Application name: CV Builder Pro
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy Client ID and generate Client Secret

#### LinkedIn OAuth Setup (Optional)

1. Visit [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in required information
4. In "Auth" tab, add redirect URL:
   - `http://localhost:3000/api/auth/callback/linkedin`
5. Copy Client ID and Client Secret

### 4. Create Environment File

Create `.env.local` in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cv-builder?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# LinkedIn OAuth (Optional)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# JWT Secret
JWT_SECRET=your-jwt-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Generate Secrets

Generate secure secrets for NEXTAUTH_SECRET and JWT_SECRET:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Admin User

After first user registration, manually update the user role in MongoDB:

```javascript
// In MongoDB Atlas or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub repository

2. Go to [Vercel](https://vercel.com)

3. Click "Import Project"

4. Select your GitHub repository

5. Add environment variables in Vercel dashboard

6. Update OAuth redirect URIs to production URL

7. Deploy

### Environment Variables for Production

Update these in your production environment:

```env
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Update OAuth callback URLs:
- Google: `https://your-domain.com/api/auth/callback/google`
- GitHub: `https://your-domain.com/api/auth/callback/github`
- LinkedIn: `https://your-domain.com/api/auth/callback/linkedin`

## Troubleshooting

### MongoDB Connection Issues

- Verify connection string format
- Check database user permissions
- Whitelist IP address in MongoDB Atlas
- Ensure network access is configured

### OAuth Errors

- Verify redirect URIs match exactly
- Check client ID and secret are correct
- Ensure OAuth app is not in development mode (for production)
- Clear browser cookies and try again

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Testing

### Test Authentication

1. Register with email/password
2. Sign out and sign in
3. Test Google OAuth
4. Test GitHub OAuth

### Test CV Builder

1. Create new CV
2. Add components via toolbar
3. Drag and reorder components
4. Edit component content
5. Save CV
6. View in dashboard

### Test Admin Panel

1. Set user role to admin in database
2. Access `/admin` route
3. View users list
4. Create and approve templates

## Next Steps

- Customize templates
- Add more component types
- Implement PDF export
- Set up email notifications
- Configure analytics

## Support

For issues, check:
- [GitHub Issues](https://github.com/your-repo/issues)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth Documentation](https://next-auth.js.org/)
