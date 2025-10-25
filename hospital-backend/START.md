# Quick Start Guide

## Step 1: Create .env file

Create a `.env` file in the `hospital-backend` folder with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/hospital_management
JWT_SECRET=hospital_management_secret_key_2024
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 2: Install dependencies

```bash
cd hospital-backend
npm install
```

## Step 3: Setup database

```bash
node setup.js
```

This creates default users:
- **Admin**: `admin@hospital.com` / `admin123`
- **Doctor**: `doctor@hospital.com` / `doctor123`

## Step 4: Start the server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Step 5: Start the frontend

Open a new terminal:

```bash
cd hospital-frontend
npm start
```

The frontend will start on `http://localhost:3000`

## Test Login

Go to `http://localhost:3000/login` and login with:
- Email: `admin@hospital.com`
- Password: `admin123`

## Troubleshooting

**Error: Cannot connect to MongoDB**
- Make sure your MongoDB URI is correct in `.env`
- For MongoDB Atlas, make sure your IP is whitelisted
- Check if your database user has proper permissions

**Error: 500 Internal Server Error**
- Check the backend console for detailed error messages
- Make sure all environment variables are set
- Verify MongoDB connection

**Error: JWT Secret missing**
- Make sure JWT_SECRET is set in `.env` file
