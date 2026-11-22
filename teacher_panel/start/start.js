// ==========================================================================
// 1. IMPORTY
// ==========================================================================
import { supabase } from '../../JS/supabaseClient.js';
import { showToast } from '../../JS/notification.js';

// ==========================================================================
// 2. AUTORYZACJA 
// ==========================================================================
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        console.warn("Brak autoryzacji. Przekierowanie do poczekalni...");
        window.location.href = '../login/login.html'; 
        return;
    }
    console.log("Witaj w szklarni, Nauczycielu! 🌵");
}

// ==========================================================================
// 3. INICJALIZACJA INTERFEJSU (Po załadowaniu HTML)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Odpalamy sprawdzanie logowania
    //checkAuth();

    });