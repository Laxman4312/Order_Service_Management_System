const queryAsync = require('../middleware/queryAsync');

class Service {
    static async create(serviceData) {
         
        const {
            customer_name, customer_address, customer_phone, product_for_service,
            service_details, estimated_service_cost, estimated_delivery_date,
            comments, status_id
        } = serviceData;
        
   

        const service_date = new Date().toISOString().split('T')[0];
        const jobcard_no = await this.generateJobcardNumber();

        const query = `
            INSERT INTO services (
                jobcard_no, customer_name, customer_address, customer_phone,
                product_for_service, service_date, service_details,
                estimated_service_cost, estimated_delivery_date, comments, status_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await queryAsync(query, [
            jobcard_no, customer_name, customer_address, customer_phone,
            product_for_service, service_date, service_details,
            estimated_service_cost, estimated_delivery_date, comments, status_id
        ]);

        return { id: result.insertId, jobcard_no };
    }

    static async generateJobcardNumber() {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const datePrefix = `JC${year}${month}${day}`;

        const query = `
            SELECT jobcard_no FROM services 
            WHERE jobcard_no LIKE ? 
            ORDER BY jobcard_no DESC 
            LIMIT 1
        `;
        const result = await queryAsync(query, [`${datePrefix}%`]);

        let sequence = 1;
        if (result.length > 0) {
            const lastJobcardNo = result[0].jobcard_no;
            const lastSequence = parseInt(lastJobcardNo.substr(-3), 10);
            sequence = lastSequence + 1;
        }

        return `${datePrefix}${String(sequence).padStart(3, '0')}`;
    }


static async findAll(filters = {}, is_deleted= null) {
    let sql = `
        SELECT s.*, ss.status_name, ss.message_template
        FROM services s
        JOIN service_statuses ss ON s.status_id = ss.id
        WHERE 1=1
    `;
    const params = [];
      if (is_deleted === true) {
            sql += ' AND s.is_deleted = 1';
        } else if (is_deleted === false) {
            sql += ' AND s.is_deleted = 0';
        }

    if (filters.status_id) {
        sql += ' AND s.status_id = ?';
        params.push(filters.status_id);
    }

    if (filters.service_date) {
        sql += ' AND s.service_date = ?';
        params.push(filters.service_date);
    }

    if (filters.query) {
        sql += ' AND (s.jobcard_no LIKE ? OR s.customer_name LIKE ?)';
        params.push(`%${filters.query}%`, `%${filters.query}%`);
    }

    sql += ' ORDER BY s.created_at DESC';

    const result = await queryAsync(sql, params);
    return result;
}


    static async findById(id) {
        const query = `
            SELECT s.*, ss.status_name, ss.message_template
            FROM services s 
            JOIN service_statuses ss ON s.status_id = ss.id 
            WHERE s.id = ?
        `;
        const result = await queryAsync(query, [id]);
        return result[0];
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);

        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE services SET ${setClause}, updated_at = NOW() WHERE id = ?`;

        values.push(id);

        const result = await queryAsync(query, values);
        return result.affectedRows > 0;
    }

static async delete(id) {
    const sql = `
        UPDATE services 
        SET is_deleted = 1, updated_at = NOW() 
        WHERE id = ? AND is_deleted = 0
    `;
    const result = await queryAsync(sql, [id]);

    if (result.affectedRows === 0) {
        throw new Error("Service not found or already deleted");
    }

    return true;
}

  static async countAll() {
    const sql = `
      SELECT COUNT(*) as total
      FROM services
      WHERE is_deleted = 0
    `;
    const result = await queryAsync(sql);
    return result[0].total || 0;
  }



    // ♻️ Restore soft-deleted order
static async restore(id) {
  console.log('services.restore called with ID:', id, 'Type:', typeof id);
  
  // Ensure id is a number
  const serviceId = parseInt(id);
  if (isNaN(serviceId)) {
    throw new Error('Invalid service ID');
  }
  
  const sql = 'UPDATE services SET is_deleted = 0, updated_at = NOW() WHERE id = ? AND is_deleted = 1';
  console.log('Executing restore SQL:', sql, 'with ID:', serviceId);
  
  const result = await queryAsync(sql, [serviceId]);
  console.log('Restore result:', result);
  console.log('Affected rows:', result.affectedRows);
  
  return result.affectedRows > 0;
}
}

module.exports = Service;
