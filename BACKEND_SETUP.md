# Backend Setup Instructions

## ⚠️ IMPORTANT: Create .env file FIRST!

Before running the backend, you MUST create a `.env` file in the `hospital-backend` folder.

### Option 1: Manual Creation

1. Go to `hospital-backend` folder
2. Create a new file named `.env` (not `.env.txt`)
3. Add the following content (replace with YOUR MongoDB connection string):

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

### Option 2: Copy from Example

1. Copy `hospital-backend/env.example` to `hospital-backend/.env`
2. Edit `.env` and replace `MONGODB_URI` with your actual connection string

## Installation Steps

### 1. Install Dependencies

```bash
cd hospital-backend
npm install
```

### 2. Setup Database (Creates default users)

```bash
node setup.js
```

This creates:
- Admin: `admin@hospital.com` / `admin123`
- Doctor: `doctor@hospital.com` / `doctor123`

### 3. Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

## Common Issues and Solutions

### Issue 1: "Cannot find module 'dotenv'"

**Solution:** Run `npm install` in the `hospital-backend` folder

### Issue 2: "MongoServerError: Authentication failed"

**Solutions:**
- Check your MongoDB URI in `.env` file
- Verify username and password are correct
- Make sure you've replaced placeholder values
- Check if your IP is whitelisted in MongoDB Atlas

### Issue 3: "MongooseServerSelectionError"

**Solutions:**
- Check your internet connection
- Verify MongoDB URI format is correct
- For Atlas: Check network access settings
- Make sure the database exists

### Issue 4: Server starts but API returns 500 error

**Solutions:**
- Check the console for detailed error messages
- Verify all environment variables are set
- Make sure MongoDB connection is successful
- Check if default users were created (`node setup.js`)

### Issue 5: "JWT_SECRET is not defined"

**Solution:** Make sure `.env` file exists and contains `JWT_SECRET`

## Testing the Backend

### 1. Check if server is running:

Visit: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...
}
```

### 2. Test Login API:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@hospital.com",
  "password": "admin123"
}
```

Should return:
```json
{
  "message": "Login successful",
  "token": "...",
  "user": {...}
}
```

## MongoDB Atlas Setup

If you're using MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hospital_management
   ```
5. Make sure to:
   - Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
   - Create a database user with read/write permissions
   - Note: Replace `<password>` in connection string with actual password

## Next Steps

Once backend is running successfully:

1. Start the frontend: `cd hospital-frontend && npm start`
2. Open browser: `http://localhost:3000`
3. Login with: `admin@hospital.com` / `admin123`

## Need Help?

Check the backend console for detailed error messages. Most issues are related to:
- Missing `.env` file
- Incorrect MongoDB connection string
- Missing environment variables
- Network/firewall issues with MongoDB Atlas
