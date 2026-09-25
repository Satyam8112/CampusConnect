import mongoose from 'mongoose';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from .env');
    }

    console.log('[DATABASE] Attempting MongoDB connection...');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000
    });

    console.log('==============================================');
    console.log('[DATABASE SUCCESS] MongoDB connected successfully');
    console.log(`[DATABASE] Host: ${conn.connection.host}`);
    console.log(`[DATABASE] Database: ${conn.connection.name}`);
    console.log('==============================================');

    return conn;

  } catch (error) {
    console.error('[DATABASE ERROR] MongoDB Connection Failed:');
    console.error(error.message);

    throw error;
  }
};

export default connectDB;