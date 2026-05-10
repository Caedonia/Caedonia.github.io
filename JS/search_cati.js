// ==========================================
// 1. DOM Elements
// ==========================================
const fnInput = document.getElementById('filter-fn');
const genusInput = document.getElementById('filter-genus');
const speciesInput = document.getElementById('filter-species');
const originInput = document.getElementById('filter-origin');
const searchBtn = document.getElementById('search-btn');

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
        const response = await fetch('http://localhost:3000/api/cacti');
        
        // 1. Get the raw response box from the truck
        const rawData = await response.json(); 
        
        // 2. OPEN THE BOX: Let's see what's actually inside!
        console.log("📦 Delivery from the Server:", rawData); 

        // 3. (Temporary) Guessing the box structure based on standard Express setups
        // We look for a property named 'data', 'cacti', or fallback to the raw data itself
        cachedCactiData = rawData.data || rawData.cacti || rawData; 

        // 4. Now we spread our guaranteed array onto the display table
        currentDisplayData = [...cachedCactiData]; 
        renderGallery(); 

    } catch (err) {
        console.error("The cactus fetch failed:", err);
        cactusContainer.innerHTML = '<p>Error loading botanical records.</p>';
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