# Hospital Management System - Backend API

Complete backend API for the Hospital Management System built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 Authentication & Authorization (JWT)
- 👥 User Management (Admin, Doctor, Nurse, Patient)
- 🏥 Patient Management
- 👨‍⚕️ Doctor Management
- 📅 Appointment Scheduling
- 💰 Billing & Payment Management
- 💊 Pharmacy Inventory
- 📋 Prescription Management
- 🏢 Department Management
- 🛏️ Room & Bed Management
- 📊 Medical Records
- 📈 Reports & Analytics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**

Create a `.env` file in the root directory with the following content:

```env
# Database - Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/hospital_management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. **Setup database with default users:**

```bash
node setup.js
```

This will create:
- Admin user: `admin@hospital.com` / `admin123`
- Sample doctor: `doctor@hospital.com` / `doctor123`

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `POST /api/patients/:id/assign-doctor` - Assign doctor
- `POST /api/patients/:id/assign-room` - Assign room
- `GET /api/patients/:id/medical-history` - Get medical history

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `GET /api/doctors/:id/patients` - Get doctor's patients
- `GET /api/doctors/:id/appointments` - Get doctor's appointments
- `GET /api/doctors/:id/schedule` - Get doctor's schedule
- `GET /api/doctors/:id/dashboard` - Get doctor dashboard

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `PUT /api/appointments/:id/status` - Update status
- `GET /api/appointments/available-slots` - Get available slots
- `GET /api/appointments/dashboard` - Get dashboard stats

### Billing
- `GET /api/billing` - Get all bills
- `GET /api/billing/:id` - Get bill by ID
- `POST /api/billing` - Create bill
- `PUT /api/billing/:id` - Update bill
- `POST /api/billing/:id/payment` - Record payment
- `GET /api/billing/dashboard` - Get dashboard stats
- `GET /api/billing/patient/:patientId` - Get patient bills

### Pharmacy
- `GET /api/pharmacy` - Get all items
- `GET /api/pharmacy/:id` - Get item by ID
- `POST /api/pharmacy` - Create item
- `PUT /api/pharmacy/:id` - Update item
- `DELETE /api/pharmacy/:id` - Delete item
- `PUT /api/pharmacy/:id/stock` - Update stock
- `GET /api/pharmacy/low-stock` - Get low stock items
- `GET /api/pharmacy/expired` - Get expired items
- `GET /api/pharmacy/dashboard` - Get dashboard stats

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department
- `GET /api/departments/:id/staff` - Get department staff
- `POST /api/departments/:id/services` - Add service
- `PUT /api/departments/:id/services/:serviceId` - Update service
- `DELETE /api/departments/:id/services/:serviceId` - Delete service

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `POST /api/rooms/:id/assign-patient` - Assign patient
- `POST /api/rooms/:id/discharge-patient` - Discharge patient
- `GET /api/rooms/available` - Get available rooms
- `GET /api/rooms/dashboard` - Get dashboard stats

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff
- `PUT /api/staff/:id/status` - Update status
- `GET /api/staff/dashboard` - Get dashboard stats

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/:id` - Get prescription by ID
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `PUT /api/prescriptions/:id/status` - Update status
- `GET /api/prescriptions/patient/:patientId` - Get patient prescriptions
- `GET /api/prescriptions/dashboard` - Get dashboard stats

### Medical Records
- `GET /api/medical-records` - Get all records
- `GET /api/medical-records/:id` - Get record by ID
- `POST /api/medical-records` - Create record
- `PUT /api/medical-records/:id` - Update record
- `GET /api/medical-records/patient/:patientId` - Get patient records

### Reports
- `GET /api/reports/dashboard` - Get dashboard stats
- `GET /api/reports/revenue` - Get revenue report
- `GET /api/reports/patients` - Get patient report
- `GET /api/reports/appointments` - Get appointment report

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Roles

- **admin**: Full access to all features
- **doctor**: Access to patients, appointments, prescriptions, medical records
- **nurse**: Access to patients, rooms, appointments
- **patient**: Access to own records, appointments, bills

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Database Models

- User (with role-based fields)
- Patient
- Department
- Room
- Appointment
- Prescription
- Billing
- Pharmacy
- MedicalRecord

## Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation
- Role-based access control

## Frontend Integration

The backend is configured to work with the React frontend running on `http://localhost:3000`.

Update the frontend API URL in `hospital-frontend/src/services/api.js` if needed.

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for cloud MongoDB

**500 Internal Server Error:**
- Check console logs for detailed error
- Verify MongoDB connection
- Ensure all required fields are provided
- Check environment variables

**Authentication Errors:**
- Verify JWT_SECRET is set in `.env`
- Check token expiration
- Ensure token is sent in Authorization header

## License

MIT
