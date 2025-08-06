# 🏠 Airbnb Clone - Full Stack Application

A complete Airbnb clone built as a capstone project for the Zaio Full Stack Developer Boot Camp. This application features user authentication, property listings, booking management, and an admin dashboard.

## 🚀 Live Demo

- **GitHub Repository**: [https://github.com/Takachapwanya1999/Backend-Server](https://github.com/Takachapwanya1999/Backend-Server)
- **Frontend**: [Deploy to Render from GitHub](https://render.com)
- **Backend API**: [Deploy to Render from GitHub](https://render.com)

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication
- Google OAuth integration
- Profile management with avatar uploads
- Admin and user roles

### 🏡 Property Management
- Property listing creation and editing
- Multiple photo uploads
- Property search and filtering
- Detailed property pages
- Amenities and features selection

### 📅 Booking System
- Date-based availability checking
- Booking creation and management
- Booking history for users and hosts
- Payment integration ready

### 👑 Admin Dashboard
- User management
- Property oversight
- Booking statistics
- Revenue tracking
- Admin-only features

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Mobile-first approach
- Dark/light mode support
- Interactive components with Radix UI
- Loading states and error handling

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled accessible components
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Atlas cloud hosting
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Render** - Cloud hosting platform
- **MongoDB Atlas** - Cloud database service
- **Git/GitHub** - Version control and CI/CD
- **Environment Variables** - Secure configuration management

## 🏗 Project Structure

```
airbnb-clone/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── providers/     # Context providers
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS styles
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads
│   ├── utils/            # Backend utilities
│   ├── package.json
│   └── index.js
├── docs/                 # Documentation
├── render.yaml          # Render deployment config
└── package.json         # Root package file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Takachapwanya1999/Backend-Server.git
cd Backend-Server
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

3. **Environment Setup**
```bash
# Server environment (.env in server/)
NODE_ENV=development
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

# Client environment (.env in client/)
VITE_BASE_URL=http://localhost:4000/api
VITE_CLIENT_URL=http://localhost:5173
```

4. **Start Development Servers**
```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend only
npm run client  # Frontend only
```

5. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Health Check: http://localhost:4000/api/health

## 🌐 Deployment

This application is configured for deployment on **Render**. See our comprehensive deployment guides:

- [📋 Render Deployment Checklist](./RENDER_DEPLOYMENT_CHECKLIST.md)
- [📖 Detailed Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md)
- [⚙️ Environment Variables Template](/.env.render.template)

### Quick Deploy to Render

1. Fork this repository
2. Connect your GitHub account to Render
3. Create two web services:
   - **Backend**: Root directory `server`, Build: `npm install`, Start: `node index.js`
   - **Frontend**: Root directory `client`, Build: `npm install && npm run build`, Start: `npm run preview`
4. Set environment variables as per the template
5. Deploy!

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register      # User registration
POST /api/auth/login         # User login
GET  /api/auth/profile       # Get user profile
POST /api/auth/logout        # User logout
```

### Places Endpoints
```
GET    /api/places           # Get all places
POST   /api/places           # Create new place
GET    /api/places/:id       # Get place by ID
PUT    /api/places/:id       # Update place
DELETE /api/places/:id       # Delete place
```

### Bookings Endpoints
```
GET  /api/bookings           # Get user bookings
POST /api/bookings           # Create booking
GET  /api/bookings/:id       # Get booking details
PUT  /api/bookings/:id       # Update booking
```

### Admin Endpoints (Admin Only)
```
GET /api/auth/users          # Get all users
GET /api/places/admin/stats  # Get places statistics
GET /api/bookings/stats      # Get booking statistics
```

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Check API health
curl http://localhost:4000/api/health

# Test authentication
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zaio Boot Camp** - For the excellent full-stack development training
- **React Community** - For the amazing ecosystem
- **MongoDB** - For the robust database solution
- **Render** - For reliable and easy deployment

## 📞 Support

If you have any questions or run into issues:

1. Check the [deployment guides](./RENDER_DEPLOYMENT_GUIDE.md)
2. Review the [API documentation](#-api-documentation)
3. Open an issue on GitHub
4. Contact the development team

---

**Built with ❤️ as a capstone project for Zaio Full Stack Developer Boot Camp**
