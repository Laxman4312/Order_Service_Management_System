const OrderStatus = require('../models/OrderStatus');
const ServiceStatus = require('../models/servicesStatus');

const statusController = {
    // Order Status Controllers
    async getAllOrderStatuses(req, res) {
        try {
            const statuses = await OrderStatus.findAll();
            res.json(statuses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createOrderStatus(req, res) {
        try {
            const status = await OrderStatus.create(req.body);
            res.status(201).json({
                message: 'Order status created successfully',
                status
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateOrderStatus(req, res) {
        try {
            const success = await OrderStatus.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ error: 'Order status not found' });
            }
            res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteOrderStatus(req, res) {
        try {
            const success = await OrderStatus.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Order status not found' });
            }
            res.json({ message: 'Order status deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Service Status Controllers
    async getAllServiceStatuses(req, res) {
        try {
            const statuses = await ServiceStatus.findAll();
            res.json(statuses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async createServiceStatus(req, res) {
        try {
            const status = await ServiceStatus.create(req.body);
            res.status(201).json({
                message: 'Service status created successfully',
                status
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateServiceStatus(req, res) {
        try {
            const success = await ServiceStatus.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ error: 'Service status not found' });
            }
            res.json({ message: 'Service status updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteServiceStatus(req, res) {
        try {
            const success = await ServiceStatus.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Service status not found' });
            }
            res.json({ message: 'Service status deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = statusController;