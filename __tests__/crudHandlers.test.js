const request = require('supertest');
const { createServer } = require('http');
const { usersHandler, userByIdHandler, rolesHandler, roleByIdHandler } = require('../src/pages/api/crudHandlers.cjs');

// Helper to wrap handler in a server for supertest, with Next.js-like res
function makeTestServer(handler, url = '/') {
  return createServer((req, res) => {
    // Patch req.query and req.body for Next.js-like API
    const urlObj = new URL(req.url, 'http://localhost');
    req.query = Object.fromEntries(urlObj.searchParams.entries());
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch {
        req.body = {};
      }
      // Patch res with .status, .json, .end
      let statusCode = 200;
      res.status = function (code) {
        statusCode = code;
        res.statusCode = code;
        return res;
      };
      res.json = function (obj) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
      };
      const origEnd = res.end;
      res.end = function (...args) {
        res.statusCode = statusCode;
        origEnd.apply(res, args);
      };
      handler(req, res);
    });
  });
}

describe('Users API', () => {
  let server;
  beforeAll(() => {
    server = makeTestServer(usersHandler);
    server.listen(4001);
  });
  afterAll(() => server.close());

  it('GET /api/users should return array', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/users should create user', async () => {
    const user = { username: 'jestuser', password: 'pw', email: 'jest@example.com', role: 2 };
    const res = await request(server).post('/').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe(user.username);
  });
});

describe('User by ID API', () => {
  let server;
  let userId;
  beforeAll(async () => {
    server = makeTestServer(userByIdHandler, '/1');
    // Create a user to test with
    const usersServer = makeTestServer(usersHandler);
    usersServer.listen(4002);
    const res = await request(usersServer).post('/').send({ username: 'jestid', password: 'pw', email: 'id@example.com', role: 2 });
    userId = res.body.id;
    usersServer.close();
  });
  afterAll(() => server.close());

  it('GET /api/users/[id] should return user', async () => {
    const res = await request(server).get(`/?id=${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('PUT /api/users/[id] should update user', async () => {
    const res = await request(server).put(`/?id=${userId}`).send({ username: 'jestid2', password: 'pw', email: 'id2@example.com', role: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('jestid2');
  });

  it('DELETE /api/users/[id] should delete user', async () => {
    const res = await request(server).delete(`/?id=${userId}`);
    expect([204, 200]).toContain(res.statusCode);
  });
});

describe('Roles API', () => {
  let server;
  beforeAll(() => {
    server = makeTestServer(rolesHandler);
    server.listen(4003);
  });
  afterAll(() => server.close());

  it('GET /api/roles should return array', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/roles should create role', async () => {
    const res = await request(server).post('/').send({ name: 'jestrole' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('jestrole');
  });
});

describe('Role by ID API', () => {
  let server;
  let roleId;
  beforeAll(async () => {
    server = makeTestServer(roleByIdHandler, '/1');
    // Create a role to test with
    const rolesServer = makeTestServer(rolesHandler);
    rolesServer.listen(4004);
    const res = await request(rolesServer).post('/').send({ name: 'jestroleid' });
    roleId = res.body.id;
    rolesServer.close();
  });
  afterAll(() => server.close());

  it('GET /api/roles/[id] should return role', async () => {
    const res = await request(server).get(`/?id=${roleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(roleId);
  });

  it('PUT /api/roles/[id] should update role', async () => {
    const res = await request(server).put(`/?id=${roleId}`).send({ name: 'jestroleid2' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('jestroleid2');
  });

  it('DELETE /api/roles/[id] should delete role', async () => {
    const res = await request(server).delete(`/?id=${roleId}`);
    expect([204, 200]).toContain(res.statusCode);
  });
});
