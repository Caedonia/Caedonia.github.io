document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.querySelector('form'); // Grabs the first form on the page

    if (!contactForm) {
        console.error("Coding Partner: Form not found! Check your HTML.");
        return;
    }

    async function handleSubmit(event) {
        event.preventDefault(); // THIS stops the redirect
        console.log("Form submission intercepted! 🌵");

        const status = document.getElementById("form-status") || document.createElement('p');
        status.id = "form-status";
        contactForm.appendChild(status);
        
        const data = new FormData(event.target);
        const btn = contactForm.querySelector('button');
        
        btn.disabled = true;
        btn.innerHTML = "Sending...";

        fetch(event.target.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.style.color = "#4caf50";
                status.innerHTML = "Success! Your message is on its way. 🌵";
                contactForm.reset();
            } else {
                status.style.color = "#ff8a65";
                status.innerHTML = "Oops! Formspree had an issue.";
            }
            btn.disabled = false;
            btn.innerHTML = "Send Message";
        }).catch(error => {
            console.error("Fetch Error:", error);
            status.innerHTML = "Connection error. Check your internet.";
            btn.disabled = false;
        });
    }

    contactForm.addEventListener("submit", handleSubmit);
});