const { usersHandler } = require('./crudHandlers.cjs');

export default function handler(req, res) {
  return usersHandler(req, res);
}
