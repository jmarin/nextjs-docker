const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'nextjs',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'nextjs',
  password: process.env.PGPASSWORD || 'nextjs',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// Always set the search_path to nextjs,public for every connection
pool.on('connect', client => {
  client.query('SET search_path TO nextjs,public;');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
