const express = require('express');
const path = require('path');
const Clerk = require('@clerk/clerk-sdk-node');

const app = express();
const port = process.env.PORT || 3000;

// This is the new, critical law: Serve ALL static files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// The Royal Road to the Antechamber
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// The Royal Road to the Throne Room
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// The Secure Endpoint for the Sacred Key
app.get('/api/token', Clerk.expressWithAuth(), async (req, res) => {
    try {
        const token = await req.auth.getToken({ template: 'relevance-jwt' });
        res.json({ token });
    } catch (error) {
        console.error("Error fetching token:", error);
        res.status(500).json({ error: 'Failed to fetch token' });
    }
});

app.listen(port, () => {
    console.log(`The Aura Citadel is listening on port ${port}`);
});