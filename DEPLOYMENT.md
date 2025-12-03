# Deployment Guide - CV Builder Pro

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform as it's built by the creators of Next.js and offers seamless integration.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas cluster
- OAuth credentials configured

#### Step-by-Step Deployment

1. **Push Code to GitHub**

```bash
cd cv-builder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/cv-builder.git
git push -u origin main
```

2. **Import Project to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your GitHub repository
- Select the `cv-builder` directory if it's not at root

3. **Configure Environment Variables**

In Vercel dashboard, add these environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cv-builder
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. **Update OAuth Redirect URIs**

Update your OAuth applications with production URLs:

**Google:**
- Authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

**GitHub:**
- Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

**LinkedIn:**
- Redirect URL: `https://your-domain.vercel.app/api/auth/callback/linkedin`

5. **Deploy**

- Click "Deploy"
- Wait for build to complete
- Visit your live site!

6. **Custom Domain (Optional)**

- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed
- Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your custom domain
- Update OAuth redirect URIs

---

### Option 2: Railway

Railway offers a simple deployment experience with built-in database hosting.

#### Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add all environment variables

4. **Deploy**
   - Railway automatically deploys
   - Get your deployment URL
   - Update OAuth redirect URIs

---

### Option 3: Netlify

Netlify is another excellent option for Next.js applications.

#### Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Import from Git

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all required variables

4. **Deploy**
   - Click "Deploy site"
   - Update OAuth redirect URIs with Netlify URL

---

### Option 4: Self-Hosted (VPS)

For full control, deploy on your own server.

#### Prerequisites
- VPS (DigitalOcean, AWS EC2, etc.)
- Node.js 18+ installed
- Nginx or Apache
- PM2 for process management
- SSL certificate (Let's Encrypt)

#### Steps

1. **Set Up Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Clone and Build**

```bash
# Clone repository
git clone https://github.com/yourusername/cv-builder.git
cd cv-builder

# Install dependencies
npm install --legacy-peer-deps

# Create .env.local
nano .env.local
# Add all environment variables

# Build
npm run build
```

3. **Configure PM2**

```bash
# Start application
pm2 start npm --name "cv-builder" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

4. **Configure Nginx**

```nginx
# /etc/nginx/sites-available/cv-builder
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cv-builder /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

5. **Set Up SSL**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Database Setup (MongoDB Atlas)

### Production Configuration

1. **Create Production Cluster**
   - Go to MongoDB Atlas
   - Create new cluster (M10+ recommended for production)
   - Choose region closest to your users

2. **Configure Network Access**
   - Add IP addresses of your deployment platform
   - For Vercel: Add `0.0.0.0/0` (Vercel uses dynamic IPs)
   - For VPS: Add your server's IP

3. **Create Database User**
   - Create user with read/write permissions
   - Use strong password
   - Note credentials for connection string

4. **Enable Backup**
   - Enable continuous backup
   - Set up backup schedule
   - Test restore process

5. **Set Up Monitoring**
   - Enable MongoDB monitoring
   - Set up alerts for:
     - High CPU usage
     - High memory usage
     - Connection issues
     - Slow queries

---

## Post-Deployment Checklist

### Security

- [ ] All environment variables set correctly
- [ ] OAuth redirect URIs updated
- [ ] HTTPS enabled
- [ ] Database access restricted
- [ ] Strong passwords used
- [ ] CORS configured properly
- [ ] Rate limiting enabled (if implemented)

### Functionality

- [ ] User registration works
- [ ] Email/password login works
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] CV creation works
- [ ] CV editing works
- [ ] CV deletion works
- [ ] Template system works
- [ ] Admin panel accessible
- [ ] Public CV sharing works

### Performance

- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN enabled

### Monitoring

- [ ] Error tracking set up (Sentry)
- [ ] Analytics configured (Google Analytics)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Database monitoring enabled

---

## Continuous Deployment

### Automatic Deployments

**Vercel:**
- Automatically deploys on push to main branch
- Preview deployments for pull requests
- Rollback capability

**GitHub Actions (Custom):**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - run: npm test
      # Add deployment steps
```

---

## Rollback Strategy

### Vercel

1. Go to Deployments tab
2. Find previous working deployment
3. Click "Promote to Production"

### Self-Hosted

```bash
# Using PM2
pm2 stop cv-builder
git checkout <previous-commit>
npm install --legacy-peer-deps
npm run build
pm2 restart cv-builder
```

---

## Scaling Strategies

### Horizontal Scaling

1. **Vercel:**
   - Automatic scaling
   - No configuration needed
   - Scales based on traffic

2. **Self-Hosted:**
   - Use load balancer (Nginx, HAProxy)
   - Deploy multiple instances
   - Use PM2 cluster mode

```bash
# PM2 cluster mode
pm2 start npm --name "cv-builder" -i max -- start
```

### Database Scaling

1. **Read Replicas:**
   - Add read replicas in MongoDB Atlas
   - Route read queries to replicas
   - Keep writes on primary

2. **Sharding:**
   - For very large datasets
   - Shard by userId
   - Configure in MongoDB Atlas

---

## Backup Strategy

### Database Backups

1. **Automated Backups:**
   - MongoDB Atlas continuous backup
   - Point-in-time recovery
   - Retention: 7-30 days

2. **Manual Backups:**

```bash
# Export database
mongodump --uri="mongodb+srv://..." --out=backup-$(date +%Y%m%d)

# Import database
mongorestore --uri="mongodb+srv://..." backup-20240101/
```

### Code Backups

- Git repository (GitHub)
- Multiple branches
- Tagged releases

---

## Monitoring & Alerts

### Set Up Alerts

1. **Uptime Monitoring:**
   - UptimeRobot (free)
   - Check every 5 minutes
   - Alert via email/SMS

2. **Error Tracking:**
   - Sentry integration
   - Alert on new errors
   - Track error frequency

3. **Performance:**
   - Vercel Analytics
   - Monitor Core Web Vitals
   - Track API response times

---

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

**Database Connection Issues:**
- Check IP whitelist
- Verify connection string
- Check database user permissions

**OAuth Errors:**
- Verify redirect URIs
- Check client ID/secret
- Ensure OAuth app is active

**Performance Issues:**
- Enable caching
- Optimize images
- Add database indexes
- Use CDN

---

## Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

**Deployment Status:** Ready for Production  
**Last Updated:** December 2024
