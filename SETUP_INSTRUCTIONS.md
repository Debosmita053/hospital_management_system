# Hospital Management System - Complete Setup Guide

## 🚀 Quick Setup (Your MongoDB Database)

### Step 1: Create Backend .env File

Create a file named `.env` in the `hospital-backend` folder with this content:

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

**Replace `your-username`, `your-password`, and `your-cluster` with your actual MongoDB Atlas credentials.**

### Step 2: Install Backend Dependencies

Open terminal in the project root and run:

```bash
cd hospital-backend
npm install
```

### Step 3: Setup Database with Default Users

```bash
node setup.js
```

This creates:
- **Admin**: `admin@hospital.com` / `admin123`
- **Doctor**: `doctor@hospital.com` / `doctor123`

### Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📊 Environment: development
🔗 API URL: http://localhost:5000/api
```

### Step 5: Install Frontend Dependencies (in new terminal)

```bash
cd hospital-frontend
npm install
```

### Step 6: Start Frontend (in new terminal)

```bash
cd hospital-frontend
npm start
```

### Step 7: Test the Application

1. Open browser: `http://localhost:3000`
2. Go to Login page
3. Login with:
   - Email: `admin@hospital.com`
   - Password: `admin123`

## 🎯 What's Included

### Backend Features:
- ✅ Authentication & Authorization (JWT)
- ✅ User Management (Admin, Doctor, Nurse, Patient)
- ✅ Patient Management with medical records
- ✅ Doctor Management with schedules
- ✅ Appointment Scheduling System
- ✅ Billing & Payment Management
- ✅ Pharmacy Inventory Management
- ✅ Prescription Management
- ✅ Department Management
- ✅ Room & Bed Management
- ✅ Medical Records
- ✅ Reports & Analytics
- ✅ Dashboard Statistics

### Frontend Features:
- ✅ Modern React UI with Tailwind CSS
- ✅ Admin Dashboard
- ✅ Doctor Dashboard
- ✅ Patient Management
- ✅ Appointment Scheduling
- ✅ Billing Management
- ✅ Pharmacy Inventory
- ✅ Reports & Analytics

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Verify your MongoDB username and password
- Check if your IP is whitelisted in MongoDB Atlas
- Make sure the database user has read/write permissions

**Error: "MongooseServerSelectionError"**
- Check your internet connection
- Verify MongoDB URI is correct
- Make sure you've replaced the placeholder values

### 500 Internal Server Error

1. Check backend console for detailed error
2. Make sure `.env` file exists and has correct values
3. Verify MongoDB connection string
4. Check if all required npm packages are installed

### Cannot Login

1. Make sure backend server is running on port 5000
2. Check browser console for API errors
3. Verify frontend is calling correct API URL
4. Check if default users were created (`node setup.js`)

## 📝 API Documentation

The backend provides RESTful APIs for all features. See `hospital-backend/README.md` for complete API documentation.

### Key Endpoints:
- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Patients**: `/api/patients`
- **Doctors**: `/api/doctors`
- **Appointments**: `/api/appointments`
- **Billing**: `/api/billing`
- **Pharmacy**: `/api/pharmacy`
- **Rooms**: `/api/rooms`
- **Reports**: `/api/reports`

## 🔐 Default Users

After running `node setup.js`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |

## 📁 Project Structure

```
hospital_management_system/
├── hospital-backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── server.js        # Main server file
│   ├── setup.js         # Database setup
│   └── .env             # Environment variables
│
└── hospital-frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── contexts/    # Context providers
    │   ├── services/    # API service
    │   └── App.js       # Main app
    └── package.json
```

## 🎉 You're All Set!

Your Hospital Management System is now ready to use. The backend and frontend are fully connected and functional.

For detailed documentation, see:
- Backend: `hospital-backend/README.md`
- Frontend: `hospital-frontend/README.md`
