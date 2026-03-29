// 1. Target all the new HTML IDs
const fnInput = document.getElementById('filter-fn');
const genusInput = document.getElementById('filter-genus');
const speciesInput = document.getElementById('filter-species');
const originInput = document.getElementById('filter-origin');
const searchBtn = document.getElementById('search-btn');
const cactusGrid = document.getElementById('cactus-grid');
const resultsCount = document.getElementById('results-count');

let allCacti = []; 

// 2. Fetch from the Server
async function fetchCactiArchive() {
    try {
        const response = await fetch('/api/cacti');
        const result = await response.json();
        
        if (result.message === 'success') {
            allCacti = result.data; 
            renderCards(allCacti); // Render everything on first load
        }
    } catch (error) {
        console.error('Failed to fetch:', error);
        cactusGrid.innerHTML = `<p>Connection error. Is the Node server running?</p>`;
    }
}

// 3. Create the Cards
function renderCards(cactiArray) {
    cactusGrid.innerHTML = ''; 
    resultsCount.innerText = `Showing ${cactiArray.length} results found in the archive`;

    if (cactiArray.length === 0) {
        cactusGrid.innerHTML = `<p class="no-results">No cacti match your filters. 🌵</p>`;
        return;
    }

    cactiArray.forEach(cactus => {
        const card = document.createElement('div');
        card.className = 'cactus-card'; 
        
        card.innerHTML = `
            <div class="card-tag">${cactus.field_number}</div>
            <h3>${cactus.genus} <em>${cactus.species}</em></h3>
            <p><strong>Origin:</strong> ${cactus.origin || 'Unknown'}</p>
            <span class="genus-label">Genus: ${cactus.genus}</span>
            <div style="margin-top: 10px;">
                <a href="../Cacti/detail.html?fn=${encodeURIComponent(cactus.field_number)}" style="color: #2E7D32; text-decoration: none; font-weight: bold;">View Details →</a>
            </div>
        `;
        cactusGrid.appendChild(card);
    });
}

// 4. The 4-Way Filter Logic
searchBtn.addEventListener('click', () => {
    const fnVal = fnInput.value.toLowerCase();
    const genusVal = genusInput.value.toLowerCase();
    const speciesVal = speciesInput.value.toLowerCase();
    const originVal = originInput.value.toLowerCase();

    const filteredCacti = allCacti.filter(cactus => {
        // Check every condition. If an input is empty, it acts as a "pass" (true)
        const matchFn = cactus.field_number.toLowerCase().includes(fnVal);
        const matchGenus = cactus.genus.toLowerCase().includes(genusVal);
        const matchSpecies = cactus.species.toLowerCase().includes(speciesVal);
        
        // For origin, we handle the select dropdown
        const matchOrigin = originVal === "" || (cactus.origin && cactus.origin.toLowerCase().includes(originVal));

        // Only keep the plant if it matches ALL the boxes the user typed in
        return matchFn && matchGenus && matchSpecies && matchOrigin;
    });

    renderCards(filteredCacti);
});

// Start the process
fetchCactiArchive();