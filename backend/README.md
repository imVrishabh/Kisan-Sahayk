# Kisan Sahayk Backend API

A comprehensive REST API for the Kisan Sahayk agricultural marketplace platform. Built with Express.js, MongoDB, and JWT authentication.

## 📋 Features

- **User Authentication**: Secure JWT-based authentication for farmers, buyers, and admins
- **Crop Management**: Create, read, update, delete crop listings with advanced filtering and sorting
- **Market Prices**: Real-time market price data with trend analysis
- **Admin Dashboard**: Full admin controls for managing users and prices
- **Security**: Helmet.js, rate limiting, CORS protection
- **Validation**: Express-validator for comprehensive input validation
- **Error Handling**: Centralized error handler with consistent JSON responses
- **Logging**: Morgan middleware for request logging
- **Pagination**: Built-in pagination support for large datasets

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud via MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/kisan-sahayk
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev          # Development with nodemon
   npm start            # Production
   ```

   The API will be running at `http://localhost:4000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login user |
| GET | `/me` | ✅ | Get current user |
| PUT | `/profile` | ✅ | Update user profile |
| PUT | `/change-password` | ✅ | Change password |

### Crop Routes (`/api/crops`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all crops (filterable) |
| GET | `/:id` | ❌ | Get single crop |
| POST | `/` | ✅ | Create crop listing |
| GET | `/my-listings` | ✅ | Get farmer's listings |
| PUT | `/:id` | ✅ | Update crop |
| PUT | `/:id/status` | ✅ | Update crop status |
| DELETE | `/:id` | ✅ | Delete crop |

### Market Price Routes (`/api/prices`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all prices (filterable) |
| GET | `/crop/:crop` | ❌ | Get prices by crop type |
| GET | `/average/:crop` | ❌ | Get average price for crop |
| GET | `/:id` | ❌ | Get single price record |
| POST | `/` | 🔐 | Create price (admin) |
| PUT | `/:id` | 🔐 | Update price (admin) |
| DELETE | `/:id` | 🔐 | Delete price (admin) |
| PUT | `/bulk/update` | 🔐 | Bulk update prices (admin) |

*Legend: ❌ = No auth, ✅ = Requires auth, 🔐 = Admin only*

## 📝 Example Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "password": "password123",
  "phoneNumber": "9876543210",
  "role": "farmer",
  "location": "Punjab"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "raj@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "role": "farmer"
  }
}
```

### Create Crop Listing
```bash
POST /api/crops
Authorization: Bearer {token}
Content-Type: application/json

{
  "farmerName": "Raj Kumar",
  "phoneNumber": "9876543210",
  "cropType": "Rice",
  "variety": "Basmati",
  "quantity": "50 Quintal",
  "price": 2500,
  "location": "Jalandhar",
  "district": "Jalandhar",
  "state": "Punjab",
  "description": "Premium basmati rice",
  "quality": "premium"
}
```

### Get Crops with Filters
```bash
GET /api/crops?type=Rice&q=basmati&sort=price_asc&page=1&limit=10
```

Query parameters:
- `type`: Filter by crop type (Rice, Paddy, Wheat, Daal)
- `q`: Search query (farmerName, location, variety)
- `sort`: Sort by (newest, oldest, price_asc, price_desc, quality)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (available, sold, discontinued)

### Get Market Prices
```bash
GET /api/prices?crop=Rice&state=Punjab&sort=price_asc
```

### Update Market Price (Admin)
```bash
PUT /api/prices/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "min": 2400,
  "max": 2600,
  "avg": 2500,
  "change": 50
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Supported Crop Types

- Rice
- Paddy
- Wheat
- Daal

## 📊 Crop Quality Levels

- `standard` - Standard quality
- `premium` - Premium quality
- `organic` - Organic certified

## 👥 User Roles

- `farmer` - Crop seller
- `buyer` - Crop purchaser
- `admin` - System administrator

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  role: String (farmer/admin/buyer),
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
  cropType: String,
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
  crop: String,
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
  currency: String,
  unit: String,
  timestamps: true
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 4000 | Server port |
| NODE_ENV | development | Environment mode |
| MONGO_URI | mongodb://localhost:27017/kisan-sahayk | MongoDB connection string |
| JWT_SECRET | - | JWT signing secret (required) |
| JWT_EXPIRE | 7d | JWT expiration time |
| CORS_ORIGIN | http://localhost:5173 | Allowed CORS origins |

## 🛡️ Security Features

- **Helmet.js**: Sets HTTP security headers
- **CORS**: Cross-Origin Resource Sharing protection
- **Rate Limiting**: 100 requests per 15 minutes
- **JWT**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds (10)
- **Input Validation**: Express-validator for all inputs
- **Error Handling**: Sanitized error messages in production

## 🐛 Error Handling

All errors are returned in a consistent JSON format:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid token |
| 403 | Forbidden / insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict / duplicate value |
| 422 | Validation error |
| 500 | Internal server error |

## 📚 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **cors**: CORS middleware
- **helmet**: Security headers
- **morgan**: HTTP request logger
- **express-rate-limit**: Rate limiting
- **dotenv**: Environment variables

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Farmer","email":"farmer@test.com","password":"pass123","phoneNumber":"9876543210"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"pass123"}'

# Create crop (replace TOKEN)
curl -X POST http://localhost:4000/api/crops \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"farmerName":"Raj","phoneNumber":"9876543210","cropType":"Rice","quantity":"50 Quintal","price":2500,"location":"Punjab"}'
```

### Using Postman

1. Import the endpoints into Postman
2. Set the `{{base_url}}` variable to `http://localhost:4000`
3. Set the `{{token}}` variable after login
4. Use tokens in Authorization header for protected routes

## 🚀 Deployment

### Deploy to Heroku

```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Deploy to DigitalOcean/AWS

1. Set up Node.js environment
2. Set environment variables
3. Run `npm install && npm start`
4. Use PM2 or similar for process management

## 📖 API Documentation

Full API documentation available at `/api/version` endpoint.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy Farming! 🌾**
