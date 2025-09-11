const express = require('express');
const serviceController = require('../controllers/serviceController');

const authMiddleware = require('../middleware/auth');
const router = express.Router();





// Apply authentication middleware to all routes
// router.use(authMiddleware);

router.post('/', serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/export', serviceController.exportServices);
router.get('/count', serviceController.getServiceCount);
router.get('/:id', serviceController.getServiceById);
router.put('/restore', serviceController.restoreService); // for query/body
router.put('/restore/:id', serviceController.restoreService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;