const sqlite3 = require('sqlite3').verbose();

// 1. Connect/Create the database file
const db = new sqlite3.Database('./portal.db');

// 2. Run a command to create a table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      major TEXT
    )
  `);
  console.log("Success! Your 'portal.db' file has been created.");
});

db.close();