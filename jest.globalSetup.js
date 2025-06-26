const { execSync } = require('child_process');

function waitForPostgresReady() {
  const maxAttempts = 20;
  const delay = 10000; // 1 second
  for (let i = 0; i < maxAttempts; i++) {
    try {
      execSync(
        "docker compose -f docker/database/docker-compose.yml exec -T postgres pg_isready -U nextjs",
        { stdio: 'ignore' }
      );
      return;
    } catch (e) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
    }
  }
  throw new Error('Postgres did not become ready in time');
}

module.exports = async () => {
  // Start the test database container using the correct docker compose command
  execSync('docker compose -f docker/database/docker-compose.yml up -d', { stdio: 'inherit' });
  // Wait for the DB to be ready (optional: you can add a more robust wait or healthcheck)
  waitForPostgresReady();
};
