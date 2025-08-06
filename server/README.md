# Airbnb Clone Backend API

A comprehensive backend API for an Airbnb clone application built with Node.js, Express, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Google OAuth integration
- Role-based access control (Admin, Host, User)
- Password reset functionality
- Email verification
- Account lockout protection

### Places Management
- Create, read, update, delete places
- Advanced search and filtering
- Geospatial queries for location-based search
- Photo uploads with image processing
- Availability checking
- Featured places

### Booking System
- Create and manage bookings
- Check-in/check-out functionality
- Booking status management
- Cancellation handling with refund logic
- Host and guest booking views
- Pricing calculations

### Review System
- Place reviews and ratings
- Host replies to reviews
- Review flagging system
- Rating aggregation
- Review moderation

### File Management
- Image upload and processing
- Automatic image resizing
- File cleanup utilities
- Storage statistics

## 📁 Project Structure

```
server/
├── controllers/           # Route controllers
│   ├── authController.js     # Authentication logic
│   ├── placeController.js    # Place management
│   ├── bookingController.js  # Booking operations
│   ├── reviewController.js   # Review system
│   └── uploadController.js   # File uploads
├── middleware/           # Express middleware
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling
│   └── notFound.js          # 404 handler
├── models/              # MongoDB models
│   ├── User.js              # User schema
│   ├── Place.js             # Place schema
│   ├── Booking.js           # Booking schema
│   └── Review.js            # Review schema
├── routes/              # API routes
│   ├── authRoutes.js        # Auth endpoints
│   ├── placeRoutes.js       # Place endpoints
│   ├── bookingRoutes.js     # Booking endpoints
│   ├── reviewRoutes.js      # Review endpoints
│   └── uploadRoutes.js      # Upload endpoints
├── uploads/             # File storage
│   ├── avatars/             # User avatars
│   └── places/              # Place photos
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies
└── index.js            # Server entry point
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd airbnb-clone/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/airbnb_clone
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # User login
POST   /api/auth/google             # Google OAuth login
POST   /api/auth/logout             # User logout
GET    /api/auth/me                 # Get current user
PATCH  /api/auth/update-me          # Update user profile
PATCH  /api/auth/update-password    # Change password
POST   /api/auth/forgot-password    # Request password reset
PATCH  /api/auth/reset-password/:token  # Reset password
```

### Places
```
GET    /api/places                  # Get all places
GET    /api/places/search           # Search places
GET    /api/places/featured         # Get featured places
GET    /api/places/:id              # Get single place
POST   /api/places                  # Create new place
PATCH  /api/places/:id              # Update place
DELETE /api/places/:id              # Delete place
GET    /api/places/user/my-places   # Get user's places
POST   /api/places/:id/photos       # Upload place photos
```

### Bookings
```
GET    /api/bookings/my-bookings    # Get user's bookings
GET    /api/bookings/host-bookings  # Get host's bookings
GET    /api/bookings/:id            # Get single booking
POST   /api/bookings                # Create booking
PATCH  /api/bookings/:id/status     # Update booking status
PATCH  /api/bookings/:id/cancel     # Cancel booking
PATCH  /api/bookings/:id/check-in   # Check-in guest
PATCH  /api/bookings/:id/check-out  # Check-out guest
```

### Reviews
```
GET    /api/reviews/place/:placeId  # Get place reviews
GET    /api/reviews/user/my-reviews # Get user's reviews
POST   /api/reviews                 # Create review
PATCH  /api/reviews/:id             # Update review
DELETE /api/reviews/:id             # Delete review
POST   /api/reviews/:id/reply       # Reply to review (host)
POST   /api/reviews/:id/flag        # Flag inappropriate review
```

### File Uploads
```
POST   /api/uploads/avatar          # Upload user avatar
GET    /api/uploads/stats           # Get upload statistics (admin)
DELETE /api/uploads/cleanup         # Cleanup orphaned files (admin)
```

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in requests:

```javascript
// In headers
Authorization: Bearer <token>

// Or as HTTP-only cookie (automatically handled)
Cookie: jwt=<token>
```

## 👥 User Roles

- **User**: Can book places, write reviews
- **Host**: Can create places, manage bookings, reply to reviews
- **Admin**: Full access to all resources

## 🗄️ Database Models

### User Model
- Authentication (email/password, Google OAuth)
- Profile information (name, avatar, bio)
- Security features (login attempts, account locking)
- Role management (user, host, admin)

### Place Model
- Property details (title, description, type, price)
- Location with geospatial indexing
- Amenities and features
- Photo gallery
- Availability calendar
- Rating aggregation

### Booking Model
- Guest and host references
- Date range (check-in/check-out)
- Pricing breakdown
- Status tracking
- Cancellation handling

### Review Model
- Rating and comment
- Category ratings (cleanliness, accuracy, etc.)
- Host replies
- Flagging system

## 🛡️ Security Features

- **Rate Limiting**: Prevents API abuse
- **Helmet**: Security headers
- **CORS**: Cross-origin request handling
- **Input Validation**: Mongoose schema validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation
- **File Upload Security**: Type and size validation
- **Error Handling**: Secure error responses

## 🚦 Error Handling

The API uses consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "statusCode": 400,
  "isOperational": true
}
```

## 📊 Monitoring

### Health Check
```
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Airbnb Clone API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/airbnb_clone` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🚀 Deployment

### Production Setup

1. **Set environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/airbnb_clone
   JWT_SECRET=production-secret-key
   CLIENT_URL=https://your-frontend-domain.com
   ```

2. **Build and start**
   ```bash
   npm start
   ```

### Docker Deployment (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Zaio Full Stack Developer Boot Camp capstone project.

## 🆘 Support

For support and questions:
- Check the documentation
- Review error logs
- Test API endpoints with Postman/Thunder Client
- Verify environment configuration
