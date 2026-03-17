// ... (all the imports and setup code remains the same until the static files section)

// ─── Static Files & SPA Routing (Production) ──────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/dist');
  
  // Serve static files first
  app.use(express.static(buildPath));

  // Handle all non-API routes by serving index.html
  // The order matters: this should come AFTER all API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Task Manager API is running in development mode...');
  });
}
// ─────────────────────────────────────────────────────────────────────────────
