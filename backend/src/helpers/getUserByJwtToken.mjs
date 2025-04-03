import 'dotenv/config';
import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';

async function getUserByJwtToken(token) {
  if (!token) return null;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findOne({ _id: verified.id });
  } catch (error) {
    return null;
  }
}

export default getUserByJwtToken;
