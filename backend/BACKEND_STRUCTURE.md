# Backend Structure Overview

## 📁 Complete File Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/
│   ├── authController.js        # Authentication logic & user management
│   ├── cropController.js        # Crop listing CRUD operations
│   └── priceController.js       # Market price operations
├── middleware/
│   ├── auth.js                  # JWT authentication & authorization
│   ├── errorHandler.js          # Centralized error handling
│   └── validation.js            # Input validation rules
├── models/
│   ├── User.js                  # User schema (farmer, buyer, admin)
│   ├── Crop.js                  # Crop listing schema
│   └── MarketPrice.js           # Market prices schema
├── routes/
│   ├── authRoutes.js            # Auth endpoints
│   ├── cropRoutes.js            # Crop endpoints
│   └── priceRoutes.js           # Price endpoints
├── scripts/
│   └── seed.js                  # Database seeding with sample data
├── utils/
│   ├── constants.js             # Application constants
│   └── helpers.js               # Utility helper functions
├── server.js                    # Main Express server
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment variables template
├── README.md                    # Main documentation
├── API_DOCUMENTATION.md         # Detailed API endpoint docs
├── .gitignore                   # Git ignore rules
└── (other files)
```

## 🔑 Key Features Implemented

### 1. **Authentication System** (`middleware/auth.js`, `controllers/authController.js`)
- JWT token generation and verification
- User registration with validation
- Secure login with password hashing (bcrypt)
- Role-based access control (RBAC)
- Change password functionality
- User profile management

### 2. **Crop Management** (`controllers/cropController.js`, `routes/cropRoutes.js`)
- Create, read, update, delete crop listings
- Advanced filtering (by type, search query)
- Sorting options (newest, price, quality)
- Pagination support
- Crop status management (available, sold, discontinued)
- Farmer-specific operations (my listings)
- Authorization checks

### 3. **Market Price Management** (`controllers/priceController.js`, `routes/priceRoutes.js`)
- View market rates for different crops
- Filter by crop type and state
- Calculate average prices
- Admin price management
- Bulk price updates
- Price trend tracking (change percentage)

### 4. **Data Validation** (`middleware/validation.js`)
- Express-validator integration
- Crop data validation
- User registration/login validation
- Market price validation
- ObjectId validation

### 5. **Error Handling** (`middleware/errorHandler.js`)
- Centralized error handler
- MongoDB error handling
- JWT error handling
- Validation error parsing
- Consistent error response format
- Development vs. production error details

### 6. **Security Features** (`server.js`)
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting (100 req/15 min)
- Input validation
- Password hashing with bcrypt
- JWT-based authentication
- Authorization middleware

### 7. **Database Models** (`models/`)
- **User**: Farmer, buyer, admin accounts with profile management
- **Crop**: Detailed crop listings with photos, quality levels, harvest dates
- **MarketPrice**: Mandi prices with trend analysis

### 8. **Utility Functions** (`utils/`)
- Phone number validation
- Email validation
- Price formatting
- Percentage change calculation
- Trend emoji generation
- Pagination helper
- User sanitization

### 9. **Database Seeding** (`scripts/seed.js`)
- Sample users (farmer, admin)
- Sample crop listings
- Sample market prices
- Easy development setup

## 📊 Database Models Details

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  role: String (farmer/buyer/admin),
  location: String,
  profilePicture: String,
  isVerified: Boolean,
  isActive: Boolean,
  timestamps: true
}
```

### Crop Model
```javascript
{
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
  photoUrl: String,
  status: String (available/sold/discontinued),
  quality: String (standard/premium/organic),
  harvestDate: Date,
  storageLocation: String,
  isVerified: Boolean,
  timestamps: true
}
```

### MarketPrice Model
```javascript
{
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
  emoji: String,
  currency: String (default: INR),
  unit: String (default: Quintal),
  timestamps: true
}
```

## 🛣️ API Endpoints Summary

### Authentication (5 endpoints)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Crops (7 endpoints)
- `GET /api/crops` - Get all crops (with filters)
- `GET /api/crops/:id` - Get single crop
- `POST /api/crops` - Create crop (protected)
- `GET /api/crops/my-listings` - Get user's crops (protected)
- `PUT /api/crops/:id` - Update crop (protected)
- `PUT /api/crops/:id/status` - Update status (protected)
- `DELETE /api/crops/:id` - Delete crop (protected)

### Market Prices (8 endpoints)
- `GET /api/prices` - Get all prices
- `GET /api/prices/crop/:crop` - Get prices by crop
- `GET /api/prices/average/:crop` - Get average price
- `GET /api/prices/:id` - Get single price
- `POST /api/prices` - Create price (admin)
- `PUT /api/prices/:id` - Update price (admin)
- `DELETE /api/prices/:id` - Delete price (admin)
- `PUT /api/prices/bulk/update` - Bulk update (admin)

**Total: 20 fully functional API endpoints**

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Server
```bash
npm run dev          # Development with nodemon
npm start            # Production
```

### 5. Test Endpoints
Visit `http://localhost:4000/health` or check `/api/version` for API info.

## 📚 Documentation Files

1. **README.md** - General information, setup, and overview
2. **API_DOCUMENTATION.md** - Detailed endpoint documentation with examples
3. **package.json** - Dependencies and npm scripts
4. **.env.example** - Environment variables template

## 🔧 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express-validator** - Input validation
- **Helmet.js** - Security headers
- **CORS** - Cross-origin requests
- **Morgan** - Request logging
- **Rate-limit** - Request throttling
- **Dotenv** - Environment variables

## 📝 Environment Variables Required

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/kisan-sahayk
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## ✅ Quality Assurance

- ✅ Comprehensive error handling
- ✅ Input validation on all endpoints
- ✅ Security best practices implemented
- ✅ Role-based authorization
- ✅ Database indexing for performance
- ✅ Consistent API response format
- ✅ Detailed documentation
- ✅ Sample data seeding
- ✅ Middleware organization
- ✅ Clean code structure

## 🎯 Next Steps (Optional Enhancements)

1. Add email notifications
2. Implement file upload to S3/CloudStorage
3. Add advanced search with Elasticsearch
4. Implement WebSockets for real-time updates
5. Add transaction support for purchases
6. Implement chat/messaging system
7. Add analytics dashboard
8. Implement geo-location features
9. Add payment gateway integration
10. Implement review/rating system

---

**Backend Status:** ✅ **COMPLETE AND PRODUCTION-READY**

The backend is now fully functional with:
- Complete CRUD operations
- Secure authentication
- Role-based access control
- Comprehensive validation
- Error handling
- Database seeding
- Full API documentation

Ready for frontend integration! 🚀
