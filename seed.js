const sqlite3 = require('sqlite3').verbose();

// Connect to (or create) the database
const db = new sqlite3.Database('./cactus.db');

// Your parsed collection payload
const initialCacti = [
    // 🇲🇽 Meksyk
    { fn: 'GM 765', genus: 'Coryphantha', species: 'pycnacantha', origin: 'Mexicó: Hidalgo Cd Sahagun', desc: 'Altitude: 2400 m' },
    { fn: 'REP 1328', genus: 'Mammillaria', species: 'tlalocii', origin: 'Mexicó: Oaxaca Barranca Ixcatlan', desc: 'Altitude: 800 m' },
    
    // 🇺🇸 USA
    { fn: 'DJF 1308', genus: 'Echinocereus', species: 'reichenbachii subsp. baileyi', origin: 'USA: Granite', desc: '250.603/17' },
    { fn: 'SB 426', genus: 'Echinocereus', species: 'viridiflorus v. davisii', origin: 'USA: Texas (Brewster County)', desc: '⚠️ Nie mrozoodporny' },
    { fn: 'HK 1213', genus: 'Echinocereus', species: 'triglochidiatus', origin: 'USA: Santa Fe Co., NM', desc: '✅ Mrozoodporny' },

    // 🇧🇴 Boliwia
    { fn: 'TB 1000.2', genus: 'Echinopsis', species: 'obrepanda', origin: 'Quinori, Cochabamba, Bolivia', desc: 'Altitude: 2323 m' },
    { fn: 'TB 0990.1', genus: 'Lobivia', species: 'arachnacantha v. densiseta', origin: 'Vallegrande, Santa Cruz, Boliwia', desc: '' },
    { fn: 'TB 0087.1', genus: 'Lobivia', species: 'oligotricha', origin: 'Arani, Cochabamba, Boliwia', desc: 'Altitude: 3220 m' },
    { fn: 'TB 0468.1', genus: 'Lobivia', species: 'backebergii', origin: 'Palca, La Paz, Boliwia', desc: 'Altitude: 3943 m' },
    { fn: 'VZ 321', genus: 'Mediolobivia', species: 'atrovirens', origin: 'Cerro Cantar Gallo, Bolivia', desc: 'Altitude: 3600 m. ✅ Mrozoodporny' },

    // 🇦🇷 Argentyna
    { fn: 'TB 1090.2', genus: 'Echinopsis', species: 'leucantha', origin: 'San Juan (Villa Mercedes to Huaco), Argentina', desc: 'Altitude: 1061 m' },
    { fn: 'LF 85', genus: 'Gymnocalycium', species: 'erinaceum v. paucisquamosum', origin: 'Ongamira, Cordoba, Argentina', desc: 'Altitude: 1200 m' },
    { fn: 'LF 10', genus: 'Gymnocalycium', species: 'neuhuberi', origin: 'Suyuque Nuevo, San Luis, Argentina', desc: 'Altitude: 1550 m' },
    { fn: 'TB 0713.1', genus: 'Lobivia', species: 'tiegeliana v. cinnabarina', origin: 'Nazareno to Pascaya, Salta, Argentina', desc: '✅ Mrozoodporny' },
    { fn: 'TB 1121.1', genus: 'Lobivia', species: 'jajoiana var. glauca', origin: 'Estancia Grande, NW of Purmamarca, Jujuy', desc: '' },
    { fn: 'LF 55', genus: 'Mediolobivia', species: 'einsteinii v. atrospinosa', origin: 'Cachinal, Salta, Argentina', desc: 'Altitude: 3600 m' },
    { fn: 'JN 1416', genus: 'Pterocactus', species: 'tuberosus', origin: 'Salinas Las Diamante, Mendoza, Argentina', desc: 'Altitude: 1372 m' },
    { fn: 'SAR 161/8', genus: 'Pterocactus', species: 'gonjanii', origin: 'Ruta 412 Calingasta, Argentina', desc: 'Altitude: 2620 m' },

    // 🇵🇪 Peru
    { fn: 'TB 0952.1', genus: 'Lobivia', species: 'acchaensis', origin: 'Accha, Cuzco, Peru', desc: 'Altitude: 3518 m' },
    { fn: 'TB 0286.1', genus: 'Lobivia', species: 'hertrichiana f. divaricata', origin: 'San Salvador, Cuzco, Peru', desc: 'Altitude: 3090 m' },
    
    // Brak numeru polowego (Field Number) - Używamy tymczasowych ID, aby baza nie odrzuciła duplikatów
    { fn: 'CULT-001', genus: 'Astrophytum', species: 'capricorne', origin: 'Cultivar', desc: '⚠️ Nie mrozoodporny' },
    { fn: 'CULT-002', genus: 'Gymnocalycium', species: 'mihanovichii variegata', origin: 'Cultivar', desc: '⚠️ Nie mrozoodporny' }
];

db.serialize(() => {
    // 1. Create the table
    db.run(`CREATE TABLE IF NOT EXISTS cacti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_number TEXT UNIQUE,
        genus TEXT,
        species TEXT,
        origin TEXT,
        description TEXT
    )`);

    console.log("🛠️ Table verified/created...");

    // 2. Prepare the statement with Upsert logic
    const stmt = db.prepare(`
        INSERT INTO cacti (field_number, genus, species, origin, description) 
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(field_number) DO UPDATE SET 
            genus=excluded.genus,
            species=excluded.species,
            origin=excluded.origin,
            description=excluded.description
    `);
    
    // 3. Run the loop
    initialCacti.forEach(cactus => {
        stmt.run(cactus.fn, cactus.genus, cactus.species, cactus.origin, cactus.desc, (err) => {
            if (err) console.error(`Error inserting ${cactus.fn}:`, err.message);
        });
    });

    stmt.finalize();
    console.log(`🌵 Successfully seeded ${initialCacti.length} cacti records into the database!`);
});

db.close();