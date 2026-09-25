import 'dotenv/config'; // Load environment variables immediately before other modules
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Helper function to start Express listener
const startExpressServer = () => {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`CampusConnect Server is running on port: ${PORT}`);
    console.log(`Environment Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
};

// Attempt Database connection, fallback to running server on failure
connectDB()
  .then(() => {
    startExpressServer();
  })
  .catch((error) => {
    console.error(`[DATABASE ERROR] ${error.message}`);
    console.log('Starting server in offline-database mode...');
    startExpressServer();
  });
