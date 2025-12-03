# 🔑 Environment Variables You Need to Provide

## Required Variables for `.env.local`

Copy this template and fill in your actual values:

```env
# ============================================
# 1. DATABASE (REQUIRED)
# ============================================
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/cv-builder?retryWrites=true&w=majority

# ============================================
# 2. NEXTAUTH CONFIGURATION (REQUIRED)
# ============================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_HERE

# ============================================
# 3. GOOGLE OAUTH (REQUIRED)
# ============================================
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# ============================================
# 4. GITHUB OAUTH (REQUIRED)
# ============================================
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET

# ============================================
# 5. LINKEDIN OAUTH (OPTIONAL)
# ============================================
LINKEDIN_CLIENT_ID=YOUR_LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET=YOUR_LINKEDIN_CLIENT_SECRET

# ============================================
# 6. JWT SECRET (REQUIRED)
# ============================================
JWT_SECRET=YOUR_JWT_SECRET_HERE

# ============================================
# 7. APP URL (REQUIRED)
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📋 Detailed Breakdown

### 1️⃣ MONGODB_URI (Database Connection)

**What it is:** Connection string to your MongoDB database

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/cv-builder?retryWrites=true&w=majority
```

**How to get it:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 (free) cluster
4. Create database user with password
5. Click "Connect" → "Connect your application"
6. Copy connection string
7. Replace `<password>` with your database password
8. Replace `<dbname>` with `cv-builder`

**Example:**
```
mongodb+srv://myuser:MyP@ssw0rd123@cluster0.abc123.mongodb.net/cv-builder?retryWrites=true&w=majority
```

---

### 2️⃣ NEXTAUTH_URL

**What it is:** Your application URL

**Value for local development:**
```
http://localhost:3000
```

**Value for production:**
```
https://yourdomain.com
```

---

### 3️⃣ NEXTAUTH_SECRET

**What it is:** Secret key for encrypting session tokens

**How to generate:**

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Example output:**
```
Kd8fJ2mN9pQ3rT5vW7xY0zA1bC4eF6gH8iJ0kL2mN4oP
```

---

### 4️⃣ GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET

**What they are:** Credentials for Google OAuth login

**How to get them:**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create Project**
   - Click "Select a project" → "New Project"
   - Name: "CV Builder"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - User Type: External
   - App name: CV Builder
   - User support email: your email
   - Developer contact: your email
   - Save and continue

5. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "CV Builder Web"
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

6. **Copy Credentials**
   - Client ID: `123456789-abc123def456.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-abc123def456ghi789`

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
```

---

### 5️⃣ GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET

**What they are:** Credentials for GitHub OAuth login

**How to get them:**

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Register Application**
   - Application name: `CV Builder`
   - Homepage URL: `http://localhost:3000`
   - Application description: `Professional CV Builder`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Click "Register application"

3. **Copy Credentials**
   - Client ID: `Iv1.abc123def456`
   - Click "Generate a new client secret"
   - Client Secret: `abc123def456ghi789jkl012mno345`

**Example:**
```env
GITHUB_CLIENT_ID=Iv1.abc123def456
GITHUB_CLIENT_SECRET=abc123def456ghi789jkl012mno345
```

---

### 6️⃣ LINKEDIN_CLIENT_ID & LINKEDIN_CLIENT_SECRET (Optional)

**What they are:** Credentials for LinkedIn OAuth login

**How to get them:**

1. **Go to LinkedIn Developers**
   - Visit: https://www.linkedin.com/developers/apps
   - Click "Create app"

2. **Create Application**
   - App name: CV Builder
   - LinkedIn Page: Create or select a page
   - Click "Create app"

3. **Configure OAuth**
   - Go to "Auth" tab
   - Redirect URLs: Add `http://localhost:3000/api/auth/callback/linkedin`
   - Click "Update"

4. **Copy Credentials**
   - Client ID: `abc123def456`
   - Client Secret: `xyz789uvw012`

**Example:**
```env
LINKEDIN_CLIENT_ID=abc123def456
LINKEDIN_CLIENT_SECRET=xyz789uvw012
```

**Note:** LinkedIn OAuth is optional. The app works without it.

---

### 7️⃣ JWT_SECRET

**What it is:** Secret key for JWT token encryption

**How to generate:**

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Example output:**
```
Pq9rS2tU4vW6xY8zA0bC1dE3fG5hI7jK9lM1nO3pQ5rS
```

---

### 8️⃣ NEXT_PUBLIC_APP_URL

**What it is:** Public URL of your application

**Value for local development:**
```
http://localhost:3000
```

**Value for production:**
```
https://yourdomain.com
```

---

## ✅ Quick Checklist

Before running the app, make sure you have:

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created (M0 free tier)
- [ ] Database user created with password
- [ ] IP address whitelisted (0.0.0.0/0 for development)
- [ ] MongoDB connection string copied
- [ ] Google Cloud project created
- [ ] Google OAuth credentials obtained
- [ ] GitHub OAuth app created
- [ ] GitHub OAuth credentials obtained
- [ ] NEXTAUTH_SECRET generated
- [ ] JWT_SECRET generated
- [ ] All values added to `.env.local`

---

## 🚀 After Adding All Variables

1. **Save the `.env.local` file**

2. **Restart the development server:**
   - Stop current server (Ctrl + C)
   - Run: `npm run dev`

3. **Test the application:**
   - Open: http://localhost:3000
   - Try signing up with email
   - Try Google OAuth login
   - Try GitHub OAuth login
   - Create a CV
   - Test all features

---

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check username and password are correct
- Verify IP is whitelisted (0.0.0.0/0)
- Check connection string format
- Ensure database name is `cv-builder`

### OAuth Errors
- Verify redirect URIs match exactly
- Check Client ID and Secret are correct
- Restart server after changing `.env.local`
- Clear browser cookies

### "Invalid credentials" Error
- Check all secrets are generated correctly
- Verify no extra spaces in values
- Ensure file is named exactly `.env.local`

---

## 📝 Example Complete `.env.local`

Here's what a complete file looks like (with fake values):

```env
# Database
MONGODB_URI=mongodb+srv://cvbuilder:MySecurePass123@cluster0.abc123.mongodb.net/cv-builder?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Kd8fJ2mN9pQ3rT5vW7xY0zA1bC4eF6gH8iJ0kL2mN4oP

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.abc123def456
GITHUB_CLIENT_SECRET=abc123def456ghi789jkl012mno345

# LinkedIn OAuth (Optional)
LINKEDIN_CLIENT_ID=abc123def456
LINKEDIN_CLIENT_SECRET=xyz789uvw012

# JWT
JWT_SECRET=Pq9rS2tU4vW6xY8zA0bC1dE3fG5hI7jK9lM1nO3pQ5rS

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 Priority Order

If you want to get started quickly, configure in this order:

1. **MONGODB_URI** (Required for database)
2. **NEXTAUTH_SECRET** (Required for auth)
3. **JWT_SECRET** (Required for tokens)
4. **GOOGLE_CLIENT_ID & SECRET** (For Google login)
5. **GITHUB_CLIENT_ID & SECRET** (For GitHub login)
6. **LINKEDIN** (Optional, can skip)

---

**Once all variables are set, your CV Builder will be fully functional!** 🎉
