const { userByIdHandler } = require('../crudHandlers.cjs');

export default function handler(req, res) {
  // Next.js dynamic API route: /api/users/[id]
  return userByIdHandler(req, res);
}
