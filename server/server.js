const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean).map((o) => o.replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error(`CORS policy: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true,
  })
);

// ─── Routes ──────────────────────────────────────────────────────────────────
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
  // Log current directory for debugging
  console.log('[Debug] Current working directory:', process.cwd());
  console.log('[Debug] __dirname:', __dirname);
  
  // Try multiple possible build paths
  const possiblePaths = [
    path.join(__dirname, '../client/dist'),           // server/../client/dist
    path.join(__dirname, '../../client/dist'),        // src/server/../../client/dist
    path.join(process.cwd(), 'client/dist'),          // from current working directory
    path.join(process.cwd(), '../client/dist'),       // from one level up
    '/opt/render/project/src/client/dist',             // Absolute path from error
    '/opt/render/project/client/dist',                 // Alternative absolute path
  ];

  // Find the first existing build path
  let buildPath = null;
  for (const testPath of possiblePaths) {
    const indexPath = path.join(testPath, 'index.html');
    console.log(`[Debug] Checking path: ${indexPath}`);
    if (fs.existsSync(indexPath)) {
      buildPath = testPath;
      console.log(`✅ [Static] Found build at: ${buildPath}`);
      break;
    }
  }

  if (buildPath) {
    // Serve static files from the found build path
    app.use(express.static(buildPath));

    // IMPORTANT: This middleware handles all non-API routes WITHOUT using wildcard patterns
    // It checks the request path and serves index.html if it's not an API route
    app.use((req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      
      // Check if the file exists in the build folder
      const filePath = path.join(buildPath, req.path);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        // If it's a static file, let express.static handle it
        return next();
      }
      
      // For all other routes, serve index.html (SPA support)
      res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
          console.error(`❌ [Static] Error sending file: ${err.message}`);
          next(err);
        }
      });
    });
  } else {
    console.error('❌ [Static] Could not find client build files in any of these locations:');
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    
    // Don't use app.get('*') - use middleware instead
    app.use((req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.status(200).send(`
          <html>
            <head>
              <title>Task Manager API</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .warning { color: #856404; background-color: #fff3cd; padding: 12px; border-radius: 4px; }
              </style>
            </head>
            <body>
              <h1>🚀 Task Manager API</h1>
              <div class="warning">
                <strong>Note:</strong> The frontend build files are not available. 
                API endpoints are working correctly.
              </div>
              <h2>Available API Endpoints:</h2>
              <ul>
                <li><code>GET /api</code> - API health check</li>
                <li><code>POST /api/auth/register</code> - User registration</li>
                <li><code>POST /api/auth/login</code> - User login</li>
                <li><code>GET /api/tasks</code> - Get all tasks</li>
                <li><code>GET /api/users/profile</code> - Get user profile</li>
              </ul>
              <p>Environment: ${process.env.NODE_ENV}</p>
              <p>Timestamp: ${new Date().toISOString()}</p>
            </body>
          </html>
        `);
      }
    });
  }
} else {
  // Development mode
  app.get('/', (req, res) => {
    res.send('Task Manager API is running in development mode...');
  });
}

// ─── Error Middleware ─────────────────────────────────────────────────────────
// These should be the LAST middleware
app.use(notFound);
app.use(errorHandler);

// ─── Database Connection & Server Start ──────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`✅ [Server] Running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`)
    );
  })
  .catch((err) => {
    console.error('❌ [Server] Failed to connect to the database. Server not started.', err.message);
    process.exit(1);
  });
