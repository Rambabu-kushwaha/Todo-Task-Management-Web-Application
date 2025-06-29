# 🚀 Deployment Guide

This guide will help you deploy the Todo Task Management application to production platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository**: Your code pushed to a public GitHub repository
2. **MongoDB Atlas Account**: Free tier database setup
3. **Google OAuth Credentials**: Production OAuth credentials
4. **Domain Names** (optional): Custom domains for your applications

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 3. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your deployment platform's IP ranges
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `todo`

## 🔐 Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API

### 2. Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - Development: `http://localhost:3000`
   - Production: `https://your-frontend-domain.com`
5. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-backend-domain.com/api/auth/google/callback`
6. Click "Create"
7. Save the Client ID and Client Secret

## 🚀 Backend Deployment (Railway)

### 1. Connect to Railway
1. Go to [Railway](https://railway.app/)
2. Sign up with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 2. Configure Backend Deployment
1. Set the root directory to `backend`
2. Set the build command: `npm install`
3. Set the start command: `npm start`

### 3. Environment Variables
Add these environment variables in Railway dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### 4. Deploy
1. Railway will automatically deploy when you push to your main branch
2. Wait for the deployment to complete
3. Copy the generated URL (e.g., `https://your-app-name.railway.app`)

## 🌐 Frontend Deployment (Vercel)

### 1. Connect to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

### 2. Configure Frontend Deployment
1. Set the root directory to `frontend`
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Set the install command: `npm install`

### 3. Environment Variables
Add these environment variables in Vercel dashboard:

```env
VITE_API_URL=https://your-backend-domain.com
```

### 4. Deploy
1. Click "Deploy"
2. Vercel will build and deploy your application
3. Copy the generated URL (e.g., `https://your-app-name.vercel.app`)

## 🔄 Alternative Deployment Options

### Backend Alternatives

#### Render
1. Go to [Render](https://render.com/)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set root directory to `backend`
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables
8. Deploy

#### Heroku
1. Go to [Heroku](https://heroku.com/)
2. Create a new app
3. Connect your GitHub repository
4. Set buildpacks for Node.js
5. Add environment variables
6. Deploy

### Frontend Alternatives

#### Netlify
1. Go to [Netlify](https://netlify.com/)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

#### GitHub Pages
1. Enable GitHub Pages in your repository settings
2. Set source to GitHub Actions
3. Create GitHub Actions workflow for building and deploying
4. Push to trigger deployment

## 🔧 Custom Domain Setup

### 1. Backend Domain (Railway)
1. Go to your Railway project
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update Google OAuth redirect URIs

### 2. Frontend Domain (Vercel)
1. Go to your Vercel project
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update Google OAuth JavaScript origins

## 🔍 Post-Deployment Verification

### 1. Test Backend API
```bash
# Test health endpoint
curl https://your-backend-domain.com/api/health

# Expected response:
# {"status":"ok","message":"Server is running","timestamp":"2024-01-01T00:00:00.000Z"}
```

### 2. Test Frontend
1. Visit your frontend URL
2. Test Google OAuth login
3. Create a test task
4. Verify real-time updates work

### 3. Test Real-time Features
1. Open the app in two different browsers
2. Create a task in one browser
3. Verify it appears in the other browser
4. Test status updates and sharing

## 🔒 Security Checklist

### Environment Variables
- [ ] All sensitive data is in environment variables
- [ ] No secrets in code or repository
- [ ] Production JWT secret is strong and unique
- [ ] MongoDB connection string is secure

### OAuth Configuration
- [ ] Production OAuth credentials are set
- [ ] Redirect URIs are correctly configured
- [ ] JavaScript origins are properly set
- [ ] OAuth scopes are minimal and necessary

### Database Security
- [ ] Database user has minimal required permissions
- [ ] Network access is properly configured
- [ ] Database is not publicly accessible
- [ ] Regular backups are enabled

### Application Security
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is working

## 📊 Monitoring Setup

### 1. Railway Monitoring
- Monitor application logs in Railway dashboard
- Set up alerts for errors
- Monitor resource usage

### 2. Vercel Analytics
- Enable Vercel Analytics for frontend monitoring
- Monitor Core Web Vitals
- Track user interactions

### 3. MongoDB Atlas Monitoring
- Monitor database performance
- Set up alerts for slow queries
- Track connection usage

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
1. Check environment variables are set correctly
2. Verify MongoDB connection string
3. Check Railway logs for errors
4. Ensure all dependencies are installed

#### OAuth Not Working
1. Verify OAuth credentials are correct
2. Check redirect URIs match exactly
3. Ensure JavaScript origins are set
4. Test with development credentials first

#### Real-time Features Not Working
1. Check WebSocket connection in browser dev tools
2. Verify Socket.io is properly configured
3. Check for CORS issues
4. Ensure JWT token is valid

#### Database Connection Issues
1. Verify MongoDB Atlas IP whitelist
2. Check database user credentials
3. Ensure connection string is correct
4. Test connection from local development

### Debug Commands

```bash
# Check backend logs
railway logs

# Check frontend build
vercel logs

# Test database connection
mongosh "your-connection-string"

# Test API endpoints
curl -X GET https://your-backend-domain.com/api/health
```

## 📈 Performance Optimization

### 1. Enable Caching
- Set up CDN for static assets
- Enable browser caching
- Use Redis for session storage (future)

### 2. Database Optimization
- Add database indexes
- Monitor slow queries
- Optimize aggregation pipelines

### 3. Frontend Optimization
- Enable code splitting
- Optimize bundle size
- Use lazy loading for components

## 🔄 Continuous Deployment

### 1. Automatic Deployments
- Both Railway and Vercel deploy automatically on push to main branch
- Set up branch protection rules
- Use feature branches for development

### 2. Environment Management
- Use different OAuth credentials for development and production
- Set up staging environment if needed
- Use environment-specific configurations

### 3. Rollback Strategy
- Keep previous deployments available
- Use Git tags for releases
- Document rollback procedures

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review platform-specific documentation:
   - [Railway Docs](https://docs.railway.app/)
   - [Vercel Docs](https://vercel.com/docs)
   - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
3. Check application logs for error details
4. Verify all environment variables are set correctly

---

Your application should now be successfully deployed and accessible via the provided URLs! 