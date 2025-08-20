# Render Deployment Checklist ✅

## Repository Configuration
- ✅ Repository URL: https://github.com/Takachapwanya1999/Airbnb
- ✅ Branch: master
- ✅ Latest commit includes server.js file

## Render Dashboard Settings to Update

### 1. Service Configuration
- **Repository**: Change to `https://github.com/Takachapwanya1999/Airbnb`
- **Branch**: `master`
- **Root Directory**: `.` (leave empty)
- **Environment**: `Node`

### 2. Build & Deploy Commands
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### 3. Environment Variables (Set in Render Dashboard)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://Paseka:Faith2003chap@chapman.q43cnyk.mongodb.net/?retryWrites=true&w=majority&appName=Chapman
JWT_SECRET=super-secret-jwt-key-for-airbnb-clone-capstone-project-2024
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-url.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
UPLOAD_PATH=./server/uploads
MAX_FILE_SIZE=10485760
BCRYPT_ROUNDS=12
```

### 4. Node.js Version
- **Node Version**: 20.x (specified in package.json engines)

## Files to Verify in Repository
- ✅ `server.js` (production entry point)
- ✅ `package.json` (with all dependencies)
- ✅ `.env` (production environment)
- ✅ `render.yaml` (deployment configuration)
- ✅ `server/` directory with all server files

## Manual Steps on Render Dashboard

1. **Update Repository**:
   - Go to your service settings
   - Update repository to: `https://github.com/Takachapwanya1999/Airbnb`
   - Set branch to: `master`

2. **Trigger Manual Deploy**:
   - Go to "Manual Deploy" 
   - Click "Deploy Latest Commit"
   - This will use the latest commit with all fixes

3. **Monitor Deployment**:
   - Watch build logs for successful npm install
   - Verify server starts with "node server.js"
   - Check health endpoint: `/api/health`

## Expected Success Indicators
- ✅ Build completes without "MODULE_NOT_FOUND" errors
- ✅ Server starts on specified PORT
- ✅ Health check responds at `/api/health`
- ✅ MongoDB connection established

## Next Steps
1. Update Render service to use Airbnb repository
2. Trigger manual deployment
3. Monitor logs for successful deployment
4. Test the deployed API endpoints
