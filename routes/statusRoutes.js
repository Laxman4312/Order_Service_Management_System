
const express = require('express');
const statusController = require('../controllers/statusContoller');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


//router.use(authMiddleware);

// Order status routes
router.get('/orders', statusController.getAllOrderStatuses);
router.post('/orders/create', statusController.createOrderStatus);
router.put('/orders/update/:id', statusController.updateOrderStatus);
router.delete('/orders/delete/:id', statusController.deleteOrderStatus);

// Service status routes
router.get('/services', statusController.getAllServiceStatuses);
router.post('/services/create', statusController.createServiceStatus);
router.put('/services/update/:id', statusController.updateServiceStatus);
router.delete('/services/delete/:id', statusController.deleteServiceStatus);

module.exports = router;
