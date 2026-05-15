// JS/detail.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Read the URL to find out which plant we are looking at
    // If the URL is detail.html?fn=L450, this grabs "L450"
    const urlParams = new URLSearchParams(window.location.search);
    const fieldNumber = urlParams.get('fn');
    console.log(fieldNumber)

    if (!fieldNumber) {
        document.querySelector('main').innerHTML = "<h1>Error: No Field Number Provided</h1>";
        return;
    }

    // 2. Fetch the specific plant data
    async function fetchPlantDetails(fieldNumber) {
    console.log(`Fetching data for Field Number: ${fieldNumber}`);

    try {
        // 1. Correct PostgREST syntax: ?column_name=eq.value
        const url = `${CONFIG.SUPABASE_URL}/rest/v1/cacti?field_number=eq.${encodeURIComponent(fieldNumber)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': CONFIG.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Always good practice to check if the network request itself failed
        if (!response.ok) throw new Error("Failed to reach the botanical archive.");

        // 2. Open the envelope and parse the JSON
        const result = await response.json();

        // 3. Supabase returns an array. Check if it exists AND has at least one item
        if (result && result.length > 0) {
            // Extract the actual cactus object from the array
            const cactusData = result[0]; 
            
            // Pass the clean object to your UI builder
            renderDetailView(cactusData); 
        } else {
            // Array was empty = no match found
            document.querySelector('main').innerHTML = `<h1>Specimen Not Found</h1>`;
        }
    } catch (error) {
        console.error("Error fetching detail:", error);
        document.querySelector('main').innerHTML = `<h1>Error loading plant details. Please try again.</h1>`;
    }
}

    // 3. Render the data into the HTML
    function renderDetailView(cactus) {
        // We use || '' to prevent crashes if a property is missing
        document.getElementById('detail-title').innerHTML = `${cactus.genus || 'Unknown'} <em>${cactus.species || ''}</em>`;
        document.getElementById('detail-fn').innerText = cactus.field_number || '---';
        document.getElementById('detail-origin').innerText = cactus.origin || 'Unknown origin';
        document.getElementById('detail-location').innerText = cactus.exact_location || 'Not recorded';
        document.getElementById('detail-desc').innerText = cactus.description || '';

        const notesEl = document.getElementById('detail-notes');
        const notesContainer = document.querySelector('.notes-section');
        
        // We force it to a String just in case it is undefined or a number
        if (cactus.notes && String(cactus.notes).trim() !== '') {
            notesEl.innerText = cactus.notes;
            notesContainer.classList.remove('hidden'); 
        } else {
            notesContainer.classList.add('hidden'); 
        }
    }

    fetchPlantDetails(fieldNumber);
});