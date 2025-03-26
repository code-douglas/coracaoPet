import mongoose from 'mongoose';   // Import mongoose to interact with MongoDB
import { Schema } from 'mongoose';  // Import Schema from mongoose to define the structure of the MongoDB document
import connection from '../../db/connection.mjs';  // Import the database connection setup (assuming it's configured in this file)

// Define the 'User' model using mongoose
const User = mongoose.model(
  'User',  // The name of the model (used to refer to the 'users' collection in MongoDB)
  new Schema({  // Create a new Schema defining the structure of the 'User' document
    name: {
      type: String,  // 'name' is a string field
      required: true,  // 'name' is required when creating a user
    },
    email: {
      type: String,  // 'email' is a string field
      required: true,  // 'email' is required when creating a user
    },
    password: {
      type: String,  // 'password' is a string field
      required: true,  // 'password' is required when creating a user
    },
    image: {
      type: String,  // 'image' is an optional string field (likely to store a URL or file path for the user's profile image)
    },
    phone: {
      type: String,  // 'phone' is a string field
      required: true,  // 'phone' is required when creating a user
    }
  }, {
    timestamps: true  // Automatically create 'createdAt' and 'updatedAt' fields for the user document
  })
);

// Export the 'User' model to make it available for other parts of the application
export default User;
