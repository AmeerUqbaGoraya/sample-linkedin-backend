"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const pool = (0, promise_1.createPool)({
    host: 'localhost',
    user: 'root',
    password: 'Asdf1234.',
    database: 'linkedin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.default = pool;
//# sourceMappingURL=db.js.map