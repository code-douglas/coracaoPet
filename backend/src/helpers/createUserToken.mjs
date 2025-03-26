import jwt from 'jsonwebtoken';  // Import the jsonwebtoken library to handle token creation

// Function to create and send a user authentication token
const createUserToken = async (req, res, user) => {
  // Generate a JWT token using the user's information and a secret key
  // `jwt.sign()` takes two parameters:
  // 1. Payload - The data that will be embedded in the token (in this case, user name and id).
  // 2. Secret key - A string that will be used to sign and verify the token (in this case, 'oursecret').
  const token = jwt.sign({
    name: user.name,   // User's name (included in the token payload)
    id: user._id       // User's unique ID (included in the token payload)
  }, 'oursecret');     // 'oursecret' is the secret key for signing the token

  // Send a response to the client with:
  // 1. A status code of 200, indicating the request was successful.
  // 2. A message indicating the user is authenticated.
  // 3. The generated JWT token for future authentication.
  // 4. The user's ID to help with subsequent requests.
  res.status(200).json({
    message: 'Você está autenticado',  // Success message indicating the user is authenticated
    token: token,                     // The generated JWT token
    userId: user._id                 // The user's ID (this can be useful on the client side)
  });
};

export default createUserToken;  // Export the function to make it available for other modules
