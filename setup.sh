#!/bin/bash

# MCP Server TypeScript Template Setup Script

echo "🚀 Setting up MCP Server TypeScript Template..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
        
        echo "🔨 Building project..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "✅ Project built successfully"
            echo ""
            echo "🎉 Setup complete! Your MCP server is ready."
            echo ""
            echo "Next steps:"
            echo "1. Test your server: npm start"
            echo "2. Configure Claude Desktop with this path:"
            echo "   $(pwd)/build/index.js"
            echo "3. Restart Claude Desktop"
            echo ""
            echo "Happy coding! 🚀"
        else
            echo "❌ Build failed. Please check for errors."
            exit 1
        fi
    else
        echo "❌ Failed to install dependencies. Please check for errors."
        exit 1
    fi
else
    echo "⚠️  package.json not found. Please copy the template files first."
    echo ""
    echo "To get started:"
    echo "1. Copy package.json, tsconfig.json, and src/index.ts to this directory"
    echo "2. Run: npm install"
    echo "3. Run: npm run build"
    echo "4. Run: npm start"
fi