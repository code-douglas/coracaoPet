import 'dotenv/config';
import mongoose from 'mongoose';

async function connection() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Connect database..');
  } catch (error) {
    console.log(error);
  }
}

try {
  connection();
} catch (error) {
  console.log(error);
}

export default mongoose;
