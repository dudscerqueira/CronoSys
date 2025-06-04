const express = require('express');
const path = require('path');

const app = express();
const port = 5500;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for SPA routing if needed
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Local server running at http://localhost:${3000}`);
});
