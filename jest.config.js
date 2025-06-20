module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js'],
    globalSetup: './jest.globalSetup.js',
    globalTeardown: './jest.globalTeardown.js',
};
