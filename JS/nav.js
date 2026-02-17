document.addEventListener("DOMContentLoaded", function() {
    const navContainer = document.getElementById('global-nav');
    if (!navContainer) return;

    // 1. Determine depth (How many folders deep are we?)
    // If we are in /search/detail.html, we need '../' to get to root.
    const pathArray = window.location.pathname.split('/');
    // This logic works for standard folder structures
    const isSubfolder = pathArray.filter(part => part !== "").length > 1;
    const root = isSubfolder ? "../" : "";

    // 2. Define the Navigation HTML
    navContainer.innerHTML = `
        <nav class="main-nav">
            <div class="nav-logo">🌵 Cactus Portal</div>
            <ul class="nav-links">
                <li><a href="${root}landing_page.html">Home</a></li>
                <li><a href="${root}Cacti/start.html">Archive</a></li>
                <li class="dropdown">
                <a href="#" class="dropbtn">English Learning ▾</a>
                    <ul class="dropdown-content">
                        <li><a href="${root}dashboard/dashboard.html">Dashboard</a></li>
                        <li><a href="${root}Plan/plan2.html">Schedule</a></li>
                        <li><a href="${root}teacher_panel/teacher_panel.html" class="admin-link">Teacher Panel</a></li>
                    </ul>
                 </li>       
            </ul>
        </nav>
    `;
});