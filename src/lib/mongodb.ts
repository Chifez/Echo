// $lib/mongodb.ts
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

// Make sure we have a MongoDB URI
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

const uri = MONGODB_URI;
const options = {
  // Modern MongoDB connection options
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
  serverSelectionTimeoutMS: 15000, // 15 seconds
};

console.log('MongoDB URI configured:', uri.substring(0, 15) + '...');

// Global variables for connection pooling
let client;
let clientPromise: any;
let isConnected = false;

// Also setup mongoose connection
async function connectMongoose() {
  try {
    if (!isConnected) {
      console.log('Connecting to MongoDB with Mongoose...');

      // Configure mongoose
      mongoose.set('strictQuery', false);

      // Connect mongoose to the same MongoDB instance
      await mongoose.connect(uri, {
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      isConnected = true;
      console.log('MongoDB connected successfully with Mongoose');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB with Mongoose:', error);
    throw error;
  }
}

// Initialize MongoDB connection
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve connection across hot reloads
  if (!(global as any).mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any).mongoClientPromise = client
      .connect()
      .then(async (client) => {
        console.log('MongoDB client connected successfully');
        await connectMongoose();
        return client;
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  clientPromise = (global as any).mongoClientPromise;
} else {
  // In production, create a new connection for each request
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then(async (client) => {
      console.log('MongoDB client connected successfully');
      await connectMongoose();
      return client;
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}

// Export the connection promise
export default clientPromise;

// Export a helper function to ensure mongoose is connected
export const ensureMongooseConnection = async () => {
  if (!isConnected) {
    await connectMongoose();
  }
  return mongoose;
};
