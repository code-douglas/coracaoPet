import 'dotenv/config';
import jwt from 'jsonwebtoken';

const createUserToken = async (req, res, user) => {
  const token = jwt.sign(
    { name: user.name, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    message: 'Você está autenticado',
    token,
    userId: user._id
  });
};

export default createUserToken;
