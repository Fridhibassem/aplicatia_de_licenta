const { randomUUID } = require('crypto');

function createUser({ email, password, name = '', role = 'user' }) {
  return {
    id:        randomUUID(),
    email:     email.toLowerCase().trim(),
    password,
    name:      name.trim(),
    role,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
}

module.exports = { createUser };