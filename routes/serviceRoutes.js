const express = require('express');
const serviceController = require('../controllers/serviceController');

const authMiddleware = require('../middleware/auth');
const router = express.Router();





// Apply authentication middleware to all routes
// router.use(authMiddleware);

router.post('/create', serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/export', serviceController.exportServices);
router.get('/:id', serviceController.getServiceById);
router.put('/update/:id', serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);

module.exports = router;