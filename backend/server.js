const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const subscriptions = require('./routes/subscriptions');
const auditlogs = require('./routes/auditlogs');
const settings = require('./routes/settings');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/subscriptions', subscriptions);
app.use('/api/auditlogs', auditlogs);
app.use('/api/settings', settings);

app.get('/', (req, res) => {
  res.send('SubSense API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
