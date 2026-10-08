// JS/import.js

// ⚠️ CRITICAL: Ensure your Supabase client is initialized before this runs!
// Example: const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('csv-upload-form');
    const uploadStatus = document.getElementById('upload-status');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('csv-input');

    // Update the UI when a file is selected
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadStatus.innerHTML = `<p style="color: #2E7D32;">📄 Selected: <strong>${e.target.files[0].name}</strong></p>`;
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const file = fileInput.files[0];
        if (!file) return;

        // Visual feedback
        uploadBtn.innerText = "Parsing & Importing... ⏳";
        uploadBtn.disabled = true;
        uploadStatus.innerHTML = ""; 

        // 1. Initialize the FileReader to read the file in the browser
        const reader = new FileReader();
        
        // 2. Define what happens when the file finishes loading into memory
        reader.onload = async function(event) {
            try {
                const csvData = event.target.result;
                const lines = csvData.split('\n');
                let placeholderCounter = 100;
                
                // Array to hold our formatted botanical records
                const cactiToUpload = [];

                // 3. Client-side Parsing (Previously your Express Logic)
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    // Regex to split by comma, ignoring commas inside quotes
                    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
                    if (cols.length < 8) continue; 

                    const icon = cols[0];
                    const status = cols[1];
                    const latinName = cols[2];
                    let fieldNumber = cols[3] || `XXX${placeholderCounter++}`;
                    const altitude = cols[4];
                    const origin = cols[5];
                    const exactLocation = cols[6] || '';
                    const notes = cols[7] || '';

                    const nameParts = latinName.split(' ');
                    const genus = nameParts[0];
                    const species = nameParts.slice(1).join(' '); 
                    let description = `${icon} ${status}. ${altitude ? 'Altitude: ' + altitude + '.' : ''}`;

                    cactiToUpload.push({
                        field_number: fieldNumber,
                        genus: genus,
                        species: species,
                        origin: origin,
                        description: description,
                        exact_location: exactLocation,
                        notes: notes
                    });
                }

                // 4. Send the formatted JSON array directly to Supabase
                const { data, error } = await supabase
                    .from('cacti')
                    .upsert(cactiToUpload, { onConflict: 'field_number' });

                if (error) throw error;

                // Success UI
                uploadStatus.innerHTML = `<p style="color: #2E7D32; font-size: 1.1rem;">✅ <strong>Success!</strong> Imported ${cactiToUpload.length} records.</p>`;
                uploadForm.reset(); 

            } catch (error) {
                console.error("Import failed:", error);
                uploadStatus.innerHTML = `<p style="color: #D32F2F;">❌ <strong>Error:</strong> ${error.message || 'Failed to process CSV.'}</p>`;
            } finally {
                // Reset UI
                uploadBtn.innerText = "Import Data";
                uploadBtn.disabled = false;
            }
        };

        // Fallback if the browser fails to read the local file
        reader.onerror = function() {
            uploadStatus.innerHTML = `<p style="color: #D32F2F;">❌ <strong>Error:</strong> Could not read the file from your device.</p>`;
            uploadBtn.innerText = "Import Data";
            uploadBtn.disabled = false;
        };

        // Kick off the file reading process as plain text
        reader.readAsText(file);
    });
});