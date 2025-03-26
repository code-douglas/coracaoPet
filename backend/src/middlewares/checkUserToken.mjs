import jwt from 'jsonwebtoken';   // Import the 'jsonwebtoken' library to handle token verification
import getTokenByRequest from '../helpers/getTokenByRequest.mjs';  // Import the helper function to extract the token from the request

// Middleware function to verify the user's authentication token
function checkUserToken(req, res, next) {
  // Check if the 'Authorization' header is present in the request headers
  if (!req.headers.authorization) {
    // If the 'Authorization' header is missing, return a 401 Unauthorized error
    return res.status(401).json({ message: 'Acesso negado.' });  // 'Access denied' message
  }

  // Retrieve the token from the request using the helper function
  const token = getTokenByRequest(req);

  // If the token is not found, return a 401 Unauthorized error
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado.' });  // 'Access denied' message
  }

  try {
    // Verify the token using the 'jsonwebtoken' library with the secret key ('oursecret')
    const verified = jwt.verify(token, 'oursecret');

    // If the token is valid, add the decoded token payload to the request object for further use
    req.user = verified;

    // Proceed to the next middleware or route handler
    next();

  } catch (error) {
    // If an error occurs during token verification (e.g., token is invalid or expired), return a 400 Bad Request error
    return res.status(400).json({
      message: 'Token invalido.',  // 'Invalid token' message
      error,  // Return the error object for debugging purposes
    });
  }
}

// Export the middleware function to use it in other parts of the application
export default checkUserToken;
