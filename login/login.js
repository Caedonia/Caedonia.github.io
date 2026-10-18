import { supabase } from "../JS/supabaseClient.js";

const loginForm = document.getElementById('login-form');
const statusMessage = document.getElementById('login-status');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the page from reloading

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    statusMessage.textContent = "Authenticating...";
    statusMessage.style.color = "blue";

    // Call the Supabase Auth API
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        // Invalid credentials or network issue
        console.error("Login failed:", error.message);
        statusMessage.textContent = `❌ ${error.message}`;
        statusMessage.style.color = "red";
    } else {
        // Success! Supabase has automatically saved the session token.
        statusMessage.textContent = "✅ Access Granted. Routing...";
        statusMessage.style.color = "green";
        
        // Redirect directly to your teacher panel
        window.location.href = '../teacher_panel/teacher_panel.html';
    }
});