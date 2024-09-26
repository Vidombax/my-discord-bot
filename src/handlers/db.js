const pg = require('pg');
const db = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
});

module.exports = db;
