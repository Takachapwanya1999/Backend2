// Production server entry point for Render deployment
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

// Check required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n📋 Please set these variables in your Render Dashboard:');
  console.error('   Go to: Service Settings → Environment Variables');
  console.error('\n🔗 Guide: https://render.com/docs/environment-variables');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');

// Import routes
import authRoutes from './server/routes/authRoutes.js';
import placeRoutes from './server/routes/placeRoutes.js';
import bookingRoutes from './server/routes/bookingRoutes.js';
import reviewRoutes from './server/routes/reviewRoutes.js';
import uploadRoutes from './server/routes/uploadRoutes.js';

// Import middleware
import { errorHandler } from './server/middleware/errorHandler.js';
import { notFound } from './server/middleware/notFound.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://airbnb-clone-client.onrender.com'
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'server', 'uploads')));

// Root route for Render and health check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Airbnb Clone API!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/uploads', uploadRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      console.error('Please set the following environment variables in Render Dashboard:');
      console.error('- MONGODB_URI');
      console.error('- JWT_SECRET');
      console.error('- NODE_ENV');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
});
