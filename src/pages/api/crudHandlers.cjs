const pool = require('./db.cjs');
const Joi = require('joi');

// Helper to send error
function sendError(res, error) {
  res.status(500).json({ error: error.message || error });
}

// Joi schemas
const userSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  password: Joi.string().min(6).max(128).required(),
  email: Joi.string().email().required(),
  role: Joi.number().integer().required(),
});
const roleSchema = Joi.object({
  name: Joi.string().min(2).max(32).required(),
});

// /api/users handler
async function usersHandler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
      sendError(res, error);
    }
  } else if (req.method === 'POST') {
    const { username, password, email, role } = req.body;
    const { error } = userSchema.validate({ username, password, email, role });
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
      const result = await pool.query(
        'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, password, email, role]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      sendError(res, error);
    }
  } else {
    res.status(405).end();
  }
}

// /api/users/[id] handler
async function userByIdHandler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;
  if (method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(result.rows[0]);
    } catch (error) {
      sendError(res, error);
    }
  } else if (method === 'PUT') {
    const { username, password, email, role } = body;
    const { error } = userSchema.validate({ username, password, email, role });
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
      const result = await pool.query(
        'UPDATE users SET username = $1, password = $2, email = $3, role = $4 WHERE id = $5 RETURNING *',
        [username, password, email, role, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(result.rows[0]);
    } catch (error) {
      sendError(res, error);
    }
  } else if (method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  } else {
    res.status(405).end();
  }
}

// /api/roles handler
async function rolesHandler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM roles');
      res.status(200).json(result.rows);
    } catch (error) {
      sendError(res, error);
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    const { error } = roleSchema.validate({ name });
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
      const result = await pool.query('INSERT INTO roles (name) VALUES ($1) RETURNING *', [name]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      sendError(res, error);
    }
  } else {
    res.status(405).end();
  }
}

// /api/roles/[id] handler
async function roleByIdHandler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;
  if (method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Role not found' });
      res.status(200).json(result.rows[0]);
    } catch (error) {
      sendError(res, error);
    }
  } else if (method === 'PUT') {
    const { name } = body;
    const { error } = roleSchema.validate({ name });
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
      const result = await pool.query('UPDATE roles SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Role not found' });
      res.status(200).json(result.rows[0]);
    } catch (error) {
      sendError(res, error);
    }
  } else if (method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Role not found' });
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  } else {
    res.status(405).end();
  }
}

module.exports = {
  usersHandler,
  userByIdHandler,
  rolesHandler,
  roleByIdHandler,
};
