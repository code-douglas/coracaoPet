import jwt from 'jsonwebtoken';
import getTokenByRequest from '../helpers/getTokenByRequest.mjs';

function checkUserToken(req, res, next) {

  if(!req.headers.authorization) return res.status(401).json({ message: 'Acesso negado.' });

  const token = getTokenByRequest(req);

  if(!token) return res.status(401).json({ message: 'Acesso negado.' });

  try {
    const verified = jwt.verify(token, 'oursecret');
    req.user = verified;

    next();
  } catch(error) {
    return res.status(400).json({
      message: 'Token invalido.',
      error,
    });
  }
}

export default checkUserToken;
