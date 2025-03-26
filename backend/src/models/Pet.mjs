import mongoose from 'mongoose';   // Import mongoose to interact with MongoDB
import { Schema } from 'mongoose';  // Import Schema to define the structure of the MongoDB document
import connection from '../../db/connection.mjs';  // Import the database connection

// Define the 'Pet' model using mongoose
const Pet = mongoose.model(
  'Pet',  // The name of the model
  new Schema({  // Create a new Schema defining the structure of the 'Pet' document
    name: {
      type: String,  // 'name' is a string type
      required: true,  // 'name' is required to be filled when creating a pet
    },
    age: {
      type: Number,  // 'age' is a number type
      required: true,  // 'age' is required when creating a pet
    },
    weight: {
      type: Number,  // 'weight' is a number type
      required: true  // 'weight' is required when creating a pet
    },
    color: {
      type: String,  // 'color' is a string type
      required: true  // 'color' is required when creating a pet
    },
    images: {
      type: Array,  // 'images' is an array type, which could store multiple image URLs or file references
      required: true  // 'images' is required when creating a pet
    },
    available: {
      type: Boolean,  // 'available' is a boolean type to check if the pet is available for adoption
    },
    user: {
      type: Object,  // 'user' is an object type (likely to store information about the pet's owner or creator)
    },
    adopter: {
      type: Object,  // 'adopter' is an object type (likely to store information about the person who adopted the pet)
    },
  }, {
    timestamps: true  // Enable automatic creation of 'createdAt' and 'updatedAt' fields for the document
  })
);

// Export the 'Pet' model for use in other parts of the application
export default Pet;
