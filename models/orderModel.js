const queryAsync = require('../middleware/queryAsync');

class Order {
    static async create(orderData) {
        const {
            customer_name, customer_contact, customer_address, product,
            total_amount, advance_paid = 0, advance_mode = null,
            estimated_dispatch_date = null, revised_dispatch_date = null,
            shipping_carrier = null, shipping_lr_tracking = null,
            comments = null, status_id
        } = orderData;


        const order_date = new Date().toISOString().split('T')[0];
        const order_no = await this.generateOrderNumber();

        const sql = `
            INSERT INTO orders (
                order_no, order_date, customer_name, customer_contact, 
                customer_address, product, total_amount, advance_paid, 
                advance_mode, estimated_dispatch_date, revised_dispatch_date,
                shipping_carrier, shipping_lr_tracking, comments, status_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await queryAsync(sql, [
            order_no, order_date, customer_name, customer_contact,
            customer_address, product, total_amount, advance_paid,
            advance_mode, estimated_dispatch_date, revised_dispatch_date,
            shipping_carrier, shipping_lr_tracking, comments, status_id
        ]);

        return { id: result.insertId, order_no };
    }

    static async generateOrderNumber() {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const datePrefix = `ORD${year}${month}${day}`;

        const sql = `
            SELECT order_no FROM orders
            WHERE order_no LIKE ?
            ORDER BY order_no DESC
            LIMIT 1
        `;
        const result = await queryAsync(sql, [`${datePrefix}%`]);

        let sequence = 1;
        if (result.length > 0) {
            const lastOrderNo = result[0].order_no;
            const lastSequence = parseInt(lastOrderNo.slice(-3));
            sequence = lastSequence + 1;
        }

        return `${datePrefix}${String(sequence).padStart(3, '0')}`;
    }

    static async findAll(filters = {}) {
        let sql = `
            SELECT o.*, os.status_name 
            FROM orders o
            JOIN order_statuses os ON o.status_id = os.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.status_id) {
            sql += ' AND o.status_id = ?';
            params.push(filters.status_id);
        }

        if (filters.order_date) {
            sql += ' AND o.order_date = ?';
            params.push(filters.order_date);
        }

        if (filters.order_no) {
            sql += ' AND o.order_no LIKE ?';
            params.push(`%${filters.order_no}%`);
        }

        sql += ' ORDER BY o.created_at DESC';

        const result = await queryAsync(sql, params);
        return result;
    }

    static async findById(id) {
        const sql = `
            SELECT o.*, os.status_name, os.message_template
            FROM orders o
            JOIN order_statuses os ON o.status_id = os.id
            WHERE o.id = ?
        `;
        const result = await queryAsync(sql, [id]);
        return result[0];
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);

        if (fields.length === 0) {
            const error = new Error("No fields provided to update");
            error.statusCode = 400;
            throw error;
        }

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const sql = `
            UPDATE orders
            SET ${setClause}, updated_at = NOW()
            WHERE id = ?
        `;
        values.push(id);

        const result = await queryAsync(sql, values);
        if (result.affectedRows === 0) {
            const error = new Error("Order not found or not updated");
            error.statusCode = 404;
            throw error;
        }

        return { message: "Order updated successfully" };
    }

    static async updateStatus(id, status_id) {
        const sql = 'UPDATE orders SET status_id = ? WHERE id = ?';
        const result = await queryAsync(sql, [status_id, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const sql = 'DELETE FROM orders WHERE id = ?';
        const result = await queryAsync(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Order;
