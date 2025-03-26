// Import dotenv to load environment variables from the .env file
import 'dotenv/config';
// Import mongoose to interact with MongoDB
import mongoose from 'mongoose';

// Asynchronous function to establish a connection with MongoDB
async function connection () {
  try {
    // Connect to MongoDB using the URL from the environment variable
    await mongoose.connect(process.env.MONGO_DB_URL);
    // If the connection is successful, log a success message
    console.log('Connect database..');
  } catch (error) {
    // If an error occurs while connecting, log the error
    console.log(error);
  }
}

// Try to connect to the database
try {
  connection();
} catch (error) {
  // If the connection fails, log the error
  console.log(error);
}

// Export mongoose to allow other parts of the application to interact with the database
export default mongoose;
