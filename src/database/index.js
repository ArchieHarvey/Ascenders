import mongoose from 'mongoose';

let isConnecting = false;

export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('Missing MONGO_URI in environment. Add it to your .env file.');
    process.exit(1);
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    await mongoose.connect(uri, {
      autoCreate: true,
    });
    console.log('Connected to MongoDB.');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  } finally {
    isConnecting = false;
  }
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
};
