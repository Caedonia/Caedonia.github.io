// Reading the summary
document.addEventListener('DOMContentLoaded', () => {
    const savedSummary = localStorage.getItem('studentSummary');
    if (savedSummary) {
        document.querySelector('.summary-content p').innerText = savedSummary;
    }
});