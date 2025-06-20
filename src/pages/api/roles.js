const { rolesHandler } = require('./crudHandlers.cjs');

export default function handler(req, res) {
  return rolesHandler(req, res);
}
