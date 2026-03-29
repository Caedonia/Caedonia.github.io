// 1. Import your required tools
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');

// 2. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;
// 2.1 Configure Multer to hold the uploaded file in RAM (memory)
const upload = multer({ storage: multer.memoryStorage() });

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

// The Import Route (Notice 'upload.single' intercepts the file before your code runs)
app.post('/api/cacti/import', upload.single('csvFile'), (req, res) => {
    // If no file was sent, kick it back
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Convert the raw memory buffer into a readable text string
    const csvData = req.file.buffer.toString('utf8');
    const lines = csvData.split('\n');
    let importedCount = 0;
    let placeholderCounter = 100;

    db.serialize(() => {
        const stmt = db.prepare(`
            INSERT INTO cacti (field_number, genus, species, origin, description) 
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(field_number) DO UPDATE SET 
                genus=excluded.genus, species=excluded.species, origin=excluded.origin, description=excluded.description
        `);

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Our CSV Regex from before
            const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
            if (cols.length < 6) continue; 

            const icon = cols[0];
            const status = cols[1];
            const latinName = cols[2];
            let fieldNumber = cols[3] || `NO-FN-${placeholderCounter++}`;
            const altitude = cols[4];
            const origin = cols[5];

            const nameParts = latinName.split(' ');
            const genus = nameParts[0];
            const species = nameParts.slice(1).join(' '); 
            let description = `${icon} ${status}. ${altitude ? 'Altitude: ' + altitude + '.' : ''}`;

            stmt.run(fieldNumber, genus, species, origin, description);
            importedCount++;
        }

        stmt.finalize();
        
        // Send a success message back to the waiter!
        res.json({ message: "success", count: importedCount });
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

