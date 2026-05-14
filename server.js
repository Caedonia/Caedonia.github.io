// 1. Import your required tools
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

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

// ----------------------------------------------------
// 🚦 API ROUTES (The Menu)
// ----------------------------------------------------

    // Route: Get all cacti for the archive
   app.get('/api/cacti', async (req, res) => {
    // Supabase uses await, so we need "async" in front of (req, res)
    const { data, error } = await supabase
        .from('cacti') // choose cacti
        .select('*');  // get all columns

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
    });

// GET a single cactus by Field Number
    app.get('/api/cacti/:field_number', async (req, res) => {
        const { field_number } = req.params;
        try {
        const { data, error } = await supabase
            .from('cacti')
            .select('*')
            .eq('field_number', field_number) // field_number filter
            .single(); // we want 1 item not the table

        if (error) throw error;
        if (!data) return res.status(404).json({ message: "Nie znaleziono takiego okazu." });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

    app.post('/api/cacti/import', upload.single('csvFile'), async (req, res) => {
    // If no file was sent, kick it back
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const csvData = req.file.buffer.toString('utf8');
    const lines = csvData.split('\n');
    let placeholderCounter = 100;
    
    // Create an array to hold all our new botanical records
    const cactiToUpload = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
        if (cols.length < 8) continue; 

        const icon = cols[0];
        const status = cols[1];
        const latinName = cols[2];
        let fieldNumber = cols[3] || `NO-FN-${placeholderCounter++}`;
        const altitude = cols[4];
        const origin = cols[5];
        const exactLocation = cols[6] || '';
        const notes = cols[7] || '';

        const nameParts = latinName.split(' ');
        const genus = nameParts[0];
        const species = nameParts.slice(1).join(' '); 
        let description = `${icon} ${status}. ${altitude ? 'Altitude: ' + altitude + '.' : ''}`;

        // Push the formatted data into our array
        cactiToUpload.push({
            field_number: fieldNumber,
            genus: genus,
            species: species,
            origin: origin,
            description: description,
            exact_location: exactLocation,
            notes: notes
        });
    }

    try {
        // Send the whole array to Supabase using upsert
        // 'onConflict' tells it to update existing rows if the field_number matches
        const { data, error } = await supabase
            .from('cacti')
            .upsert(cactiToUpload, { onConflict: 'field_number' });

        if (error) throw error;
        
        res.json({ message: "success", count: cactiToUpload.length });
    } catch (err) {
        console.error("Import failed:", err);
        res.status(500).json({ error: err.message });
    }
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

