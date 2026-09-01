# AFM Website - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Extract the Files
```bash
tar -xzf afm-website.tar.gz
cd afm-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
cp .env.example .env
```

**Edit .env file with your settings:**
- For local development, the defaults work fine
- For production, update MongoDB URI and secrets

### 4. Initialize Database
```bash
npm run setup-db
```

**Default Admin Login:**
- Email: `admin@afmincanada.org`
- Password: `Admin123!`

### 5. Start the Application
```bash
npm run dev
```

This starts both servers:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📱 Using the Website

### Public Pages (No Login Required)
- **Home** - Main landing page
- **About** - Church history and beliefs
- **Blog** - All published sermons and messages
- **Events** - Upcoming church events
- **Contact** - Contact information and map

### Admin Dashboard (Login Required)
1. Go to http://localhost:5173/admin/login
2. Login with admin credentials
3. Access the dashboard to:
   - Create/edit/delete blog posts
   - Manage events
   - Toggle publish status
   - View analytics

## ✏️ Creating Your First Blog Post

1. Login to admin dashboard
2. Click "Create New Post"
3. Fill in:
   - **Title**: Your sermon/message title
   - **Icon**: Choose an emoji (📖, 🙏, ✝️, etc.)
   - **Excerpt**: Brief 2-3 sentence summary
   - **Content**: Full message (supports HTML)
   - **Category**: sermon, teaching, testimony, etc.
4. Click "Publish" or "Save as Draft"

**Content Supports HTML:**
```html
<h2>Section Title</h2>
<p>Your paragraph text...</p>
<ul>
  <li>Bullet point</li>
</ul>
```

## 🎯 Key Features

### Blog System
- Rich text content with HTML support
- Categories and tags
- Featured posts
- Draft/Published status
- View counter
- Search functionality

### Event Management
- Recurring events (weekly/monthly)
- Multiple categories
- Upcoming events display
- Full event details

### Security
- JWT authentication
- Password hashing (bcrypt)
- Protected API routes
- Rate limiting

## 📝 Customization

### Change Colors
Edit `src/styles/global.css`:
```css
:root {
  --primary: #8B4513;      /* Main brown */
  --primary-dark: #5D2E0C; /* Dark brown */
  --accent: #D4A574;       /* Light brown/tan */
}
```

### Update Contact Information
Edit `src/pages/Contact.jsx`

### Modify About Page
Edit `src/pages/About.jsx`

## 🔧 Common Commands

```bash
# Development (both servers)
npm run dev

# Backend only
npm run server

# Frontend only
npm run client

# Build for production
npm run build

# Reset database
npm run setup-db
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas and update MONGODB_URI in .env

### Port Already in Use
- Frontend (5173): Change in vite.config.js
- Backend (5000): Change PORT in .env

### Admin Login Not Working
- Re-run: `npm run setup-db`
- Check console for error messages

## 📦 What's Included

```
✅ Complete React frontend (8 pages)
✅ Node.js/Express backend
✅ MongoDB database with models
✅ JWT authentication
✅ Blog CMS with rich editor
✅ Event management
✅ Responsive design
✅ API documentation
✅ Sample data
```

## 🌐 Deployment

### Quick Deploy Options:

**Frontend** (Choose one):
- Vercel: `vercel deploy`
- Netlify: `netlify deploy`
- GitHub Pages

**Backend** (Choose one):
- Railway: `railway up`
- Render: Connect GitHub repo
- Heroku: `git push heroku main`

**Database**:
- MongoDB Atlas (Free tier available)
- Get connection string and update .env

## 💡 Pro Tips

1. **Change admin password immediately** after first login
2. **Backup database regularly** - Export from MongoDB Compass
3. **Use MongoDB Atlas** for production (free tier available)
4. **Enable HTTPS** in production
5. **Set strong JWT_SECRET** in production
6. **Rate limit API** is already configured

## 🆘 Need Help?

- Check README.md for detailed documentation
- API endpoints listed in README
- Console logs show helpful error messages

## ✨ Next Steps

1. Change admin credentials
2. Update contact information
3. Customize colors and branding
4. Add your own content
5. Deploy to production!

---

**Happy Building! 🎉**
