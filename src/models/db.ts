import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'Asdf1234.',
    database: 'linkedin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
