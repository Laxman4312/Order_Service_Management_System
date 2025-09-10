
const express = require('express');
const statusController = require('../controllers/statusContoller');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


//router.use(authMiddleware);

// Order status routes
router.get('/orders', statusController.getAllOrderStatuses);
router.post('/orders', statusController.createOrderStatus);
router.put('/orders/:id', statusController.updateOrderStatus);
router.delete('/orders/:id', statusController.deleteOrderStatus);

// Service status routes
router.get('/services', statusController.getAllServiceStatuses);
router.post('/services', statusController.createServiceStatus);
//router.put('/services/:id', statusController.updateServiceStatus);
router.put('/services/:id', statusController.updateServiceStatus);

router.delete('/services/:id', statusController.deleteServiceStatus);

module.exports = router;
