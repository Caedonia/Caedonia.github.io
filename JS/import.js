// JS/import.js

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('csv-upload-form');
    const uploadStatus = document.getElementById('upload-status');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('csv-input');

    // Update the UI when a file is selected so the teacher knows it worked
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadStatus.innerHTML = `<p style="color: #2E7D32;">📄 Selected: <strong>${e.target.files[0].name}</strong></p>`;
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from reloading
        
        const file = fileInput.files[0];
        if (!file) return;

        // FormData packages the file into a "crate" that Multer can read
        const formData = new FormData();
        formData.append('csvFile', file);

        // Visual feedback
        uploadBtn.innerText = "Importing Data... ⏳";
        uploadBtn.disabled = true;
        uploadStatus.innerHTML = ""; 

        try {
            // Send the crate to the kitchen
            const response = await fetch('/api/cacti/import', {
                method: 'POST',
                body: formData // DO NOT set headers; fetch does it automatically for FormData!
            });

            const result = await response.json();

            if (response.ok && result.message === 'success') {
                uploadStatus.innerHTML = `<p style="color: #2E7D32; font-size: 1.1rem;">✅ <strong>Success!</strong> Imported ${result.count} records.</p>`;
                uploadForm.reset(); // Clear the form
            } else {
                uploadStatus.innerHTML = `<p style="color: #D32F2F;">❌ <strong>Error:</strong> ${result.error || 'Failed to parse CSV.'}</p>`;
            }
        } catch (error) {
            console.error("Upload failed", error);
            uploadStatus.innerHTML = `<p style="color: #D32F2F;">❌ <strong>Connection failed.</strong> Is your server running?</p>`;
        } finally {
            // Always reset the button back to normal
            uploadBtn.innerText = "Import Data";
            uploadBtn.disabled = false;
        }
    });
});