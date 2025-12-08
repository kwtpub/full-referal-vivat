#!/bin/bash

# Build script for production deployment

set -e

echo "🏗️  Building client application..."

# Build client
cd client
npm install
npm run build

# Copy build files to nginx volume directory
cd ..
rm -rf client-build
cp -r client/dist client-build

echo "✅ Build completed!"
echo "📦 Client build files are in ./client-build"
echo ""
echo "🚀 Now you can run: docker compose up -d --build"
