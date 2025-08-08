const express = require('express');
const orderController = require('../controllers/orderController');

const authMiddleware = require('../middleware/auth');
const router = express.Router();





// Apply authentication middleware to all routes
// router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/export', orderController.exportOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;