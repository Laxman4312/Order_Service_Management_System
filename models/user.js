const queryAsync = require('../middleware/queryAsync');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await queryAsync(query, [email]);
    return result[0] || null;
  }

  static async create(userData) {
    const { email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const result = await queryAsync(query, [email, hashedPassword]);

    return { id: result.insertId, email };
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
