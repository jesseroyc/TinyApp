const bcrypt = require('bcrypt');

const users = {
  'admin123' : {
    userId: 'admin123',
    email: 'admin@google.com',
    password: bcrypt.hashSync('admin', 10)
  }
};

exports.users = users;