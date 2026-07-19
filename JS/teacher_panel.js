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

checkAuth();
// Saving the summary
document.getElementById('admin-summary-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const summaryText = e.target.querySelector('textarea').value;
    localStorage.setItem('studentSummary', summaryText);
    alert('Student Dashboard Updated! 🌵');
});