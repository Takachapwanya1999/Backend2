# 🚀 Render Deployment Guide - Airbnb Clone

## Prerequisites

1. ✅ MongoDB Atlas account setup
2. ✅ Git repository on GitHub
3. ✅ Render account (https://render.com)

## 🔧 Project Structure for Render

This project is configured as a full-stack application with:
- **Backend**: Node.js/Express server (in `/server` directory)
- **Frontend**: React/Vite client (in `/client` directory)
- **Database**: MongoDB Atlas

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Deploy Backend on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `airbnb-clone` repository

3. **Configure Service Settings**:
   - **Name**: `airbnb-clone-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

4. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://Takafakare:Faith2003chap@chapman.q43cnyk.mongodb.net/airbnb_clone?retryWrites=true&w=majority&appName=Chapman
JWT_SECRET=super-secret-jwt-key-for-airbnb-clone-capstone-project-2024
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-app.onrender.com
PORT=4000
```

5. **Deploy**: Click "Create Web Service"

### Step 3: Deploy Frontend on Render

1. **Create Another Web Service**:
   - Click "New +" → "Web Service"
   - Connect same GitHub repository
   - Select your `airbnb-clone` repository

2. **Configure Frontend Settings**:
   - **Name**: `airbnb-clone-client`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`

3. **Environment Variables**:
```
VITE_BASE_URL=https://your-backend-app.onrender.com/api
VITE_CLIENT_URL=https://your-frontend-app.onrender.com
```

4. **Deploy**: Click "Create Web Service"

### Step 4: Update CORS Configuration

Once both services are deployed, update the backend environment variables:

1. Go to your **backend service** on Render
2. Update `CLIENT_URL` environment variable with your actual frontend URL
3. Go to **Environment** tab and update:
```
CLIENT_URL=https://airbnb-clone-client.onrender.com
```

### Step 5: Update Frontend API URL

1. Go to your **frontend service** on Render
2. Update `VITE_BASE_URL` environment variable:
```
VITE_BASE_URL=https://airbnb-clone-api.onrender.com/api
```

## 🔗 Service URLs

After deployment, your services will be available at:
- **Backend API**: `https://airbnb-clone-api.onrender.com`
- **Frontend**: `https://airbnb-clone-client.onrender.com`

## 🧪 Testing Deployment

Test these endpoints after deployment:
- Health check: `https://airbnb-clone-api.onrender.com/api/health`
- Register endpoint: `https://airbnb-clone-api.onrender.com/api/auth/register`

## 🚨 Important Notes

1. **Free Tier Limitations**:
   - Services sleep after 15 minutes of inactivity
   - First request may take 30-60 seconds to wake up
   - Consider upgrading to paid plan for production

2. **Database Connection**:
   - Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Or whitelist Render's IP ranges

3. **Build Times**:
   - Initial deployment may take 5-10 minutes
   - Subsequent deployments are faster

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Render will automatically redeploy
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check network access settings in Atlas

3. **CORS Errors**:
   - Ensure CLIENT_URL matches your frontend URL exactly
   - Check browser developer tools for exact error

4. **Service Not Responding**:
   - Check service logs in Render dashboard
   - Verify environment variables are set correctly

### Useful Commands for Debugging:

```bash
# View service logs (via Render dashboard)
# Check environment variables
# Monitor service health
```

## 🎉 Success!

Your Airbnb clone should now be live on Render! 

- Frontend: Access your app via the frontend URL
- Admin Dashboard: Login with admin credentials
- API: All endpoints accessible via backend URL

## 📝 Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificates (auto-provided by Render)
3. Set up monitoring and alerts
4. Consider upgrading to paid plans for better performance

---

**Need Help?** Check Render's documentation: https://render.com/docs
