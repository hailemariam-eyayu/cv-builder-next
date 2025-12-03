# 🚀 Setup Checklist - Run Locally

Follow these steps to get your CV Builder running on localhost.

## ✅ Step 1: Dependencies (DONE)

```bash
cd cv-builder
npm install --legacy-peer-deps
```

**Status:** ✅ Already completed - All packages installed successfully!

---

## 📝 Step 2: Configure Environment Variables

### Create/Edit `.env.local` file

The file already exists at `cv-builder/.env.local`. Update it with your credentials:

```env
# Database - REQUIRED
MONGODB_URI=mongodb+srv://[username]:[password]@cluster.mongodb.net/cv-builder?retryWrites=true&w=majority

# NextAuth - REQUIRED
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth - REQUIRED
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth - REQUIRED
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# LinkedIn OAuth - OPTIONAL
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# JWT - REQUIRED
JWT_SECRET=your-jwt-secret-key

# App URL - REQUIRED
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate Secrets

**For NEXTAUTH_SECRET and JWT_SECRET:**

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Run this command twice to generate both secrets.

---

## 🗄️ Step 3: Set Up MongoDB Atlas

### 3.1 Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project

### 3.2 Create Cluster
1. Click "Build a Database"
2. Choose **FREE** M0 tier
3. Select region closest to you
4. Click "Create Cluster"

### 3.3 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `cvbuilder` (or your choice)
5. Password: Generate strong password
6. User Privileges: "Read and write to any database"
7. Click "Add User"

### 3.4 Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs
5. Click "Confirm"

### 3.5 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `cv-builder`

Example:
```
mongodb+srv://cvbuilder:YourPassword123@cluster0.xxxxx.mongodb.net/cv-builder?retryWrites=true&w=majority
```

6. Paste this into `.env.local` as `MONGODB_URI`

---

## 🔐 Step 4: Set Up OAuth Providers

### 4.1 Google OAuth

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Sign in with Google account

2. **Create Project**
   - Click "Select a project" → "New Project"
   - Name: "CV Builder"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Configure consent screen if prompted:
     - User Type: External
     - App name: CV Builder
     - User support email: your email
     - Developer contact: your email
     - Save and continue through all steps
   
5. **Configure OAuth Client**
   - Application type: "Web application"
   - Name: "CV Builder Web"
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

6. **Copy Credentials**
   - Copy "Client ID" → paste into `.env.local` as `GOOGLE_CLIENT_ID`
   - Copy "Client Secret" → paste into `.env.local` as `GOOGLE_CLIENT_SECRET`

---

### 4.2 GitHub OAuth

1. **Go to GitHub Settings**
   - Visit [github.com/settings/developers](https://github.com/settings/developers)
   - Click "OAuth Apps" → "New OAuth App"

2. **Register Application**
   - Application name: `CV Builder`
   - Homepage URL: `http://localhost:3000`
   - Application description: `Professional CV Builder`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Click "Register application"

3. **Copy Credentials**
   - Copy "Client ID" → paste into `.env.local` as `GITHUB_CLIENT_ID`
   - Click "Generate a new client secret"
   - Copy "Client Secret" → paste into `.env.local` as `GITHUB_CLIENT_SECRET`

---

### 4.3 LinkedIn OAuth (Optional)

1. **Go to LinkedIn Developers**
   - Visit [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
   - Click "Create app"

2. **Create Application**
   - App name: CV Builder
   - LinkedIn Page: Create or select a page
   - App logo: Upload logo (optional)
   - Click "Create app"

3. **Configure OAuth**
   - Go to "Auth" tab
   - Redirect URLs: Add `http://localhost:3000/api/auth/callback/linkedin`
   - Click "Update"

4. **Copy Credentials**
   - Copy "Client ID" → paste into `.env.local` as `LINKEDIN_CLIENT_ID`
   - Copy "Client Secret" → paste into `.env.local` as `LINKEDIN_CLIENT_SECRET`

---

## 🌱 Step 5: Seed Database (Optional)

This creates 3 default templates and an admin user.

```bash
npm run seed
```

**Expected Output:**
```
Connected to database
No admin user found. Creating default admin...
Admin user created. Email: admin@cvbuilder.com
Cleared existing templates
Created template: Modern Professional
Created template: Creative Designer
Created template: Minimalist

Seeding completed successfully!
Total templates created: 3
```

---

## 🚀 Step 6: Run Development Server

```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

---

## 🌐 Step 7: Open Application

Open your browser and visit:

**🏠 Homepage:** [http://localhost:3000](http://localhost:3000)

You should see the landing page with:
- "Build Your Perfect CV in Minutes" heading
- Sign In / Get Started buttons
- Feature cards

---

## 🧪 Step 8: Test the Application

### 8.1 Create Account

1. Click "Get Started" or "Sign Up"
2. **Option A: Email/Password**
   - Enter name, email, password
   - Click "Sign Up"
   
3. **Option B: OAuth**
   - Click "Continue with Google" or "Continue with GitHub"
   - Authorize the application

### 8.2 Create Your First CV

1. After login, you'll be redirected to Dashboard
2. Click "Create New CV"
3. You'll see the CV Builder with:
   - Component toolbar on the left
   - Canvas in the center
4. Click components to add them:
   - Add "Heading" → Edit to add your name
   - Add "Contact" → Edit to add email/phone
   - Add "Experience" → Edit to add work history
5. Drag components to reorder
6. Click "Save CV"

### 8.3 Test Dashboard

1. Go back to Dashboard
2. You should see your saved CV
3. Try:
   - Edit button → Opens builder
   - Delete button → Removes CV
   - Create another CV

### 8.4 Test Admin Panel (Optional)

1. **Make yourself admin:**
   - Open MongoDB Atlas
   - Go to "Browse Collections"
   - Find `users` collection
   - Find your user by email
   - Click "Edit"
   - Change `role` from `"user"` to `"admin"`
   - Click "Update"

2. **Access Admin Panel:**
   - Refresh the page
   - You should see "Admin Panel" button in navbar
   - Click it to access admin features
   - View users and templates

---

## ✅ Verification Checklist

Check off each item as you complete it:

- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file configured with all variables
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP address whitelisted
- [ ] MongoDB connection string added to `.env.local`
- [ ] Google OAuth credentials obtained and added
- [ ] GitHub OAuth credentials obtained and added
- [ ] Secrets generated (NEXTAUTH_SECRET, JWT_SECRET)
- [ ] Database seeded (optional: `npm run seed`)
- [ ] Development server running (`npm run dev`)
- [ ] Application opens at http://localhost:3000
- [ ] Can create account (email or OAuth)
- [ ] Can create CV
- [ ] Can save and view CV in dashboard
- [ ] Admin panel accessible (if admin role set)

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### MongoDB Connection Error

**Error:** `MongoServerError: bad auth`
- Check username and password in connection string
- Verify database user exists in MongoDB Atlas
- Check user has correct permissions

**Error:** `MongooseServerSelectionError`
- Check IP is whitelisted (0.0.0.0/0 for development)
- Verify connection string format
- Check internet connection

### OAuth Errors

**Error:** `redirect_uri_mismatch`
- Verify redirect URI in OAuth app matches exactly: `http://localhost:3000/api/auth/callback/google`
- No trailing slash
- Check http vs https

**Error:** `invalid_client`
- Check Client ID and Secret are correct
- Verify they're in `.env.local`
- Restart dev server after changing `.env.local`

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run dev
```

### Environment Variables Not Loading

- Restart development server after changing `.env.local`
- Check file is named exactly `.env.local` (not `.env` or `.env.development`)
- Verify no extra spaces in variable values

---

## 📞 Need Help?

### Quick References
- **Setup Issues:** Check INSTALLATION.md
- **API Questions:** Check API_DOCUMENTATION.md
- **Features:** Check FEATURES_CHECKLIST.md
- **Deployment:** Check DEPLOYMENT.md

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Run linter
npm run lint
```

---

## 🎉 Success!

Once you see the landing page and can create an account, you're all set!

**Next Steps:**
1. Create your first CV
2. Explore the drag-and-drop editor
3. Try different templates
4. Test admin features
5. Customize the application

**Happy Building!** 🚀
