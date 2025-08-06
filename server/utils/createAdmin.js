// Admin User Creation Script
// Run this in your MongoDB to create an admin user

const bcrypt = require('bcryptjs');

// Create admin user object
const createAdminUser = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  return {
    name: 'Admin User',
    email: 'admin@airbnb.com',
    password: hashedPassword,
    isAdmin: true,
    isHost: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// You can use this object to manually insert an admin user
// or modify your registration to create admin users

module.exports = { createAdminUser };
