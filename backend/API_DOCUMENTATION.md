# API Endpoints Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user account

**Request Body:**
```json
{
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "password": "password123",
  "phoneNumber": "9876543210",
  "role": "farmer",
  "location": "Punjab"
}
```

**Response:** 
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "role": "farmer"
  }
}
```

---

### POST /auth/login
Login user and get JWT token

**Request Body:**
```json
{
  "email": "raj@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

### GET /auth/me
Get current authenticated user profile

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "phoneNumber": "9876543210",
    "role": "farmer",
    "location": "Punjab",
    "isVerified": true,
    "createdAt": "2026-03-30T10:00:00.000Z"
  }
}
```

---

### PUT /auth/profile
Update user profile

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Raj Kumar Singh",
  "phoneNumber": "9876543212",
  "location": "Jalandhar",
  "profilePicture": "base64_image_data_or_url"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

### PUT /auth/change-password
Change user password

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🌾 Crop Endpoints

### GET /crops
Get all crop listings with filtering and pagination

**Query Parameters:**
- `type` - Filter by crop type (Rice, Paddy, Wheat, Daal)
- `q` - Search query (searches in farmerName, location, variety)
- `sort` - Sort option (newest, oldest, price_asc, price_desc, quality)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (available, sold, discontinued)

**Example:**
```
GET /crops?type=Rice&q=basmati&sort=price_asc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "pages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "farmerName": "Raj Kumar",
      "phoneNumber": "9876543210",
      "cropType": "Rice",
      "variety": "Basmati",
      "quantity": "50 Quintal",
      "price": 2500,
      "location": "Jalandhar",
      "status": "available",
      "quality": "premium",
      "createdAt": "2026-03-30T10:00:00.000Z"
    }
  ]
}
```

---

### GET /crops/:id
Get single crop listing details

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "farmerId": "507f1f77bcf86cd799439010",
    "farmerName": "Raj Kumar",
    "phoneNumber": "9876543210",
    "cropType": "Rice",
    "variety": "Basmati",
    "quantity": "50 Quintal",
    "price": 2500,
    "location": "Jalandhar",
    "district": "Jalandhar",
    "state": "Punjab",
    "description": "Premium basmati rice, freshly harvested",
    "photoUrl": "base64_image_or_url",
    "quality": "premium",
    "status": "available",
    "harvestDate": "2026-03-15T00:00:00.000Z",
    "createdAt": "2026-03-30T10:00:00.000Z",
    "updatedAt": "2026-03-30T10:00:00.000Z"
  }
}
```

---

### POST /crops
Create a new crop listing

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
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
  "description": "Premium quality basmati rice",
  "quality": "premium",
  "harvestDate": "2026-03-15",
  "storageLoc": "Farm storage"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Crop listing created successfully",
  "data": { ... }
}
```

---

### PUT /crops/:id
Update a crop listing

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Any field from crop schema)
```json
{
  "price": 2600,
  "quantity": "45 Quintal",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Crop updated successfully",
  "data": { ... }
}
```

---

### PUT /crops/:id/status
Update crop status

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "sold"
}
```

**Valid Status Values:** `available`, `sold`, `discontinued`

**Response:**
```json
{
  "success": true,
  "message": "Crop marked as sold",
  "data": { ... }
}
```

---

### DELETE /crops/:id
Delete a crop listing

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Crop deleted successfully"
}
```

---

### GET /crops/my-listings
Get farmer's own crop listings

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [ ... ]
}
```

---

## 💹 Market Price Endpoints

### GET /prices
Get all market price records

**Query Parameters:**
- `crop` - Filter by crop type (Rice, Paddy, Wheat, Daal)
- `state` - Filter by state (case-insensitive substring match)
- `sort` - Sort option (crop, price_asc, price_desc, highest, lowest, updated)

**Example:**
```
GET /prices?crop=Rice&state=Punjab&sort=price_asc
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "crop": "Rice",
      "variety": "Basmati",
      "state": "Punjab",
      "district": "Jalandhar",
      "mandi": "Jalandhar Mandi",
      "min": 2400,
      "max": 2600,
      "avg": 2500,
      "change": 50,
      "changePercent": 2.04,
      "emoji": "🌾",
      "updatedAt": "2026-03-30T10:00:00.000Z"
    }
  ]
}
```

---

### GET /prices/crop/:crop
Get prices for a specific crop type

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [ ... ]
}
```

---

### GET /prices/average/:crop
Get average price analysis for a crop

**Response:**
```json
{
  "success": true,
  "crop": "Rice",
  "count": 8,
  "averagePrice": 2475,
  "minPrice": 2350,
  "maxPrice": 2550,
  "data": [ ... ]
}
```

---

### GET /prices/:id
Get single price record

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### POST /prices
Create a new market price record (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "crop": "Rice",
  "variety": "Basmati",
  "state": "Punjab",
  "district": "Jalandhar",
  "mandi": "Jalandhar Mandi",
  "min": 2400,
  "max": 2600,
  "avg": 2500,
  "change": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Price record created successfully",
  "data": { ... }
}
```

---

### PUT /prices/:id
Update market price record (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "min": 2400,
  "max": 2600,
  "avg": 2500,
  "change": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Price updated successfully",
  "data": { ... }
}
```

---

### DELETE /prices/:id
Delete price record (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "message": "Price record deleted successfully"
}
```

---

### PUT /prices/bulk/update
Bulk update multiple price records (Admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "priceUpdates": [
    {
      "id": "507f1f77bcf86cd799439011",
      "min": 2400,
      "max": 2600,
      "avg": 2500
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "min": 2100,
      "max": 2300,
      "avg": 2200
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 prices updated successfully",
  "data": [ ... ]
}
```

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate value)
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error

---

## 🧪 Example cURL Commands

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Farmer","email":"farmer@test.com","password":"pass123","phoneNumber":"9876543210","role":"farmer"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"pass123"}'
```

### Create Crop
```bash
curl -X POST http://localhost:4000/api/crops \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"farmerName":"Raj","phoneNumber":"9876543210","cropType":"Rice","variety":"Basmati","quantity":"50 Quintal","price":2500,"location":"Punjab"}'
```

### Get Crops with Filter
```bash
curl -X GET "http://localhost:4000/api/crops?type=Rice&sort=price_asc"
```

### Get Market Prices
```bash
curl -X GET "http://localhost:4000/api/prices?crop=Rice&state=Punjab"
```

---

**Last Updated:** March 30, 2026
