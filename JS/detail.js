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
        console.log("fetching the data for FN");

        try {
            // Notice we use encodeURIComponent to handle spaces in field numbers
            const response = await fetch(`/api/cacti/${encodeURIComponent(fieldNumber)}`);
            const result = await response.json();

            if (result.message === 'success') {
                renderDetailView(result.data);
            } else {
                document.querySelector('main').innerHTML = `<h1>Plant Not Found</h1>`;
            }
        } catch (error) {
            console.error("Error fetching detail:", error);
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