// ==========================================
// 1. DOM Elements
// ==========================================
const fnInput = document.getElementById('filter-fn');
const genusInput = document.getElementById('filter-genus');
const speciesInput = document.getElementById('filter-species');
const originInput = document.getElementById('filter-origin');
const searchBtn = document.getElementById('search-btn');
import CONFIG from './config.js';

// Note: Ensure your HTML uses id="cactus-container" instead of "cactus-grid"
const cactusContainer = document.getElementById('cactus-container'); 
const resultsCount = document.getElementById('results-count');

// ==========================================
// 2. Global State (The Brain)
// ==========================================
let currentView = 'grid'; 
let cachedCactiData = [];    // The Nursery (All fetched data)
let currentDisplayData = []; // The Display Table (What the user actually sees)

// ==========================================
// 3. Data Fetching
// ==========================================
async function fetchCacti() {
    try {
        // The Supabase REST endpoint for fetching all rows from the 'cacti' table
        const url = `${CONFIG.SUPABASE_URL}/rest/v1/cacti?select=*`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Supabase requires both the apikey and the Bearer token
                'apikey': CONFIG.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch the botanical archive.');

        const cactiData = await response.json();
        console.log("🌵 Cacti loaded successfully:", cactiData);

        // 1. Save the fetched data into your global arrays
        cachedCactiData = cactiData; 
        currentDisplayData = cactiData;

        // 2. Call the rendering engine to draw the UI
        renderGallery();

    } catch (error) {
        console.error("Botanical Data Error:", error);
    }
}


// ==========================================
// 4. The Core Rendering Engine
// ==========================================
function renderGallery() {
    cactusContainer.innerHTML = ''; // Clear the deck
    
    // Update container layout class
    cactusContainer.className = currentView === 'grid' ? 'grid-layout' : 'list-layout';

    // Update the results counter
    if (resultsCount) {
        resultsCount.textContent = `${currentDisplayData.length} specimens found`;
    }

    // Loop through the Display Table, NOT the cache!
    currentDisplayData.forEach(cactus => {
        const item = document.createElement('div');
        
        // Assign classes based on current view
        item.className = currentView === 'grid' ? 'cactus-card grid-item' : 'cactus-card list-item';
        
        // Inject the correct HTML template
        item.innerHTML = currentView === 'grid' 
            ? renderGridTemplate(cactus) 
            : renderListTemplate(cactus);
            
        cactusContainer.appendChild(item);
    });
}

// ==========================================
// 5. Filter Logic
// ==========================================
searchBtn.addEventListener('click', () => {
    const fnVal = fnInput.value.toLowerCase();
    const genusVal = genusInput.value.toLowerCase();
    const speciesVal = speciesInput.value.toLowerCase();
    const originVal = originInput.value.toLowerCase();

    // Filter the Nursery, save to Display Table
    currentDisplayData = cachedCactiData.filter(cactus => {
        const matchFn = cactus.field_number.toLowerCase().includes(fnVal);
        const matchGenus = cactus.genus.toLowerCase().includes(genusVal);
        const matchSpecies = cactus.species.toLowerCase().includes(speciesVal);
        const matchOrigin = originVal === "" || (cactus.origin && cactus.origin.toLowerCase().includes(originVal));

        return matchFn && matchGenus && matchSpecies && matchOrigin;
    });

    // Re-draw the screen with the new Display Table
    renderGallery();
});

// ==========================================
// 6. View Toggle Event Listeners
// ==========================================
document.getElementById('grid-view-btn').addEventListener('click', (e) => {
    if (currentView === 'grid') return; // Do nothing if already in grid mode
    currentView = 'grid';
    updateActiveButton(e.target);
    renderGallery(); 
});

document.getElementById('list-view-btn').addEventListener('click', (e) => {
    if (currentView === 'list') return; // Do nothing if already in list mode
    currentView = 'list';
    updateActiveButton(e.target);
    renderGallery(); 
});

function updateActiveButton(activeBtn) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// ==========================================
// 7. Template Functions
// ==========================================
function renderGridTemplate(cactus) {
    return `
        <img src="../assets/${cactus.field_number}.jpg" alt="${cactus.genus} ${cactus.species}" onerror="this.src='../assets/placeholder.png'" width="30px">
        <div class="card-content">
            <span class="fn-badge">${cactus.field_number}</span>
            <h3>${cactus.genus} ${cactus.species}</h3>
            
            <!-- Added the missing origin data -->
            <p class="origin-text">${cactus.origin || 'Origin unknown'}</p>
            
            <!-- Added the missing View Details button -->
            <button class="view-btn" onclick="window.location.href='detail.html?fn=${cactus.field_number}'">View Details</button>
        </div>
    `;
}

function renderListTemplate(cactus) {
    return `
        <div class="list-info">
            <span class="fn-badge">${cactus.field_number}</span>
            <span class="taxonomy"><strong>${cactus.genus}</strong> ${cactus.species}</span>
        </div>
        <div class="list-origin">${cactus.origin}</div>
        <button class="view-btn" onclick="window.location.href='detail.html?fn=${cactus.field_number}'">View Details</button>
    `;
}

// ==========================================
// Run the App!
// ==========================================
fetchCacti();