const db = require('./dbconect'); // Import database connection
const bcrypt = require('bcrypt');

// Function to create tables
const createTables = () => {
    const tables = [
        {
            name: 'users',
            query: `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
        }
    ];

    tables.forEach(table => {
        db.query(table.query, (err) => {
            if (err) {
                console.error(`❌ Error creating ${table.name} table:`, err);
            } else {
                
                if (table.name === 'users') {
                    seedUsers(); // Call seed function after creating users table
                }
            }
        });
    });
};

// Function to seed users data
const users = [
    { name: 'Admin', email: 'admin@email.com', password: 'password123', role: 'admin' },
    { name: 'Cherysa', email: 'cherysa@email.com', password: 'password123', role: 'cherysa' },
    { name: 'Diyatmika', email: 'nusatin@email.com', password: 'password123', role: 'diyatmika' },
    { name: 'Driver', email: 'driver@email.com', password: 'password123', role: 'driver' }
];

const seedUsers = async () => {
    for (const user of users) {
        db.query(`SELECT COUNT(*) AS count FROM users WHERE email = ?`, [user.email], async (err, result) => {
            if (err) {
                console.error(`❌ Error checking user ${user.email}:`, err);
                return;
            }

            if (result[0].count > 0) {
                
            } else {
                const hashedPassword = await bcrypt.hash(user.password, 12);
                db.query(
                    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
                    [user.name, user.email, hashedPassword, user.role],
                    (insertErr) => {
                        if (insertErr) {
                            console.error(`❌ Error inserting user ${user.email}:`, insertErr);
                        } else {
                            console.log(`✅ User ${user.email} inserted successfully.`);
                        }
                    }
                );
            }
        });
    }
};

module.exports = createTables;
