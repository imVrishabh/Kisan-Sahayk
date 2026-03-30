# 🌾 Kisan Sahayk - Agricultural Marketplace

A full-stack web application connecting farmers directly with buyers in India. Built with React, Node.js, Express, and MongoDB.

**Live Status:** 🚀 Production-Ready

---

## 📋 Project Overview

Kisan Sahayk empowers farmers to:
- **Sell their crops** at fair prices directly to buyers
- **Check real-time market prices** from various mandis
- **Manage listings** with detailed crop information
- **Connect with potential buyers** without middlemen

Buyers can:
- **Browse available crops** with filters and search
- **Compare market prices** across regions
- **Contact farmers directly** for negotiations
- **Track price trends** to make informed decisions

---

## 🎯 Key Features

### Farmer Features
✅ User authentication (register/login)  
✅ Create and manage crop listings  
✅ Upload crop photos  
✅ Set competitive prices  
✅ Track listing status (available/sold/discontinued)  
✅ View own listings  
✅ Update profile information  

### Buyer Features
✅ Browse all available crops  
✅ Advanced search and filtering  
✅ Filter by crop type, location, price  
✅ Sort by price, newest, quality  
✅ View detailed crop information  
✅ Contact farmer information  

### Market Features
✅ Real-time Mandi prices  
✅ Price trends visualization  
✅ Price comparisons across states  
✅ Average price calculations  
✅ Historical price data  

### Admin Features
✅ Manage market prices  
✅ Bulk price updates  
✅ User management  
✅ Analytics dashboard  

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (fast dev server)
- **Axios** - HTTP client
- **CSS3** - Styling
- **JavaScript ES6+** - Programming language

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### DevOps & Tools
- **npm** - Package manager
- **.env** - Environment configuration
- **nodemon** - Auto-restart during development
- **CORS** - Cross-origin requests
- **Helmet** - Security headers

---

## 📁 Project Structure

```
kisan-market/
├── frontend (React)
│   ├── src/
│   │   ├── context/           # Global state management (Auth, Crops, Prices, Lang)
│   │   ├── pages/             # Page components (Home, Buy, Sell, MarketPrices)
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API client (api.js)
│   │   ├── data/              # Static data (translations, dummy data)
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── backend (Node.js/Express)
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/               # Mongoose schemas (User, Crop, MarketPrice)
│   ├── controllers/          # Business logic (auth, crop, price)
│   ├── routes/               # API routes (auth, crop, price)
│   ├── middleware/           # Authentication, validation, error handling
│   ├── scripts/              # Database seeding
│   ├── utils/                # Helper functions and constants
│   ├── server.js             # Express server entry point
│   ├── package.json
│   └── .env
│
├── INTEGRATION_GUIDE.md      # Frontend-Backend integration docs
├── setup.sh / setup.bat      # Automated setup scripts
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**On Windows:**
```bash
# Run the setup script
setup.bat
```

**On macOS/Linux:**
```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

#### Backend Setup
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Edit .env and set your MongoDB URI:
# MONGO_URI=mongodb://localhost:27017/kisan-sahayk
# or use MongoDB Atlas connection string

# 4. Seed database (optional - adds sample data)
npm run seed

# 5. Start backend server
npm run dev
# Backend runs on http://localhost:4000
```

#### Frontend Setup
```bash
# From project root (not in backend folder)

# 1. Install dependencies
npm install

# 2. .env is already configured for localhost backend

# 3. Start frontend dev server
npm run dev
# Frontend runs on http://localhost:5173
```

### Running Both Together

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## 🔐 Authentication

### Test Credentials (After Seeding)

**Farmer Account:**
```
Email: raj@example.com
Password: password123
Role: farmer
```

**Admin Account:**
```
Email: admin@example.com
Password: admin123
Role: admin
```

### Login Flow

1. User enters email and password
2. Backend validates and returns JWT token
3. Token is stored in localStorage
4. Token is automatically sent with all API requests
5. Backend verifies token on protected routes

---

## 📡 API Overview

### Base URL
```
http://localhost:4000/api
```

### Main API Endpoints

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password

#### Crops (`/crops`)
- `GET /crops` - Get all crops (with filters)
- `GET /crops/:id` - Get single crop
- `POST /crops` - Create crop listing
- `PUT /crops/:id` - Update crop
- `PUT /crops/:id/status` - Update crop status
- `DELETE /crops/:id` - Delete crop
- `GET /crops/my-listings` - Get user's crops

#### Market Prices (`/prices`)
- `GET /prices` - Get all prices
- `GET /prices/crop/:crop` - Get prices for crop
- `GET /prices/average/:crop` - Get average price
- `POST /prices` - Create price (admin)
- `PUT /prices/:id` - Update price (admin)
- `DELETE /prices/:id` - Delete price (admin)

See [API Documentation](backend/API_DOCUMENTATION.md) for detailed endpoints.

---

## 🎨 Using Frontend Components

### Auth Context
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ email, password })}>Login</button>
      )}
    </div>
  );
}
```

### Crops Context
```javascript
import { useCrops } from './context/CropsContext';

function CropsList() {
  const { crops, loading, error, fetchCrops, addCrop } = useCrops();
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {crops.map(crop => <CropCard key={crop._id} crop={crop} />)}
    </div>
  );
}
```

### Prices Context
```javascript
import { usePrices } from './context/PricesContext';

function PriceAnalysis() {
  const { prices, getAveragePrice } = usePrices();
  
  // Get average price for a crop
  const handleGetAverage = async () => {
    const data = await getAveragePrice('Rice');
    console.log(`Average: ₹${data.averagePrice}`);
  };
}
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  role: String (farmer/buyer/admin),
  location: String,
  profilePicture: String (optional),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Crop Model
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId (ref: User),
  farmerName: String,
  phoneNumber: String,
  cropType: String (Rice/Paddy/Wheat/Daal),
  variety: String,
  quantity: String,
  price: Number,
  location: String,
  district: String,
  state: String,
  description: String,
  photoUrl: String (base64 or URL),
  status: String (available/sold/discontinued),
  quality: String (standard/premium/organic),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Market Price Model
```javascript
{
  _id: ObjectId,
  crop: String (Rice/Paddy/Wheat/Daal),
  variety: String,
  state: String,
  district: String,
  mandi: String,
  min: Number,
  max: Number,
  avg: Number,
  change: Number,
  changePercent: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚙️ Environment Variables

### Backend (.env)
```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/kisan-sahayk

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_ENV=development
```

---

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:4000/health

# Get all crops
curl http://localhost:4000/api/crops

# Get market prices
curl http://localhost:4000/api/prices
```

### Test with Postman
1. Import API collection (create from endpoints)
2. Set `http://localhost:4000` as base URL
3. Test endpoints in this order:
   - GET /health
   - POST /api/auth/login
   - GET /api/crops
   - POST /api/crops (with auth token)

---

## 🔧 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in backend/.env
- For MongoDB Atlas, use cloud connection string

### CORS Errors
- Verify backend CORS_ORIGIN includes frontend URL
- For development: `http://localhost:5173`

### API Calls Returning 401
- Clear localStorage and re-login
- Check JWT token is valid
- Backend token might be expired

### Port Already in Use
```bash
# Change port in backend/.env
PORT=4001

# Or kill process using port 4000
# Linux/Mac:
lsof -ti:4000 | xargs kill

# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Vite Dev Server Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Or clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📈 Performance Optimization

### Frontend
- Lazy code splitting with React.lazy()
- Image optimization
- Pagination for crop listings
- Debounce search queries

### Backend
- Database indexing on frequently queried fields
- JWT token caching
- Request rate limiting
- Response compression with gzip

---

## 🚀 Deployment

### Deploy Backend (Heroku Example)
```bash
cd backend
heroku login
heroku create your-app-name
heroku config:set MONGO_URI=your_atlas_connection
git push heroku main
```

### Deploy Frontend (Vercel Example)
```bash
npm install -g vercel
vercel --env VITE_API_URL=https://your-backend-url
```

---

## 📚 Documentation

- [API Documentation](backend/API_DOCUMENTATION.md) - Detailed endpoint reference
- [Backend Structure](backend/BACKEND_STRUCTURE.md) - Backend architecture
- [Integration Guide](INTEGRATION_GUIDE.md) - Frontend-Backend integration
- [README (Backend)](backend/README.md) - Backend setup guide

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Submit pull request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team & Support

**Project:** Kisan Sahayk - Agricultural Marketplace  
**Status:** ✅ Production Ready  
**Last Updated:** March 30, 2026  

### Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@kisansahayk.com
- Check documentation first: [docs/](.)

---

## 🎉 Getting Started

1. **Clone/Download** the project
2. **Run setup script** (`setup.sh` or `setup.bat`)
3. **Configure .env** files (especially MongoDB URI)
4. **Start backend** in one terminal
5. **Start frontend** in another terminal
6. **Open** http://localhost:5173 in browser
7. **Register** or use test credentials
8. **Start using the app!**

---

## 📊 Development Timeline

- ✅ Backend structure and APIs completed
- ✅ Frontend-Backend integration complete
- ✅ Authentication system implemented
- ✅ Database models and seeding ready
- 🔄 Next: UI/UX refinement and additional features

---

## 🌟 Features Coming Soon

- 💬 Direct messaging between farmers and buyers
- 💳 Payment gateway integration
- ⭐ Review and rating system
- 📊 Advanced analytics dashboard
- 🗺️ Geo-location based search
- 📱 Mobile app (React Native)
- 🔔 Push notifications
- 🌐 Multi-language support enhancement

---

**Thank you for using Kisan Sahayk! Happy Farming! 🌾**

---

### Quick Links

- [Frontend](src/) - React application
- [Backend](backend/) - Express/MongoDB API
- [Integration Guide](INTEGRATION_GUIDE.md) - How to connect front & back
- [API Docs](backend/API_DOCUMENTATION.md) - All API endpoints
- [Setup Guide](backend/README.md) - Detailed backend setup

---

**Made with ❤️ for Indian Farmers**
