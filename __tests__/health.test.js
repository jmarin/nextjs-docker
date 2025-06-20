const path = require('path');
const { handler } = require('../src/pages/api/health.cjs');
const httpMocks = require('node-mocks-http');

describe('/api/health endpoint', () => {
    it('should return status ok', async () => {
        const req = httpMocks.createRequest({ method: 'GET' });
        const res = httpMocks.createResponse();
        handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toEqual({ status: 'ok' });
    });
});
