const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const twilio = require('twilio')
require('dotenv').config();

// Database Connection
const { serverPort } = require('./config/envConfig.js');

const DB = require('./config/mongo_configuration');
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const notificationRoute = require('./routes/notificationRoute');
const reviewsRoute = require('./routes/reviewRoute');
const app = express();
// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors())


// Routes
// app.use('/api/employees', require('./routes/employeeRoutes'));
// app.use('/api/employers', require('./routes/employerRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/v1/auth', authRoute);
app.use('/v1/user', profileRoute);
app.use('/v1/notification', notificationRoute);
app.use('/v1/reviews', reviewsRoute);



app.get('/', (req, res) => {
    return res.send('Welcome to my TipPay Backend')
})

app.use((req, res, next) => {
    return res.status(404).json({
        status: 'error',
        message: 'The requested route does not exist',
        data: {},
    });
});

const PORT = serverPort || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));