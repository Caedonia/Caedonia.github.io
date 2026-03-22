// 1. Import your required tools
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 2. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Set up Middleware (The Chef's helpers)
app.use(cors()); // Allows your frontend to safely request data
app.use(express.json()); // Allows the server to understand JSON data (like form submissions)

// Serve your static frontend files (HTML, CSS, JS, images)
// This makes sure your server actually displays your website!
app.use(express.static(path.join(__dirname, '/'))); 

// 4. Connect to the Database (The Pantry)
// I noticed your database is called portal.db in your file tree!
const db = new sqlite3.Database('./portal.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('📦 Successfully connected to the portal.db SQLite database.');
    }
});

// ----------------------------------------------------
// 🚦 API ROUTES (The Menu)
// ----------------------------------------------------

// Route: Get all cacti for the archive
app.get('/api/cacti', (req, res) => {
    const sql = "SELECT * FROM cacti";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// ----------------------------------------------------
// 🏁 START THE SERVER
// ----------------------------------------------------
// The Front Door Route
app.get('/', (req, res) => {
    // Force the server to load your specific landing page
    res.sendFile(path.join(__dirname, 'landing_page.html')); 
});

app.listen(PORT, () => {
    console.log(`🌵 Cactus Learning Portal server running at http://localhost:${PORT}`);
});