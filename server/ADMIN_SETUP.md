# 🚀 Admin User Creation Instructions

## Method 1: Manual Database Creation

If you have access to MongoDB directly, insert this document into your `users` collection:

```javascript
{
  "name": "Admin User",
  "email": "admin@airbnb.com", 
  "password": "$2a$12$LQv3c1yqBw2uuCD1Gr/FUOhHc8s7rKiE0g9IrI9LHJo3rZi8w0dru", // "admin123"
  "isAdmin": true,
  "isHost": true,
  "emailVerified": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

## Method 2: Register and Manually Update

1. Register a normal user at http://localhost:5177/register
   - Email: admin@airbnb.com
   - Password: admin123
   - Name: Admin User

2. Then update the user in MongoDB to add admin privileges:
```javascript
db.users.updateOne(
  { email: "admin@airbnb.com" },
  { $set: { isAdmin: true, isHost: true } }
)
```

## Method 3: Use the Registration API with Admin Flag

You can temporarily modify the registration to accept admin users, or use a tool like Postman to register with admin privileges.

## Testing Admin Access

1. Login with admin credentials at http://localhost:5177/login
2. Navigate to http://localhost:5177/admin
3. You should see the Admin Dashboard with:
   - User statistics
   - Property management
   - Booking oversight
   - System analytics

## Admin Features Available

✅ **Dashboard Overview**
- Total users, places, bookings, revenue
- Recent activity monitoring
- System health metrics

✅ **User Management**
- View all users
- Delete users
- Role management (Admin/Host/User)
- User activity tracking

✅ **Property Management**
- View all properties
- Delete properties
- Property status management
- Host verification

✅ **Booking Oversight**
- View all bookings
- Booking status tracking
- Revenue monitoring
- Guest management

This completes the Admin Frontend requirement for your Capstone Project! 🎉
