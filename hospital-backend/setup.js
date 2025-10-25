const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');

// Replace with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_management';

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@hospital.com' });
    
    if (!adminExists) {
      console.log('👤 Creating default admin user...');
      
      // Create default department
      const department = await Department.create({
        name: 'General Medicine',
        description: 'General Medicine Department',
        isActive: true
      });

      // Create admin user
      const admin = await User.create({
        email: 'admin@hospital.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        role: 'admin',
        isActive: true
      });

      console.log('✅ Default admin user created:');
      console.log('   Email: admin@hospital.com');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create sample doctor
    const doctorExists = await User.findOne({ email: 'doctor@hospital.com' });
    if (!doctorExists) {
      console.log('👨‍⚕️ Creating sample doctor...');
      
      const generalDept = await Department.findOne({ name: 'General Medicine' });
      
      await User.create({
        email: 'doctor@hospital.com',
        password: 'doctor123',
        firstName: 'Dr. Sarah',
        lastName: 'Smith',
        phone: '+1234567891',
        role: 'doctor',
        specialization: 'Cardiology',
        licenseNumber: 'DOC001',
        department: generalDept._id,
        isActive: true
      });

      console.log('✅ Sample doctor created:');
      console.log('   Email: doctor@hospital.com');
      console.log('   Password: doctor123');
    }

    console.log('✅ Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
