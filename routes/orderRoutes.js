const express = require('express');
const orderController = require('../controllers/orderController');

const authMiddleware = require('../middleware/auth');
const router = express.Router();





// Apply authentication middleware to all routes
// router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/export', orderController.exportOrders);
router.get('/count', orderController.getOrderCount);
router.get('/:id', orderController.getOrderById);


router.delete('/:id', orderController.deleteOrder);
router.put('/restore', orderController.restoreOrder); 
router.put('/restore/:id', orderController.restoreOrder); // for param
router.put('/:id', orderController.updateOrder);





module.exports = router;