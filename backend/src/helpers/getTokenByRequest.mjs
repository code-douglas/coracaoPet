function getTokenByRequest(req) {
  const authHeader = req.headers?.authorization;
  return authHeader?.split(' ')[1] || null;
}

export default getTokenByRequest;
