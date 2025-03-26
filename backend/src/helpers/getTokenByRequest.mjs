// Function to extract the token from the request headers
function getTokenByRequest(req) {
  // Retrieve the 'authorization' header from the request headers
  const authHeader = req.headers?.authorization;

  // If there's no 'authorization' header, return null (meaning no token)
  if (!authHeader) return null;

  // Split the 'authorization' header by space to separate the 'Bearer' part and the token itself
  const tokenParts = authHeader.split(' ');

  // If the header has more than one part, the second part should be the token (usually prefixed with 'Bearer')
  // Otherwise, return null if no valid token is found
  const token = tokenParts.length > 1 ? tokenParts[tokenParts.length - 1] : null;

  // Return the token (or null if no valid token was found)
  return token;
}

// Export the function so it can be used in other files
export default getTokenByRequest;
