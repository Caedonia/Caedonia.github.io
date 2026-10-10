// Run this immediately when the admin script loads
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        console.warn("Unauthorized access attempt. Redirecting...");
        window.location.href = '../landing.html'; 
        return;
    }
    
    // If they pass, load the rest of the page/data
    console.log("Welcome back, Teacher!");
}

// ==========================================================================
// Obsługa Modala (Szklarni dla nowych uczniów)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1.  pobieramy elementy
    const modal = document.getElementById('add-student-modal');
    const openBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');

    // 2. KONTROLA (dodaj to, by zobaczyć co jest winne)
    console.log("Modal:", modal);
    console.log("Przycisk Otwórz:", openBtn);
    console.log("Przycisk Zamknij:", closeBtn);

    // 3. DOPIERO POTEM przypinamy eventy
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
});

// Zabezpieczenie na przyszłość: zapobiegamy domyślnemu przeładowaniu strony przy próbie zapisu
const newStudentForm = document.getElementById('new-student-form');
newStudentForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Zatrzymuje przeładowanie strony
    console.log("Gotowy do wysadzenia danych do Supabase!");
    // Tutaj w kolejnym kroku dodamy funkcję async/await do bazy danych
});

checkAuth();
// Saving the summary
document.getElementById('admin-summary-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const summaryText = e.target.querySelector('textarea').value;
    localStorage.setItem('studentSummary', summaryText);
    alert('Student Dashboard Updated! 🌵');
});