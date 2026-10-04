import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.log('MONGODB_URI not set. Running with in-memory demo storage.');
    return false;
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
  return true;
}
