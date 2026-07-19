import { supabase } from '../shared/supabase-client.js';

const signupForm = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');
const inputs = signupForm.querySelectorAll('input, select');

// Function to check if all required fields have values
const checkFormValidity = () => {
    // Array.from converts the NodeList so we can use .every()
    const isFormValid = Array.from(inputs).every(input => input.value.trim() !== '');
    submitBtn.disabled = !isFormValid;
};

// Listen for changes on all input fields
inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
    input.addEventListener('change', checkFormValidity); // Needed for the <select> element
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI state: Loading
    submitBtn.textContent = 'Planting seed...';
    submitBtn.disabled = true;
    errorMessage.classList.add('hidden');

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const favoriteGenus = document.getElementById('favorite-genus').value;

    try {
        // Await the asynchronous Supabase authentication
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                    favorite_genus: favoriteGenus
                }
            }
        });

        if (error) throw error;

        // Success state
        submitBtn.textContent = 'Success! Check your email.';
        
        // Redirect to dashboard (relative path)
        setTimeout(() => {
            window.location.href = '../dashboard/index.html';
        }, 2000);

    } catch (error) {
        // Error state
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        submitBtn.textContent = 'Sprout Account';
        
        // Re-run validation to ensure button state is correct
        checkFormValidity(); 
    }
});