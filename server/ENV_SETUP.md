# Environment Variables for Wedding Management System

## MongoDB Configuration
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/wedding)

## Frontend Configuration
- `REACT_APP_API_BASE_URL`: Backend API URL (default: http://localhost:3000)

## Server Configuration
- `JWT_SECRET`: Secret key for JWT tokens (required for production)
- `NODE_ENV`: Environment (development/production)

## Setup Instructions

1. Copy `.env.local.example` to `.env.local` in the server directory
2. Update the MongoDB URI with your actual MongoDB connection string
3. For production, set a strong JWT_SECRET
4. Ensure MongoDB is running and accessible

