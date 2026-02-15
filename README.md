# 🌵 Cactus Learning Portal

A clean, modern, and responsive student management mockup. This project features a landing page with functional contact capabilities, a student dashboard, and a custom-built class schedule.

## 📁 Project Structure

The project is organized into logical modules to ensure scalability and ease of maintenance:

* **`/` (Root):** Contains the main `landing page.html`.
* **`/dashboard`:** Contains the student portal interface (`dashboard.html`).
* **`/plan`:** Contains the interactive class schedule (`plan2.html`).
* **`/styles`:** Centralized CSS files (`mystyle2.css`, `dashboard.css`, `plan2style.css`).
* **`/js`:** JavaScript logic, including form handling (`sendMail2.js`).
* **`/assets`:** Images, icons, and cactus-themed branding.

## ✨ Key Features

### 1. Modern Landing Page
* **Smooth Scrolling:** Glides to sections using CSS `scroll-behavior`.
* **Functional Contact Form:** Powered by **Formspree.io** with an AJAX "hijack" to prevent page redirects.
* **Responsive UI:** Fully optimized for mobile and desktop viewing.

### 2. Student Dashboard
* **Dynamic Grid Layout:** Uses CSS `minmax` and `auto-fit` to rearrange cards based on screen size.
* **Homework Tracker:** Interactive checklist for students to monitor pending tasks.
* **Resources & News:** Dedicated sections for lesson summaries and school updates.

### 3. Class Schedule
* **Advanced CSS Grid:** Utilizes vertical spanning (`grid-row: 2 / -1`) to create "pillar" bars for specific days.
* **Color-Coded Events:** Visual distinction between different class types and study sessions.

## 🛠️ Technical Details

### Relative Pathing
This project uses relative pathing (`../`) to allow the separate page folders to access centralized styles and scripts. 



### Form Handling
The contact form uses a `fetch` request in `js/contact.js` to send data to Formspree asynchronously. This allows for a "Success" message to appear without the user ever leaving the page.



## 🚀 How to Run Locally
1. Clone or download this repository.
2. Open `landing.html` in any modern web browser.
3. To test the contact form, ensure you have a valid Formspree ID in the `action` attribute of the form.

---
*Created with care for the Cactus Learning community. 🌵*