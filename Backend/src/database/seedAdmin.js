const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.mongoUrl);
    console.log('Database connected for admin seeding...');

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('An Administrator user already exists in the system:', adminExists.email);
      process.exit(0);
    }

    const adminEmail = 'admin@smartlink.com';
    const adminPassword = 'adminSecurePassword123';

    await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    console.log('------------------------------------------');
    console.log('Administrator user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Please change this password in production!');
    console.log('------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding admin user failed:', error);
    process.exit(1);
  }
};

seedAdmin();
