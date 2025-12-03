# ⚡ Quick Reference Card

## 🚀 Start Development Server

```bash
cd cv-builder
npm run dev
```

Then open: **http://localhost:3000**

---

## 📋 Essential Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run seed` | Seed database with templates |
| `npm run lint` | Run ESLint |

---

## 🔑 Environment Variables Required

Create/edit `.env.local` with:

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl
GOOGLE_CLIENT_ID=from-google-console
GOOGLE_CLIENT_SECRET=from-google-console
GITHUB_CLIENT_ID=from-github-settings
GITHUB_CLIENT_SECRET=from-github-settings
JWT_SECRET=generate-with-openssl
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate secrets:**
```powershell
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 🗄️ MongoDB Setup (5 min)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (for development)
5. Get connection string
6. Add to `.env.local`

---

## 🔐 OAuth Setup

### Google (5 min)
1. [console.cloud.google.com](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth credentials
4. Redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID & Secret to `.env.local`

### GitHub (3 min)
1. [github.com/settings/developers](https://github.com/settings/developers)
2. New OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID & Secret to `.env.local`

---

## 🌐 Application URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:3000 |
| Sign In | http://localhost:3000/auth/signin |
| Sign Up | http://localhost:3000/auth/signup |
| Dashboard | http://localhost:3000/dashboard |
| CV Builder | http://localhost:3000/builder/new |
| Admin Panel | http://localhost:3000/admin |

---

## 📁 Project Structure

```
cv-builder/
├── app/
│   ├── api/              ← Backend API routes
│   ├── auth/             ← Auth pages
│   ├── dashboard/        ← User dashboard
│   ├── builder/          ← CV builder
│   └── admin/            ← Admin panel
├── components/           ← React components
├── lib/
│   ├── models/          ← Database models
│   ├── db.ts            ← MongoDB connection
│   └── auth.ts          ← NextAuth config
└── Documentation files   ← 11 guides
```

---

## 🔧 Troubleshooting

### Port in use
```bash
npx kill-port 3000
```

### MongoDB connection error
- Check connection string
- Verify IP whitelist (0.0.0.0/0)
- Check database user credentials

### OAuth error
- Verify redirect URIs match exactly
- Restart server after changing `.env.local`
- Check Client ID/Secret are correct

### Clear cache
```bash
rm -rf .next
npm run dev
```

---

## 👤 Make User Admin

1. Open MongoDB Atlas
2. Browse Collections → `users`
3. Find your user by email
4. Edit: Change `role` from `"user"` to `"admin"`
5. Refresh application

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **START_HERE.md** | Quick start guide |
| **SETUP_CHECKLIST.md** | Step-by-step setup |
| **QUICK_START.md** | 5-minute setup |
| **README.md** | Full overview |
| **INSTALLATION.md** | Detailed setup |
| **API_DOCUMENTATION.md** | API reference |
| **ARCHITECTURE.md** | System design |
| **DEPLOYMENT.md** | Deploy guide |
| **FEATURES_CHECKLIST.md** | Feature list |

---

## 🎯 First Steps After Setup

1. ✅ Run `npm run dev`
2. ✅ Open http://localhost:3000
3. ✅ Sign up (email or OAuth)
4. ✅ Create your first CV
5. ✅ Explore dashboard
6. ✅ Make yourself admin (optional)
7. ✅ Access admin panel

---

## 🔌 API Endpoints

### Public
- `POST /api/auth/register` - Register user
- `POST /api/auth/[...nextauth]` - Auth handlers

### Protected (User)
- `GET /api/cv` - List CVs
- `POST /api/cv` - Create CV
- `GET /api/cv/[id]` - Get CV
- `PUT /api/cv/[id]` - Update CV
- `DELETE /api/cv/[id]` - Delete CV
- `GET /api/templates` - List templates
- `POST /api/templates` - Submit template

### Protected (Admin)
- `GET /api/admin/users` - List users
- `PATCH /api/admin/templates/[id]/approve` - Approve template

---

## 🎨 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** TailwindCSS, Radix UI
- **Backend:** Next.js API Routes
- **Database:** MongoDB, Mongoose
- **Auth:** NextAuth.js
- **Drag & Drop:** @dnd-kit

---

## 📊 Project Stats

- **Files:** 40+
- **Lines of Code:** 3000+
- **Documentation:** 11 files
- **Features:** 120+
- **API Endpoints:** 10+
- **Components:** 15+

---

## ✅ Setup Verification

Check these work:
- [ ] Server starts without errors
- [ ] Homepage loads
- [ ] Can create account
- [ ] Can sign in
- [ ] Can create CV
- [ ] Dashboard shows CVs
- [ ] Can edit CV
- [ ] Can delete CV
- [ ] Admin panel accessible (if admin)

---

## 🆘 Get Help

**Quick Issues:**
- Check SETUP_CHECKLIST.md for detailed steps
- Check INSTALLATION.md for troubleshooting
- Verify all environment variables are set
- Restart server after changing `.env.local`

**Documentation:**
- Setup: SETUP_CHECKLIST.md
- API: API_DOCUMENTATION.md
- Deploy: DEPLOYMENT.md
- Features: FEATURES_CHECKLIST.md

---

## 🎉 You're Ready!

Everything is installed and configured. Just:

1. Configure `.env.local`
2. Run `npm run dev`
3. Open http://localhost:3000
4. Start building CVs!

**Happy Coding!** 🚀
