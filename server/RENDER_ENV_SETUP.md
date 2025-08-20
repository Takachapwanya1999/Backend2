# 🚨 URGENT: Render Environment Variables Setup

## Problem Identified
✅ Deployment is working correctly
❌ Environment variables are not set in Render Dashboard

## Error Analysis
```
[dotenv@17.2.1] injecting env (0) from server/.env
Database connection error: MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

This means `MONGODB_URI` is undefined because Render environment variables are not configured.

## IMMEDIATE FIX REQUIRED

### Step 1: Set Environment Variables in Render Dashboard

Go to your Render service → Settings → Environment Variables and add:

**Required Variables:**
```
NODE_ENV=production
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

**Important Notes:**
- ⚠️ Do NOT include `PORT` - Render sets this automatically
- ⚠️ Replace `CLIENT_URL` with your actual frontend URL
- ⚠️ Make sure there are no extra spaces in the values

### Step 2: Add Variables One by One

In Render Dashboard:
1. Click "Add Environment Variable"
2. Add each variable:

```
Key: NODE_ENV
Value: production

Key: MONGODB_URI  
Value: mongodb+srv://Paseka:Faith2003chap@chapman.q43cnyk.mongodb.net/?retryWrites=true&w=majority&appName=Chapman

Key: JWT_SECRET
Value: super-secret-jwt-key-for-airbnb-clone-capstone-project-2024

Key: JWT_EXPIRES_IN
Value: 7d

Key: CLIENT_URL
Value: https://your-frontend-url.onrender.com

Key: RATE_LIMIT_WINDOW_MS
Value: 900000

Key: RATE_LIMIT_MAX_REQUESTS
Value: 100

Key: UPLOAD_PATH
Value: ./server/uploads

Key: MAX_FILE_SIZE
Value: 10485760

Key: BCRYPT_ROUNDS
Value: 12
```

### Step 3: Trigger Redeploy

After adding all environment variables:
1. Click "Manual Deploy"
2. Select "Deploy Latest Commit"
3. Monitor logs

## Expected Success Result

After setting environment variables, you should see:
```
[dotenv@17.2.1] injecting env (10) from server/.env
MongoDB Connected: ac-0ldtemc-shard-00-00.q43cnyk.mongodb.net
Server running on port 10000 in production mode
```

## Quick Test
Once deployed successfully, test these endpoints:
- Health Check: `https://your-app.onrender.com/api/health`
- Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

The deployment will work immediately once you add the environment variables! 🚀
