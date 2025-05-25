const mongoose = require('mongoose');
const User = require('../models/User');

async function verifyDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/parent-guide', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully!');

    // Check if admin account exists
    const admin = await User.findOne({ email: 'admin@admin.com' });
    if (admin) {
      console.log('\nAdmin account found:');
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Name:', admin.name);
      console.log('Verified:', admin.isEmailVerified);
    } else {
      console.log('\nNo admin account found. Creating one...');
      await User.createDefaultParent();
      console.log('Admin account created successfully!');
    }

    // List all users
    const users = await User.find({});
    console.log('\nAll users in database:', users.length);
    users.forEach(user => {
      console.log(`\nUser: ${user.name}`);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Verified:', user.isEmailVerified);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

verifyDatabase(); 