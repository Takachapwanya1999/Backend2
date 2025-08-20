# MongoDB Atlas Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Sign Up" and create a free account
3. Choose "Build a Database" → "Free" (M0 Sandbox)

### Step 2: Create Database
1. Choose Cloud Provider: **AWS**
2. Region: Choose closest to your location
3. Cluster Name: `airbnb-clone`
4. Click "Create Cluster"

### Step 3: Setup Database Access
1. **Database Access**: Create a user
   - Username: `airbnb_user`
   - Password: `airbnb_password123`
   - Role: `Atlas admin`

2. **Network Access**: Allow connections
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - Or add your current IP

### Step 4: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 4.1 or later
4. Copy the connection string

### Step 5: Update .env File
Replace the MONGODB_URI in your `.env` file:

```bash
MONGODB_URI=mongodb+srv://airbnb_user:airbnb_password123@airbnb-clone.xxxxx.mongodb.net/airbnb_clone?retryWrites=true&w=majority
```

## 🚀 Alternative: Local MongoDB

If you prefer local development:

1. Download MongoDB Community Server
2. Install and start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/airbnb_clone`

## ✅ Test Connection

After setup, restart your server and you should see:
```
✅ MongoDB Connected: airbnb-clone-shard-00-00.xxxxx.mongodb.net
```
