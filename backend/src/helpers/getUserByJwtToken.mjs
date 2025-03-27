import User from '../models/User.mjs'; // Import User Model
import jwt from 'jsonwebtoken';  // Import the jsonwebtoken library to handle token creation

async function getUserByJwtToken (token) {

  // If the token is not found, return a 401 Unauthorized error
  console.log(token);
  if (!token) return null;

  const verified = jwt.verify(token, 'oursecret');
  console.log('Payload do token:', verified);

  const userId = verified.id;
  const user = await User.findOne({ _id: userId });

  return user;
}

export default getUserByJwtToken;
