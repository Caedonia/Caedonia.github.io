// ==========================================================================
// 1. IMPORTY
// ==========================================================================
import { supabase } from '../JS/supabaseClient.js';

let currentStudentsList = [];

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
    checkAuth();

    // Inicjujemy pobranie uczniów do dropdowna
    fetchStudents();

    const studentSelect = document.getElementById('student-select');
    if (studentSelect) {
        studentSelect.addEventListener('change', (e) => {
            renderStudentData(e.target.value);
        });
    }

    // --- Obsługa Modala ---
    const modal = document.getElementById('add-student-modal');
    const openBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    // Zamykanie tłem
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.classList.add('hidden');
    });

    // --- Podpinanie Formularzy ---
    const newStudentForm = document.getElementById('new-student-form');
    if (newStudentForm) {
        newStudentForm.addEventListener('submit', handleNewStudent);
    }
});

// ==========================================================================
// 4. LOGIKA BAZY DANYCH (Połączenia z Supabase)
// ==========================================================================

// Pobieranie uczniów (SELECT)
async function fetchStudents() {
    const studentSelect = document.getElementById('student-select');
    if (!studentSelect) return;
    
    studentSelect.innerHTML = '<option>Ładowanie okazów...</option>';

    const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .order('last_name', { ascending: true });

    if (error) {
        console.error("Błąd pobierania bazy:", error.message);
        studentSelect.innerHTML = '<option>Błąd połączenia</option>';
        return;
    }

    // ZAPIS STAN DO ZMIENNEJ GLOBALNEJ
    currentStudentsList = students; 
    studentSelect.innerHTML = ''; // Czyścimy przed dodaniem opcji

    if (students.length === 0) {
        const option = document.createElement('option');
        option.textContent = "🌱 Brak uczniów. Dodaj nowy okaz!";
        option.disabled = true;
        option.selected = true;
        studentSelect.appendChild(option);
        
        clearDashboard();
        return; 
    }

    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id; 
        option.textContent = `${student.first_name} ${student.last_name}`;
        studentSelect.appendChild(option);
    });

    enableDashboard();
    
    // Ważne: Błyskawicznie renderujemy dane pierwszego ucznia z listy po załadowaniu!
    renderStudentData(students[0].id); 
}

// NOWA FUNKCJA: Renderowanie danych
function renderStudentData(studentId) {
    // Szukamy ucznia w naszym zapisanym lokalnie "kompoście"
    const student = currentStudentsList.find(s => s.id == studentId);
    
    if (!student) return;

    // 1. Zdejmujemy ukrycie z nowej karty i aktualizujemy "badge"
    document.getElementById('student-summary-card').classList.remove('hidden');
    document.getElementById('display-student-name').textContent = `${student.first_name} ${student.last_name}`;
    document.getElementById('display-student-level').textContent = student.level || 'Brak danych';
    document.getElementById('display-student-book').textContent = student.textbook || 'Brak materiału';

    // 2. Aktualizacja istniejących kart (Zajęcia i Stawka)
    const timeDisplay = document.querySelector('.schedule-time');
    if (timeDisplay) timeDisplay.innerHTML = `<strong>Zajęcia:</strong> ${student.schedule_time || 'Brak harmonogramu'}`;
    
    const rateInput = document.getElementById('hourly-rate');
    if (rateInput) {
        rateInput.value = student.hourly_rate || 0;
    }
}

// Sadzenie nowego ucznia (INSERT)
async function handleNewStudent(event) {
    event.preventDefault(); // Zatrzymuje reset strony

    // Pobieranie danych z inputów
    const firstName = document.getElementById('new-name').value;
    const lastName = document.getElementById('new-surname').value;
    const scheduleTime = document.getElementById('new-time').value;
    const hourlyRate = document.getElementById('new-rate').value;
    const textbook = document.getElementById('new-book').value;
    const level = document.getElementById('new-level').value;

    const { data, error } = await supabase
        .from('students')
        .insert([{ 
            first_name: firstName, 
            last_name: lastName, 
            schedule_time: scheduleTime,
            hourly_rate: parseFloat(hourlyRate),
            textbook: textbook,
            level: level
        }]);

    if (error) {
        console.error("Błąd sadzenia:", error.message);
        alert("Wystąpił błąd podczas dodawania ucznia.");
        return;
    }

    // Sprzątanie po sukcesie
    document.getElementById('new-student-form').reset();
    document.getElementById('add-student-modal').classList.add('hidden');
    
    // Asynchroniczne odświeżenie listy!
    fetchStudents(); 
}

// ==========================================================================
// 5. MANIPULACJA UI (Helpers)
// ==========================================================================

function clearDashboard() {
    const timeDisplay = document.querySelector('.schedule-time');
    if (timeDisplay) timeDisplay.innerHTML = "<strong>Zajęcia:</strong> Brak danych";
    
    const rateInput = document.getElementById('hourly-rate');
    if (rateInput) {
        rateInput.value = "";
        rateInput.disabled = true; 
    }

    const attendanceGrid = document.querySelector('.attendance-grid');
    if (attendanceGrid) attendanceGrid.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">Dodaj ucznia, aby śledzić obecność.</p>';

    const noteFormBtn = document.querySelector('#note-form button[type="submit"]');
    const noteInput = document.getElementById('lesson-note');
    if (noteFormBtn) noteFormBtn.disabled = true; 
    if (noteInput) noteInput.disabled = true; 

    document.getElementById('student-summary-card').classList.add('hidden');
}

function enableDashboard() {
    const rateInput = document.getElementById('hourly-rate');
    if (rateInput) rateInput.disabled = false;

    const noteFormBtn = document.querySelector('#note-form button[type="submit"]');
    const noteInput = document.getElementById('lesson-note');
    if (noteFormBtn) noteFormBtn.disabled = false;
    if (noteInput) noteInput.disabled = false;
}