const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Secure API endpoint to provide the embed URL from environment variables
app.get('/api/embed-url', (req, res) => {
  const embedUrl = process.env.EMBED_URL;
  if (embedUrl) {
    res.json({ url: embedUrl });
  } else {
    res.status(500).json({ error: 'Embed URL is not configured on the server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
