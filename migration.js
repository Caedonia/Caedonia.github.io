const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./portal.db');

db.serialize(() => {
    console.log("🛠️ Upgrading Database Schema...");

    // SQLite requires adding columns one at a time
    db.run("ALTER TABLE cacti ADD COLUMN exact_location TEXT", (err) => {
        if (err) console.log("⚠️ exact_location might already exist.");
        else console.log("✅ Added 'exact_location' column.");
    });

    db.run("ALTER TABLE cacti ADD COLUMN notes TEXT", (err) => {
        if (err) console.log("⚠️ notes might already exist.");
        else console.log("✅ Added 'notes' column.");
    });
});

// Close the connection after 1 second to ensure operations finish
setTimeout(() => {
    db.close();
    console.log("🏁 Migration complete! You can delete migrate.js now.");
}, 1000);