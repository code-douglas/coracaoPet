import jwt from 'jsonwebtoken';

const createUserToken = async(req, res, user) => {
  const token = jwt.sign({
    name: user.name,
    id: user._id
  }, 'oursecret');

  res.status(200).json({
    message: 'Você está autenticado',
    token: token,
    userId: user._id
  });

};

export default createUserToken;
