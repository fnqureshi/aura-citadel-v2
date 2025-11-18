const express = require('express');
const path = require('path');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// Check for essential Clerk environment variables
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk environment variables. Please set CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY.');
}

const app = express();
const port = process.env.PORT || 3000;

// Serve all static files from the 'public' directory
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
app.get('/api/token', ClerkExpressWithAuth(), async (req, res) => {
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

// This part is for local development only, Vercel will ignore it
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
      console.log(`The Aura Citadel is listening on port ${port}`);
  });
}