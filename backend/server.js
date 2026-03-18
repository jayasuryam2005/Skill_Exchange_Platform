const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const matches = require('./routes/matches');
const requests = require('./routes/requests');
const sessions = require('./routes/sessions');
const reviews = require('./routes/reviews');
const notifications = require('./routes/notifications');
const chat = require('./routes/chat');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/matches', matches);
app.use('/api/requests', requests);
app.use('/api/sessions', sessions);
app.use('/api/reviews', reviews);
app.use('/api/notifications', notifications);
app.use('/api/chat', chat);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Skill Exchange API' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
