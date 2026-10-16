import mongoose from 'mongoose';

let isConnected = false;
let lastError: string | null = null;
let connectedHost: string | null = null;
let lastAttemptTime = 0;
const TARGET_DB_NAME = 'karbonDB';

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    lastError = 'No MONGODB_URI configured in environment';
    isConnected = false;
    console.log('[KARBON DB] No MONGODB_URI found in environment.');
    return false;
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  lastAttemptTime = Date.now();

  try {
    const conn = await mongoose.connect(uri, {
      dbName: TARGET_DB_NAME,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    isConnected = conn.connection.readyState === 1;
    connectedHost = conn.connection.host;
    lastError = null;

    console.log(`[KARBON DB] Successfully connected to MongoDB Atlas! Host: ${conn.connection.host}, Database: ${conn.connection.name}`);

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.log('[KARBON DB] MongoDB connection disconnected.');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('[KARBON DB] MongoDB reconnected.');
    });

    return true;
  } catch (err) {
    isConnected = false;
    connectedHost = null;
    const rawError = (err as Error).message || '';
    
    // Provide actionable diagnosis for user
    if (rawError.includes('whitelisted') || rawError.includes('SSL alert number 80') || rawError.includes('tlsv1 alert internal error')) {
      lastError = 'MongoDB Atlas IP Whitelist required. Go to Atlas → Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0) or add 34.34.254.184.';
    } else if (rawError.includes('bad auth') || rawError.includes('Authentication failed')) {
      lastError = 'MongoDB Atlas authentication failed. Check username and password credentials in MONGODB_URI.';
    } else {
      lastError = rawError;
    }

    console.error(`[KARBON DB] Atlas connection attempt: ${lastError}`);
    return false;
  }
}

// Background auto-reconnect loop: checks every 15s so when user updates Atlas whitelist it connects immediately
setInterval(async () => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    await connectDB().catch(() => {});
  }
}, 15000);

export async function ensureMongoConnected(): Promise<boolean> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }
  const now = Date.now();
  if (now - lastAttemptTime < 5000) {
    return isConnected;
  }
  return connectDB();
}

export function getIsMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getMongoConnectionState() {
  const readyState = mongoose.connection.readyState;
  const readyStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    isConnected: readyState === 1,
    state: readyStateMap[readyState] || 'disconnected',
    database: TARGET_DB_NAME,
    host: connectedHost || (readyState === 1 ? mongoose.connection.host : null),
    lastError: lastError,
    activeCollections: Object.keys(mongoose.connection.collections || {}),
  };
}
