import mongoose from 'mongoose';
import dns from 'dns';

// Override DNS servers for Node 20+ SRV lookup compatibility
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Maintain a cached connection object across Lambda freezes/thaws
let cached = global.mongoose || { conn: null, promise: null };

const connectDB = async () => {
  // Reuse existing database connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Initial connection attempt
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents Mongoose from queuing queries if offline
      serverSelectionTimeoutMS: 5000, // Timeout faster instead of hanging Lambda
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise so next invocation can try reconnecting
    console.error(`Database Connection Error: ${error.message}`);
    throw error; // Let Express handle the error—DO NOT call process.exit(1)
  }

  return cached.conn;
};

export default connectDB;