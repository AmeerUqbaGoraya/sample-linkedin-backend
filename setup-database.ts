import { createTables } from './src/models/schema';
import { createPool } from 'mysql2/promise';

async function setupDatabase() {
    const pool = createPool({
        host: 'localhost',
        user: 'root',
        password: 'Asdf1234.',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        await pool.execute('CREATE DATABASE IF NOT EXISTS linkedin');
        
        const dbPool = createPool({
            host: 'localhost',
            user: 'root',
            password: 'Asdf1234.',
            database: 'linkedin',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        
        await createTables();
        console.log('Database setup complete!');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Database setup failed:', error);
        await pool.end();
        process.exit(1);
    }
}

setupDatabase();
