const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs'); // Add this import

dotenv.config(); // Must be called before any routes or models that rely on process.env

const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// ─── Production-Ready CORS ────────────────────────────────────────────────────
// Supports both localhost (dev) and the deployed Render frontend simultaneously.
// Trailing slashes on origin values are stripped to avoid subtle mismatches.
const allowedOrigins = [
  'http://localhost:5173', // Vite default dev port
  'http://localhost:3000', // CRA / alternate dev port
  process.env.FRONTEND_URL, // Set this in Render's env dashboard
].filter(Boolean).map((o) => o.replace(/\/$/, '')); // strip trailing slashes

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin header (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error(`CORS policy: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true, // Required for httpOnly cookie auth
  })
);
// ─────────────────────────────────────────────────────────────────────────────

// ─── Routes ──────────────────────────────────────────────────────────────────
// Health Check Router — handles /api and /api/
const healthRouter = express.Router();
healthRouter.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running ✅', 
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});
app.use('/api', healthRouter);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ─── Static Files & SPA Routing (Production) ──────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  // Try multiple possible build paths
  const possiblePaths = [
    path.join(__dirname, '../client/dist'),           // server/client/dist
    path.join(__dirname, '../../client/dist'),        // project/src/server/../../client/dist
    path.join(__dirname, '../public'),                // fallback to public
    path.join(process.cwd(), 'client/dist'),          // from current working directory
    path.join(process.cwd(), '../client/dist'),       // from one level up
  ];

  // Find the first existing build path
  let buildPath = null;
  for (const testPath of possiblePaths) {
    const indexPath = path.join(testPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      buildPath = testPath;
      console.log(`[Static] Found build at: ${buildPath}`);
      break;
    }
  }

  if (buildPath) {
    // Serve static files from the found build path
    app.use(express.static(buildPath));

    // For SPA routing: serve index.html for any non-API routes
    app.use((req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      
      // Serve index.html for all other routes
      res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
          console.error(`[Static] Error sending file: ${err.message}`);
          next(err);
        }
      });
    });
  } else {
    console.error('[Static] Could not find client build files in any of these locations:');
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    
    // Fallback: just return a simple message
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.status(200).send(`
          <html>
            <head><title>Task Manager API</title></head>
            <body>
              <h1>Task Manager API is running</h1>
              <p>The frontend build files are not available. API endpoints are working.</p>
              <p>Build path not found. Please check your deployment configuration.</p>
            </body>
          </html>
        `);
      }
    });
  }
} else {
  app.get('/', (req, res) => {
    res.send('Task Manager API is running in development mode...');
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Error Middleware ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);
// ─────────────────────────────────────────────────────────────────────────────

// ─── Database Connection & Server Start ──────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`[Server] Running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`)
    );
  })
  .catch((err) => {
    console.error('[Server] Failed to connect to the database. Server not started.', err.message);
    process.exit(1);
  });
// ─────────────────────────────────────────────────────────────────────────────
