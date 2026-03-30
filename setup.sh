#!/bin/bash
# Setup script for Kisan Sahayk - Full application setup

echo "=========================================="
echo "Kisan Sahayk - Complete Setup Script"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Setup Backend
echo ""
echo -e "${YELLOW}Setting up Backend...${NC}"
echo ""

if [ ! -d "backend" ]; then
    echo "❌ Backend folder not found!"
    exit 1
fi

cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please configure backend/.env with your MongoDB URI${NC}"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo "❌ Backend setup failed!"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo -e "${YELLOW}Setting up Frontend...${NC}"
echo ""

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ Frontend .env configured${NC}"
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo "❌ Frontend setup failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. In one terminal, run: cd backend && npm run dev"
echo "3. In another terminal, run: npm run dev"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:4000"
echo ""
