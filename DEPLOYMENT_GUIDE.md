# Deployment Guide - Airbnb Clone

## 🚀 Heroku Deployment Instructions

### Prerequisites
1. ✅ MongoDB Atlas database set up
2. ✅ Git repository initialized
3. ✅ Heroku CLI installed

### Step 1: Prepare for Deployment
```bash
# Navigate to project root
cd c:\Users\chapw\Desktop\airbnb-clone

# Install root dependencies
npm install

# Initialize git if not done
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create Heroku App
```bash
# Login to Heroku
heroku login

# Create app (replace with your preferred name)
heroku create your-airbnb-clone-app

# Add buildpacks
heroku buildpacks:add heroku/nodejs
```

### Step 3: Configure Environment Variables
```bash
# Set production environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_super_secret_jwt_key"
heroku config:set CLIENT_URL="https://your-airbnb-clone-app.herokuapp.com"
```

### Step 4: Update Server for Production
Add this to `server/index.js` (before routes):

```javascript
// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}
```

### Step 5: Deploy
```bash
# Deploy to Heroku
git add .
git commit -m "Prepare for deployment"
git push heroku main

# Check logs if issues
heroku logs --tail
```

## 🌍 Alternative: Vercel + Railway

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set start command: `cd server && npm start`
3. Add environment variables

## ✅ Testing Deployment

After deployment, test these endpoints:
- `https://your-app.herokuapp.com/api/health`
- `https://your-app.herokuapp.com/api/auth/register`
- Frontend should load at root URL

## 🐛 Common Issues

### Build Errors
- Ensure all dependencies are in package.json
- Check Node.js version compatibility
- Verify environment variables are set

### Database Connection
- Whitelist all IPs in MongoDB Atlas (0.0.0.0/0)
- Check connection string format
- Verify username/password

### CORS Issues
- Update CLIENT_URL to production domain
- Check CORS configuration in server
