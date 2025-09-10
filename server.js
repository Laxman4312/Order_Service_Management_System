const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// ✅ Define routes
const orderRoutes = require('./routes/orderRoutes'); 
app.use('/api/orders', orderRoutes);

const statusRoutes = require('./routes/statusRoutes');
app.use('/api/statuses', statusRoutes);


const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

const authController = require('./controllers/authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

app.use('/api/auth', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
