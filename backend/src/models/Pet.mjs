import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import connection from '../db/connection.mjs';

const Pet = mongoose.model(
  'Pet',
  new Schema({
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      require: true
    },
    color: {
      type: String,
      require: true
    },
    images: {
      type: Array,
      require: true
    },
    available: {
      type: Boolean,
    },
    user: Object,
    adopter: Object,
  }, {
    timestamps: true
  })
);

export default Pet;
