const express = require('express');
const path = require('path');
const { clerkMiddleware } = require('@clerk/express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getScribePersona } = require('./engine/prompt-manager');

// This check ensures your Vercel environment variables are being read.
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk environment variables. Please set CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY.');
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Add the Clerk middleware.
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

// --- THE ALCHEMICAL ENGINE ---

// Secure endpoint to forge a dossier entry
app.post('/api/scribe/forge-entry', async (req, res) => {
    // 1. Security Check
    if (!req.auth.userId) {
        return res.status(401).json({ error: 'The Scribe only serves the Sovereign. Please log in.' });
    }

    const { journal_entry } = req.body;
    if (!journal_entry) {
        return res.status(400).json({ error: 'The forge requires raw material. Please provide a journal entry.' });
    }

    try {
        // 2. Retrieve the Soul (The Prompt)
        const systemPrompt = await getScribePersona();

        // 3. Initialize the Foundry (Google Gemini)
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error("The Foundry is cold. GOOGLE_API_KEY is missing.");
        }
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 4. The Transmutation
        const fullPrompt = `${systemPrompt}

**Input:**
${journal_entry}`;
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const responseText = result.response.text();
        const dossierEntry = JSON.parse(responseText);

        // 5. Return the Weapon
        res.json(dossierEntry);

    } catch (error) {
        console.error("Alchemical Failure:", error);
        res.status(500).json({ error: 'The transmutation failed. The Scribe is currently unavailable.' });
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