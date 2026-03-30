# Frontend-Backend Integration Guide

## Overview

The Kisan Sahayk application is now fully integrated with a production-ready Node.js/Express backend with MongoDB. This guide explains how to:

- Run both frontend and backend
- Use the authentication system
- Access backend APIs from components
- Handle errors and loading states

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Step 1: Setup Backend

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file with MongoDB connection
cp .env.example .env

# Edit .env and update:
# - MONGO_URI (your MongoDB connection string)
# - JWT_SECRET (a random secret key)
# - PORT (default: 4000)

# 3. Seed database with sample data (optional)
npm run seed

# 4. Start backend server
npm run dev
```

**Backend running at:** `http://localhost:4000`

### Step 2: Setup Frontend

```bash
# From project root (not in backend folder)

# 1. Install dependencies
npm install

# 2. Create .env file (already configured)
# The .env already has VITE_API_URL=http://localhost:4000

# 3. Start frontend development server
npm run dev
```

**Frontend running at:** `http://localhost:5173`

---

## 🔗 Integration Architecture

```
Frontend (React + Vite)
    ↓
API Client (axios with interceptors)
    ↓
Backend (Express + MongoDB)
    ↓
Database (MongoDB)
```

### Data Flow

1. **Frontend Component** calls an API function
2. **API Service** (src/services/api.js) makes HTTP request with:
   - Automatic JWT token injection
   - Error handling
   - Response formatting
3. **Backend Route** receives request and:
   - Verifies JWT token (if protected)
   - Validates input data
   - Processes business logic
   - Returns JSON response
4. **Frontend Context** updates global state
5. **React Component** re-renders with new data

---

## 🔐 Authentication Flow

### Login/Register

```javascript
// Component
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, user, error } = useAuth();

  const handleSubmit = async (email, password) => {
    try {
      await login({ email, password });
      // User is logged in, token is stored
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    // ... form JSX
  );
}
```

### What Happens:

1. Component calls `login()` which calls `authApi.login()`
2. Backend validates credentials and returns JWT token
3. Token is automatically stored in localStorage
4. API interceptor automatically adds token to all future requests
5. User state is updated and available app-wide

### Protected Routes:

```javascript
// Backend automatically checks token for protected endpoints
// If token is invalid or missing, backend returns 401
// Frontend API interceptor detects 401 and clears auth state
```

---

## 📊 Data Context & Hooks

### Using Crops Context

```javascript
import { useCrops } from '../context/CropsContext';

function CropsList() {
  const { 
    crops,           // Array of crop objects
    loading,         // Boolean - loading state
    error,           // String - error message
    fetchCrops,      // Function to fetch crops
    addCrop,         // Function to create crop
    deleteCrop,      // Function to delete crop
    updateCrop,      // Function to update crop
  } = useCrops();

  // Filter crops
  useEffect(() => {
    fetchCrops({ type: 'Rice', sort: 'price_asc' });
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {crops.map(crop => (
        <div key={crop._id}>
          <h3>{crop.cropType}</h3>
          <p>Price: ₹{crop.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using Prices Context

```javascript
import { usePrices } from '../context/PricesContext';

function MarketAnalysis() {
  const { 
    prices,           // Array of price objects
    fetchPrices,      // Get all prices
    getPricesByCrop,  // Get prices for specific crop
    getAveragePrice,  // Get average price
  } = usePrices();

  useEffect(() => {
    getAveragePrice('Rice').then(data => {
      console.log(`Average price: ₹${data.averagePrice}`);
    });
  }, []);
}
```

### Using Auth Context

```javascript
import { useAuth } from '../context/AuthContext';

function UserProfile() {
  const {
    user,            // Current user object
    token,           // JWT token
    isAuthenticated, // Boolean
    login,           // Login function
    logout,          // Logout function
    loading,         // Loading state
    error,           // Error message
  } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🔌 API Service Usage

### Direct API Calls

```javascript
import { cropsApi, pricesApi, authApi } from '../services/api';

// Get all crops with filters
const { data, total, pages } = await cropsApi.getAll({
  type: 'Rice',
  q: 'basmati',
  sort: 'price_asc',
  page: 1,
  limit: 10,
});

// Get single crop
const crop = await cropsApi.getOne('crop_id_here');

// Create crop (requires authentication)
const newCrop = await cropsApi.create({
  farmerName: 'Raj Kumar',
  phoneNumber: '9876543210',
  cropType: 'Rice',
  quantity: '50 Quintal',
  price: 2500,
  location: 'Punjab',
});

// Get market prices
const prices = await pricesApi.getAll({ crop: 'Rice' });

// Get average price for crop
const avgData = await pricesApi.getAverage('Rice');
// Returns: { crop, count, averagePrice, minPrice, maxPrice, data: [...] }
```

---

## 🛠️ Error Handling

### Try-Catch Pattern

```javascript
async function handleCreateCrop(cropData) {
  try {
    const response = await cropsApi.create(cropData);
    console.log('Crop created:', response.data);
  } catch (error) {
    // Error message is extracted from backend response
    console.error('Failed:', error.message);
  }
}
```

### Interceptor Error Handling

The API client automatically:
- Extracts error messages from backend responses
- Clears auth state on 401 (Unauthorized)
- Adds token to all requests
- Handles network errors gracefully

```javascript
// In src/services/api.js
http.interceptors.request.use(config => {
  const token = localStorage.getItem('kisan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📝 Common Tasks

### Create a Login Form

```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect or show success
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={loading}
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Create a Crop Listing Form

```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCrops } from '../context/CropsContext';

export default function CreateCropForm() {
  const { isAuthenticated } = useAuth();
  const { addCrop, loading, error } = useCrops();
  const [formData, setFormData] = useState({
    farmerName: '',
    phoneNumber: '',
    cropType: 'Rice',
    quantity: '',
    price: '',
    location: '',
  });

  if (!isAuthenticated) {
    return <p>Please log in to create a listing</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCrop(formData);
      alert('Crop listing created!');
      setFormData({ ...formData, quantity: '', price: '' });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="text"
        placeholder="Farmer Name"
        value={formData.farmerName}
        onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
        required
      />
      
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        required
      />
      
      <select
        value={formData.cropType}
        onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
      >
        <option value="Rice">Rice</option>
        <option value="Paddy">Paddy</option>
        <option value="Wheat">Wheat</option>
        <option value="Daal">Daal</option>
      </select>
      
      <input
        type="text"
        placeholder="Quantity (e.g., 50 Quintal)"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        required
      />
      
      <input
        type="number"
        placeholder="Price per Quintal"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
        required
      />
      
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Listing'}
      </button>
    </form>
  );
}
```

### Display Market Prices

```javascript
import { usePrices } from '../context/PricesContext';

export default function PricesTable() {
  const { prices, loading, error, fetchPrices } = usePrices();

  useEffect(() => {
    fetchPrices({ crop: 'Rice', state: 'Punjab' });
  }, []);

  if (loading) return <p>Loading prices...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Variety</th>
          <th>Min</th>
          <th>Max</th>
          <th>Avg</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        {prices.map(price => (
          <tr key={price._id}>
            <td>{price.variety}</td>
            <td>₹{price.min}</td>
            <td>₹{price.max}</td>
            <td>₹{price.avg}</td>
            <td style={{ color: price.change > 0 ? 'green' : 'red' }}>
              {price.change > 0 ? '+' : ''}{price.change}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🧪 Testing the Integration

### Test URL Endpoints

1. **Health Check**
   ```
   GET http://localhost:4000/health
   Response: { "status": "ok", "timestamp": "..." }
   ```

2. **API Version**
   ```
   GET http://localhost:4000/api/version
   Response: { "version": "1.0.0", "name": "Kisan Sahayk API" }
   ```

3. **Get Crops**
   ```
   GET http://localhost:4000/api/crops
   Response: { "success": true, "count": 5, "data": [...] }
   ```

### Test with Frontend

1. Open frontend: `http://localhost:5173`
2. Open browser DevTools (F12) > Network tab
3. Perform actions (login, create crop, view prices)
4. Watch API calls in Network tab
5. Check that responses are successful

---

## 📚 File Structure

```
src/
├── context/
│   ├── AuthContext.jsx      # Authentication state & functions
│   ├── CropsContext.jsx     # Crops state & operations
│   ├── PricesContext.jsx    # Market prices state
│   └── LangContext.jsx      # Language management
├── services/
│   └── api.js               # API client with interceptors
├── pages/
│   ├── Home.jsx
│   ├── Buy.jsx
│   ├── Sell.jsx
│   └── MarketPrices.jsx
├── components/
│   └── ... (various components)
└── App.jsx                  # Main app with all providers

backend/
├── config/
│   └── db.js               # MongoDB connection
├── models/
│   ├── User.js             # User schema
│   ├── Crop.js             # Crop schema
│   └── MarketPrice.js      # Price schema
├── controllers/
│   ├── authController.js   # Auth logic
│   ├── cropController.js   # Crop logic
│   └── priceController.js  # Price logic
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── cropRoutes.js       # Crop endpoints
│   └── priceRoutes.js      # Price endpoints
├── middleware/
│   ├── auth.js             # JWT verification
│   ├── validation.js       # Input validation
│   └── errorHandler.js     # Error handling
├── scripts/
│   └── seed.js             # Database seeding
└── server.js               # Main server file
```

---

## 🔄 Workflow Example: Create & Display Crops

### Frontend Side

1. User fills form in Sell page
2. `handleSubmit` calls `addCrop(cropData)`
3. `useCrops` hook calls `cropsApi.create()`
4. API client adds JWT token to request
5. Frontend shows loading state

### Backend Side

1. Express receives POST /api/crops
2. Crop route calls `createCrop` controller
3. Validation middleware checks input
4. Auth middleware verifies JWT token
5. Controller saves to MongoDB
6. Returns created crop object

### Frontend Side (Cont.)

1. Response arrives at frontend
2. `CropsContext` updates state with new crop
3. Component re-renders showing new crop
4. User sees success message

---

## 🚨 Troubleshooting

### Backend won't start
- Check MongoDB connection string in .env
- Verify MongoDB is running: `mongod`
- Check port 4000 is not in use

### Frontend can't connect to backend
- Check VITE_API_URL in .env is correct
- Verify backend is running on port 4000
- Open DevTools > Network to see request URL

### 401 Unauthorized errors
- Token might be invalid or expired
- Clear localStorage and re-login
- Check JWT_SECRET in backend .env

### CORS errors
- Verify CORS_ORIGIN in backend .env includes frontend URL
- For local dev, should be: `http://localhost:5173`

---

## 📈 Next Steps

1. **Implement more features:**
   - Chat/messaging between farmers and buyers
   - Transaction/payment system
   - Reviews and ratings
   - Push notifications

2. **Optimize performance:**
   - Add image lazy loading
   - Implement pagination
   - Cache API responses

3. **Improve UI/UX:**
   - Add loading skeletons
   - Better error messages
   - Success/confirmation modals

4. **Deployment:**
   - Deploy backend to Heroku/AWS
   - Deploy frontend to Vercel/Netlify
   - Setup production environment variables

---

**Integration Complete!** 🎉

Your frontend and backend are now fully connected and ready for development.
