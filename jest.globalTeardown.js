const pool = require('./src/pages/api/db.cjs');
const { execSync } = require('child_process');

// Suppress all unhandledRejection and uncaughtException events during teardown
process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

module.exports = async () => {
  // Gracefully close pg pool and suppress unhandled error events
  try {
    pool.on('error', () => {}); // Suppress unhandled error events
    await pool.end();
  } catch (e) {
    // ignore errors
  }
  // Stop and remove the test database container using the correct docker compose command
  execSync('docker compose -f docker/database/docker-compose.yml down -v', { stdio: 'inherit' });
};
