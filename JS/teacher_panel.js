// Saving the summary
document.getElementById('admin-summary-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const summaryText = e.target.querySelector('textarea').value;
    localStorage.setItem('studentSummary', summaryText);
    alert('Student Dashboard Updated! 🌵');
});