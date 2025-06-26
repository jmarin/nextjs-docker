const isCI = process.env.CI === 'true';

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js'],
    globalSetup: isCI ? undefined : './jest.globalSetup.js',
    globalTeardown: isCI ? undefined : './jest.globalTeardown.js',
};
