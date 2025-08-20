#!/bin/bash

# Render Deployment Preparation Script
# This script helps prepare your project for Render deployment

echo "🚀 Preparing Airbnb Clone for Render Deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check for required files
echo "🔍 Checking required files..."

if [ -f "render.yaml" ]; then
    echo "✅ render.yaml found"
else
    echo "❌ render.yaml missing - deployment config not found"
fi

if [ -f ".env.render.template" ]; then
    echo "✅ Environment variables template found"
else
    echo "❌ .env.render.template missing"
fi

if [ -f "RENDER_DEPLOYMENT_GUIDE.md" ]; then
    echo "✅ Deployment guide found"
else
    echo "❌ Deployment guide missing"
fi

# Check package.json scripts
echo ""
echo "🔍 Checking package.json scripts..."

if grep -q "render-postbuild" package.json; then
    echo "✅ Render build script found"
else
    echo "❌ Render build script missing"
fi

# Check client preview script
if grep -q "preview" client/package.json; then
    echo "✅ Client preview script found"
else
    echo "❌ Client preview script missing"
fi

# Check environment files
echo ""
echo "🔍 Checking environment configuration..."

if [ -f "server/.env" ]; then
    echo "✅ Server environment file found"
    if grep -q "MONGODB_URI" server/.env; then
        echo "✅ MongoDB URI configured"
    else
        echo "⚠️  MongoDB URI not found in server/.env"
    fi
else
    echo "❌ Server .env file missing"
fi

if [ -f "client/.env" ]; then
    echo "✅ Client environment file found"
else
    echo "❌ Client .env file missing"
fi

# Test build processes
echo ""
echo "🔨 Testing build processes..."

echo "Testing server dependencies..."
cd server
if npm install --silent; then
    echo "✅ Server dependencies install successfully"
else
    echo "❌ Server dependency installation failed"
    cd ..
    exit 1
fi
cd ..

echo "Testing client build..."
cd client
if npm install --silent && npm run build --silent; then
    echo "✅ Client builds successfully"
    # Clean up build
    rm -rf dist
else
    echo "❌ Client build failed"
    cd ..
    exit 1
fi
cd ..

# Git repository check
echo ""
echo "📝 Checking Git repository..."

if git status >/dev/null 2>&1; then
    echo "✅ Git repository initialized"
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD --; then
        echo "✅ No uncommitted changes"
    else
        echo "⚠️  You have uncommitted changes. Consider committing them before deployment."
    fi
    
    # Check for remote
    if git remote -v | grep -q "origin"; then
        echo "✅ Git remote configured"
        REMOTE_URL=$(git remote get-url origin)
        echo "   Remote: $REMOTE_URL"
    else
        echo "⚠️  No Git remote configured. You'll need to push to GitHub for Render deployment."
    fi
else
    echo "❌ Git repository not initialized"
fi

echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "Before deploying to Render, ensure you have:"
echo "□ MongoDB Atlas cluster set up"
echo "□ Strong JWT secret ready"
echo "□ Code pushed to GitHub"
echo "□ Environment variables ready (see .env.render.template)"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub if you haven't already"
echo "2. Follow the RENDER_DEPLOYMENT_GUIDE.md"
echo "3. Create services on Render dashboard"
echo "4. Set environment variables"
echo "5. Deploy and test!"
echo ""
echo "🎉 Your project is ready for Render deployment!"

# Make the script executable
chmod +x "$0"
