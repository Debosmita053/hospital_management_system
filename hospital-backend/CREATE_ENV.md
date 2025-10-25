# CREATE .env FILE - INSTRUCTIONS

## ⚠️ CRITICAL: You must create a .env file before starting the server!

The `.env` file is required for the backend to connect to your MongoDB database.

## Step-by-Step Instructions:

### Method 1: Manual Creation (Easiest)

1. Open File Explorer and navigate to: `hospital-backend` folder

2. Right-click in the folder → New → Text Document

3. Name it exactly: `.env` (include the dot at the beginning!)

4. Double-click to open the file

5. Copy and paste this content:

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

6. **IMPORTANT:** Replace `your-username`, `your-password`, and `your-cluster` with your actual MongoDB Atlas credentials

7. Save the file (Ctrl+S)

### Method 2: Using PowerShell (Advanced)

Open PowerShell in the `hospital-backend` folder and run:

```powershell
@"
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/hospital_management
JWT_SECRET=hospital_management_secret_key_2024
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
"@ | Out-File -FilePath .env -Encoding utf8
```

Then edit `.env` to add your MongoDB credentials.

## Getting Your MongoDB Connection String

### If using MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Login to your account
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your actual database password
7. Replace `<dbname>` with `hospital_management`

Example:
```
mongodb+srv://admin:Mypassword123@cluster0.abc123.mongodb.net/hospital_management
```

### If using Local MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/hospital_management
```

## After Creating .env:

1. Install dependencies (if not done):
   ```bash
   npm install
   ```

2. Setup database with default users:
   ```bash
   node setup.js
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Verification

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

If you see "❌ MongoDB connection error", check your MONGODB_URI in the `.env` file.
