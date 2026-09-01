# AFM Website - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Deploy Everything to Railway (Recommended for Beginners)

**Railway** can host both your frontend and backend in one place.

1. **Create Railway Account**: https://railway.app
2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Deploy Backend**:
   ```bash
   cd afm-website
   railway init
   railway add  # Add MongoDB plugin
   railway up
   ```

4. **Deploy Frontend**:
   - Build: `npm run build`
   - Deploy the `dist` folder to Railway or Vercel

### Option 2: Separate Deployment (Production-Grade)

#### Backend → Render/Railway/Heroku
#### Frontend → Vercel/Netlify
#### Database → MongoDB Atlas

---

## 📦 Backend Deployment

### Railway (Easiest)
```bash
# In project root
railway login
railway init
railway add  # Select MongoDB
railway up

# Set environment variables in Railway dashboard
```

### Render
1. Go to https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Build: `npm install`
5. Start: `npm run server`
6. Add environment variables

### Heroku
```bash
heroku create afm-canada-api
heroku addons:create mongolab
git push heroku main
```

**Required Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-strong-secret-key
FRONTEND_URL=https://your-frontend-url.com
ADMIN_EMAIL=admin@afmincanada.org
ADMIN_PASSWORD=ChangeThisPassword!
```

---

## 🌐 Frontend Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

Or via Vercel Dashboard:
1. Import Git Repository
2. Framework: Vite
3. Build: `npm run build`
4. Output: `dist`

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Environment Variable:**
```
VITE_API_URL=https://your-backend-api.com/api
```

---

## 💾 Database Setup (MongoDB Atlas)

1. **Create Account**: https://mongodb.com/cloud/atlas
2. **Create Cluster** (Free tier available)
3. **Create Database User**
4. **Whitelist IP**: 0.0.0.0/0 (or specific IPs)
5. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/afm-canada
   ```
6. **Update .env**:
   ```
   MONGODB_URI=your-connection-string
   ```
7. **Initialize Database**:
   ```bash
   npm run setup-db
   ```

---

## 🔐 Security Checklist

### Before Going Live:

- [ ] Change admin password
- [ ] Set strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Update CORS origins to your domain
- [ ] Enable HTTPS (both frontend & backend)
- [ ] Set secure cookie flags (if using cookies)
- [ ] Restrict MongoDB IP whitelist
- [ ] Enable rate limiting (already configured)
- [ ] Review all environment variables
- [ ] Test all functionality
- [ ] Set up database backups

---

## 🔄 CI/CD Setup (Optional but Recommended)

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

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
      - run: npm install
      - run: npm run build
      - uses: vercel/actions@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📊 Monitoring & Maintenance

### Set Up Monitoring:
- **Backend**: Railway/Render dashboards
- **Uptime**: UptimeRobot (free)
- **Errors**: Sentry (optional)
- **Analytics**: Google Analytics

### Regular Maintenance:
- Weekly database backups
- Monthly dependency updates
- Review error logs
- Monitor performance

---

## 🌍 Custom Domain Setup

### Frontend (Vercel/Netlify):
1. Add custom domain in dashboard
2. Update DNS records:
   - A record or CNAME to provider
3. Enable SSL (automatic)

### Backend:
1. Add custom domain
2. Update FRONTEND_URL in env
3. Update CORS settings

---

## 🐛 Troubleshooting Deployment

### "Module not found" errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS errors:
- Check FRONTEND_URL in backend .env
- Verify CORS configuration in server/index.js

### Database connection failed:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

### API 404 errors:
- Verify VITE_API_URL in frontend
- Check backend is running
- Confirm routes are correct

---

## 📱 Post-Deployment Checklist

- [ ] Test all pages load
- [ ] Test blog creation
- [ ] Test blog editing/deletion
- [ ] Test login/logout
- [ ] Test on mobile devices
- [ ] Test contact form
- [ ] Verify donation button
- [ ] Check all links work
- [ ] Test search functionality
- [ ] Verify events display
- [ ] Check responsive design
- [ ] Test different browsers

---

## 💰 Cost Estimation

### Free Tier (Good for starting):
- **Frontend**: Vercel/Netlify Free
- **Backend**: Railway/Render Free (500 hrs/month)
- **Database**: MongoDB Atlas Free (512 MB)
- **Total**: $0/month

### Production (Recommended):
- **Frontend**: $0 (stays free)
- **Backend**: $5-7/month
- **Database**: $9/month (2GB Atlas)
- **Domain**: $12/year
- **Total**: ~$15-20/month

---

## 🆘 Getting Help

**Deployment Issues:**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

**AFM Website Specific:**
- Check console logs
- Review error messages
- Verify environment variables
- Test API endpoints directly

---

## 🎉 You're Live!

Once deployed:
1. Go to your website
2. Test everything thoroughly
3. Share with your congregation!
4. Keep the admin credentials safe

**Remember**: Always backup your database before major changes!
