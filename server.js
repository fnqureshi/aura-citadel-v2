const express = require('express');
const path = require('path');
const { clerkMiddleware } = require('@clerk/express');

// This check ensures your Vercel environment variables are being read.
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk environment variables. Please set CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY.');
}

const app = express();
const port = process.env.PORT || 3000;

// Add the Clerk middleware. This should be one of the first middleware you use.
// It makes the `req.auth` object available on all subsequent routes.
app.use(clerkMiddleware());

// Serve static files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// Route for the landing page.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Route for the main application page.
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Secure endpoint to get the authentication token.
app.get('/api/token', async (req, res) => {
    // Before fetching a token, check if the user is authenticated.
    if (!req.auth.userId) {
        return res.status(401).json({ error: 'Unauthenticated request' });
    }

    try {
        // The auth object is now available on the request object.
        const token = await req.auth.getToken({ template: 'relevance-jwt' });
        res.json({ token });
    } catch (error) {
        console.error("Error fetching token:", error);
        res.status(500).json({ error: 'Failed to fetch token' });
    }
});

// Export the app for Vercel's serverless environment.
module.exports = app;

// This part is for local development only and will be ignored by Vercel.
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
      console.log(`The Aura Citadel is listening on port ${port}`);
  });
}

Update Instructions

    Replace package.json: Go to the package.json file in your GitHub repository, edit it, delete all the old text, and paste the new code from above. Commit this change.
    Replace server.js: Go to the server.js file, edit it, delete all the old text, and paste the new code from above. Commit this change.
    Deploy: Vercel should automatically detect these commits and start a new deployment. This new build will use the correct code and your environment variables, which should resolve the issue.

13 minutes ago
