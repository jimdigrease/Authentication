import { MongoClient } from 'mongodb';

export async function connectDB() {
  const client = await MongoClient.connect(
    'mongodb+srv://Jim:KcvBDULNAKM0gZSO@cluster0.jrvsz.mongodb.net/auth-next?retryWrites=true&w=majority'
  );
  return client;
}
