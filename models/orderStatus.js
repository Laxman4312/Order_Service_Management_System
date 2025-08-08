const queryAsync = require('../middleware/queryAsync');

class OrderStatus {
    static async findAll() {
        const sql = `
            SELECT * FROM order_statuses 
            WHERE is_active = 1 
            ORDER BY id
        `;
        const result = await queryAsync(sql);
        return result;
    }

    static async findById(id) {
        const sql = `
            SELECT * FROM order_statuses 
            WHERE id = ?
        `;
        const result = await queryAsync(sql, [id]);
        return result[0] || null;
    }

    static async create(statusData) {
        const { status_name, message_template } = statusData;

        if (!status_name) {
            throw new Error('status_name is required');
        }

        const sql = `
            INSERT INTO order_statuses (status_name, message_template, is_active)
            VALUES (?, ?, 1)
        `;
        const result = await queryAsync(sql, [status_name, message_template || null]);

        return { id: result.insertId };
    }

    static async update(id, statusData) {
        const { status_name, message_template } = statusData;

        if (!status_name) {
            throw new Error('status_name is required');
        }

        const sql = `
            UPDATE order_statuses
            SET status_name = ?, message_template = ?,updated_at = NOW()
            WHERE id = ? AND is_active = 1
        `;
        const result = await queryAsync(sql, [status_name, message_template || null, id]);

        return result.affectedRows > 0;
    }

    static async delete(id) {
        const sql = `
            UPDATE order_statuses
            SET is_active = 0
            WHERE id = ?
        `;
        const result = await queryAsync(sql, [id]);

        return result.affectedRows > 0;
    }
}

module.exports = OrderStatus;
