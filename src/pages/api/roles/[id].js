const { roleByIdHandler } = require('./crudHandlers.cjs');

export default function handler(req, res) {
  // Next.js dynamic API route: /api/roles/[id]
  return roleByIdHandler(req, res);
}
