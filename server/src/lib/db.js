import mongoose from 'mongoose';

// Explicitly use the 'wedding' database
// Parse MONGODB_URI to ensure it uses 'wedding' database
const getMongoUri = () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding';
  
  // If URI doesn't specify a database, add 'wedding'
  if (uri && !uri.includes('/wedding') && !uri.includes('?') && uri.includes('mongodb://')) {
    // Remove any existing database name and add 'wedding'
    const uriWithoutDb = uri.split('/').slice(0, 3).join('/');
    return `${uriWithoutDb}/wedding`;
  }
  
  // If URI has a database specified but it's not 'wedding', replace it
  if (uri.includes('/')) {
    const parts = uri.split('/');
    const lastPart = parts[parts.length - 1];
    
    // If last part is not 'wedding' and doesn't contain query params, replace it
    if (!lastPart.includes('wedding') && !lastPart.includes('?')) {
      parts[parts.length - 1] = 'wedding';
      return parts.join('/');
    }
    
    // If it contains query params, insert 'wedding' before the query params
    if (lastPart.includes('?')) {
      const [dbName, queryParams] = lastPart.split('?');
      if (dbName !== 'wedding') {
        parts[parts.length - 1] = `wedding?${queryParams}`;
        return parts.join('/');
      }
    }
  }
  
  return uri;
};

const MONGODB_URI = getMongoUri();

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    // Return cached connection if already connected and ready
    if (mongoose.connection.readyState === 1) {
      // Verify we're connected to the correct database
      if (mongoose.connection.name !== 'wedding') {
        console.warn(`⚠️ Currently connected to '${mongoose.connection.name}' database, reconnecting to 'wedding' database...`);
        await mongoose.disconnect();
        cached.conn = null;
        cached.promise = null;
      } else {
        // Verify connection is actually ready by checking readyState
        if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
          return mongoose;
        }
      }
    }

    // Return existing promise if connection is in progress
    if (cached.promise) {
      const connection = await cached.promise;
      // Wait for connection to be fully ready
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Connection not ready after promise resolved');
      }
      return connection;
    }

    // Create new connection promise with explicit database name
    // CRITICAL: dbName option will override any database name in the URI
    // This ensures we ALWAYS use 'wedding' database, never 'test' or any other database
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: true, // Buffer commands until connection is ready
      dbName: 'wedding', // FORCE: Always use 'wedding' database, ignores URI database name
    }).then(async () => {
      // Wait for connection to be fully ready (readyState === 1)
      let retries = 0;
      while (mongoose.connection.readyState !== 1 && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB connection not ready after connection attempt');
      }
      
      const dbName = mongoose.connection.name;
      console.log('✅ Successfully connected to MongoDB');
      console.log('📊 Database:', dbName);
      console.log('🔌 Connection state:', mongoose.connection.readyState);
      
      // Verify database name - this should never fail if dbName option works correctly
      if (dbName !== 'wedding') {
        console.error(`❌ CRITICAL ERROR: Connected to wrong database '${dbName}' instead of 'wedding'`);
        console.error(`❌ Connection URI: ${MONGODB_URI}`);
        console.error(`❌ Please check your MONGODB_URI environment variable`);
        console.error(`❌ The dbName option should force 'wedding' database`);
        throw new Error(`Database connection error: Expected 'wedding' but got '${dbName}'`);
      } else {
        console.log('✅ Confirmed: Using "wedding" database (not "test")');
      }
      
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      cached.conn = null;
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export default dbConnect;