# 🚀 Render Deployment Checklist

## Pre-Deployment Setup ✅

- [ ] **MongoDB Atlas Setup**
  - [ ] Database cluster created
  - [ ] Database user created with read/write permissions
  - [ ] Network access configured (0.0.0.0/0 for Render)
  - [ ] Connection string obtained

- [ ] **GitHub Repository**
  - [ ] Code pushed to GitHub
  - [ ] Repository is public or accessible to Render
  - [ ] Latest changes committed

- [ ] **Environment Variables Ready**
  - [ ] MONGODB_URI connection string
  - [ ] JWT_SECRET (strong, unique key)
  - [ ] All required environment variables listed

## Deployment Steps 🔧

### Step 1: Deploy Backend API
- [ ] **Create Web Service on Render**
  - [ ] Connect GitHub repository
  - [ ] Service name: `airbnb-clone-api`
  - [ ] Root directory: `server`
  - [ ] Build command: `npm install`
  - [ ] Start command: `node index.js`
  - [ ] Instance type: Free (or upgrade as needed)

- [ ] **Set Environment Variables**
  - [ ] NODE_ENV=production
  - [ ] PORT=4000
  - [ ] MONGODB_URI (your connection string)
  - [ ] JWT_SECRET (your secret key)
  - [ ] JWT_EXPIRES_IN=7d
  - [ ] CLIENT_URL (will update after frontend deployment)

- [ ] **Deploy and Test**
  - [ ] Service deploys successfully
  - [ ] Health check passes: `https://your-api.onrender.com/api/health`
  - [ ] Check logs for any errors

### Step 2: Deploy Frontend
- [ ] **Create Web Service on Render**
  - [ ] Connect same GitHub repository
  - [ ] Service name: `airbnb-clone-client`
  - [ ] Root directory: `client`
  - [ ] Build command: `npm install && npm run build`
  - [ ] Start command: `npm run preview`
  - [ ] Instance type: Free (or upgrade as needed)

- [ ] **Set Environment Variables**
  - [ ] VITE_BASE_URL (your backend API URL)
  - [ ] VITE_CLIENT_URL (your frontend URL)

- [ ] **Deploy and Test**
  - [ ] Service deploys successfully
  - [ ] Frontend loads correctly
  - [ ] Can navigate through pages

### Step 3: Update Cross-Service Configuration
- [ ] **Update Backend Environment**
  - [ ] Update CLIENT_URL with actual frontend URL
  - [ ] Redeploy backend service

- [ ] **Update Frontend Environment**
  - [ ] Update VITE_BASE_URL with actual backend URL
  - [ ] Redeploy frontend service

## Post-Deployment Testing ✅

### API Testing
- [ ] **Health Check**
  - [ ] GET `/api/health` returns 200
  - [ ] Response includes correct environment info

- [ ] **Authentication Endpoints**
  - [ ] POST `/api/auth/register` works
  - [ ] POST `/api/auth/login` works
  - [ ] GET `/api/auth/profile` works with token

- [ ] **Protected Routes**
  - [ ] Admin routes require authentication
  - [ ] CORS headers present
  - [ ] Cookies work correctly

### Frontend Testing
- [ ] **Page Loading**
  - [ ] Home page loads correctly
  - [ ] Login/Register pages work
  - [ ] Protected pages redirect properly

- [ ] **API Integration**
  - [ ] Login/logout functionality works
  - [ ] Data fetching works
  - [ ] Error handling displays correctly

- [ ] **Admin Dashboard**
  - [ ] Dashboard loads for admin users
  - [ ] Data fetching works
  - [ ] Statistics display correctly

## Performance & Monitoring 📊

- [ ] **Service Health**
  - [ ] Both services running without errors
  - [ ] Response times acceptable
  - [ ] No memory/CPU issues

- [ ] **Database Connection**
  - [ ] MongoDB Atlas connection stable
  - [ ] No connection timeout errors
  - [ ] Query performance acceptable

## Production Readiness 🎯

- [ ] **Security**
  - [ ] Environment variables secured
  - [ ] CORS properly configured
  - [ ] JWT secrets are strong

- [ ] **Performance**
  - [ ] Static files served efficiently
  - [ ] Database queries optimized
  - [ ] Error handling comprehensive

- [ ] **Documentation**
  - [ ] README updated with live URLs
  - [ ] API documentation accessible
  - [ ] User guides available

## Troubleshooting 🐛

If deployment fails, check:

1. **Build Errors**
   - Review build logs in Render dashboard
   - Check package.json scripts
   - Verify all dependencies listed

2. **Runtime Errors**
   - Check service logs
   - Verify environment variables
   - Test database connection

3. **CORS Issues**
   - Ensure CLIENT_URL matches frontend URL exactly
   - Check browser developer tools
   - Verify axios configuration

4. **Database Issues**
   - Test MongoDB Atlas connection string locally
   - Check network access in Atlas
   - Verify user permissions

## Success! 🎉

- [ ] **Live URLs Recorded**
  - Backend API: `https://airbnb-clone-api.onrender.com`
  - Frontend: `https://airbnb-clone-client.onrender.com`

- [ ] **Documentation Updated**
  - [ ] README.md updated with live URLs
  - [ ] Environment variables documented
  - [ ] Deployment guide accessible

- [ ] **Monitoring Set Up**
  - [ ] Service status monitoring
  - [ ] Error tracking configured
  - [ ] Performance metrics reviewed

Your Airbnb clone is now live on Render! 🚀
