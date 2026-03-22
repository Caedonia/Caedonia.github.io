// /js/search.js

// 1. Target the HTML elements (Make sure these IDs match your actual HTML!)
const searchInput = document.getElementById('search-bar');
const cactusGrid = document.getElementById('cactus-grid');

// This empty array is our "tray". We will store all the database records here.
let allCacti = []; 

// ==========================================
// 🚚 THE WAITER (Fetch data from Server)
// ==========================================
async function fetchCactiArchive() {
    try {
        // "Go to the kitchen and ask for the cacti menu"
        const response = await fetch('/api/cacti');
        const result = await response.json();
        
        if (result.message === 'success') {
            allCacti = result.data; // Put the data on the tray
            renderCards(allCacti);  // Serve the data to the user
        } else {
            cactusGrid.innerHTML = `<p>Error loading archive: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Failed to fetch cacti:', error);
        cactusGrid.innerHTML = `<p>Connection error. Is the server running?</p>`;
    }
}

// ==========================================
// 🎨 THE PLATING (Turn JSON into HTML)
// ==========================================
function renderCards(cactiArray) {
    // Clear the table before putting new plates down
    cactusGrid.innerHTML = ''; 

    // If the search results are empty, show a polite message
    if (cactiArray.length === 0) {
        cactusGrid.innerHTML = `<p class="no-results">No cacti match your search. 🌵</p>`;
        return;
    }

    // Loop through however many plants are in the array and build a card for each
    cactiArray.forEach(cactus => {
        const card = document.createElement('div');
        card.className = 'cactus-card'; 
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${cactus.genus} <em>${cactus.species}</em></h3>
                <span class="badge fn-badge">${cactus.field_number}</span>
            </div>
            <div class="card-body">
                <p><strong>Origin:</strong> ${cactus.origin || 'Unknown'}</p>
                <p class="description">${cactus.description || 'No description available.'}</p>
            </div>
            <div class="card-footer">
                <a href="../Cacti/detail.html?fn=${encodeURIComponent(cactus.field_number)}" class="btn-read-more">View Details</a>
            </div>
        `;
        cactusGrid.appendChild(card);
    });
}

// ==========================================
// 🕵️ THE FILTER (Real-time searching)
// ==========================================
// This listens for every single keystroke in the search bar
searchInput.addEventListener('input', (event) => {
    // Convert whatever the user typed to lowercase so the search isn't case-sensitive
    const searchTerm = event.target.value.toLowerCase();
    
    // Filter our "tray" of all cacti down to just the ones that match
    const filteredCacti = allCacti.filter(cactus => {
        return (
            cactus.genus.toLowerCase().includes(searchTerm) ||
            cactus.species.toLowerCase().includes(searchTerm) ||
            cactus.field_number.toLowerCase().includes(searchTerm)
        );
    });

    // Re-render the grid with just the matching plants!
    renderCards(filteredCacti);
});

// 🚀 Fire off the fetch request the moment the script loads
fetchCactiArchive();