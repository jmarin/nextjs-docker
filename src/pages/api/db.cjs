const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nextjs:nextjs@localhost:5432/nextjs',
});

pool.on('connect', client => {
  client.query('SET search_path TO nextjs');
});

module.exports = pool;
