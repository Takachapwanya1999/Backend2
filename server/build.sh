#!/bin/bash

# Build script for Render deployment

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
cd server && npm install && cd ..

echo "Creating uploads directory..."
mkdir -p server/uploads/avatars
mkdir -p server/uploads/places

echo "Build completed successfully!"
