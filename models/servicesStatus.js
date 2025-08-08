const queryAsync = require('../middleware/queryAsync');

class ServiceStatus {
  static async findAll() {
    const query = `
      SELECT * FROM service_statuses 
      WHERE is_active = 1 
      ORDER BY id
    `;
    return await queryAsync(query);
  }

  static async findById(id) {
    const query = `
      SELECT * FROM service_statuses 
      WHERE id = ? AND is_active = 1
    `;
    const result = await queryAsync(query, [id]);
    return result[0] || null;
  }

  static async create(statusData) {
    const { status_name, message_template } = statusData;

    if (!status_name) {
      throw new Error('status_name is required');
    }

    const query = `
      INSERT INTO service_statuses 
      (status_name, message_template, is_active)
      VALUES (?, ?, 1)
    `;
    const result = await queryAsync(query, [status_name, message_template || null]);
    return { id: result.insertId };
  }

  static async update(id, statusData) {
    const { status_name, message_template } = statusData;

    if (!status_name) {
      throw new Error('status_name is required');
    }

    const query = `
      UPDATE service_statuses 
      SET status_name = ?, message_template = ?
      WHERE id = ? AND is_active = 1
    `;
    const result = await queryAsync(query, [status_name, message_template || null, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = `
      UPDATE service_statuses 
      SET is_active = 0 
      WHERE id = ?
    `;
    const result = await queryAsync(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ServiceStatus;
