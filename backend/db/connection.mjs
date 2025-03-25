import 'dotenv/config';
import mongoose from 'mongoose';

async function main () {
  try {
    mongoose.connection(process.env.MONGO_DB_URL);
    console.log('Connect database..');
  } catch (error) {
    console.log(error);
  }
}

export default main;
