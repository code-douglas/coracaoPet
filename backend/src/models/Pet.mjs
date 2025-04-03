import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import connection from '../../db/connection.mjs';

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
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    available: {
      type: Boolean,
    },
    user: {
      type: Object,
    },
    adopter: {
      type: Object,
    },
  }, {
    timestamps: true
  })
);

export default Pet;
