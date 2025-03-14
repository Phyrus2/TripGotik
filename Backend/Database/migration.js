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
                console.log(`✅ Table ${table.name} created or already exists.`);
                if (table.name === 'users') {
                    seedUsers(); // Call seed function after creating users table
                }
            }
        });
    });
};

// Function to seed users data
const seedUsers = async () => {
    const users = [
        { name: 'Admin', email: 'admin@email.com', password: 'admin1234', role: 'admin' },
        { name: 'Cherysa', email: 'cherysa@email.com', password: 'cherysa1234', role: 'cherysa' },
        { name: 'Diyatmika', email: 'nusatin@email.com', password: 'diyatmika1234', role: 'diyatmika' },
        { name: 'Driver', email: 'driver@email.com', password: 'driver1234', role: 'driver' }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 12);

        db.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), role = VALUES(role)`,
            [user.name, user.email, hashedPassword, user.role],
            (err) => {
                if (err) {
                    console.error(`❌ Error seeding user ${user.email}:`, err);
                } else {
                    console.log(`✅ User ${user.email} seeded successfully.`);
                }
            }
        );
    }
};

module.exports = createTables;
