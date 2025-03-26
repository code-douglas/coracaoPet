function getTokenByRequest(req) {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return null;

  const tokenParts = authHeader.split(' ');
  const token = tokenParts.length > 1 ? tokenParts[tokenParts.length - 1] : null;

  return token;
}

export default getTokenByRequest;
