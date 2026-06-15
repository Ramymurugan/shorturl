const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const PORT = env.port;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${env.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
