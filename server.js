const express = require('express');
const path = require('path');
const { clerkMiddleware } = require('@clerk/express');

// This check is still important
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk environment variables. Please set CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY.');
}

const app = express();
const port = process.env.PORT || 3000;

// Add the Clerk middleware. It should be one of the first middleware.
// This will make the `req.auth` object available on all routes.
app.use(clerkMiddleware());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Route for the main application page
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Secure endpoint to get the authentication token
app.get('/api/token', async (req, res) => {
    // Check if the user is authenticated before proceeding
    if (!req.auth.userId) {
        return res.status(401).json({ error: 'Unauthenticated request' });
    }

    try {
        const token = await req.auth.getToken({ template: 'relevance-jwt' });
        res.json({ token });
    } catch (error) {
        console.error("Error fetching token:", error);
        res.status(500).json({ error: 'Failed to fetch token' });
    }
});

// Export the app for Vercel
module.exports = app;

// This part is for local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
      console.log(`The Aura Citadel is listening on port ${port}`);
  });
}