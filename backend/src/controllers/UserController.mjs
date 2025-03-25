import bcrypt from 'bcrypt';
import User from '../models/User.mjs';

class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Validations
    if(!name) return res.status(422).json({ message: 'O campo nome é obrigatório.' });
    if(!email) return res.status(422).json({ message: 'O campo email é obrigatório.' });
    if(!phone) return res.status(422).json({ message: 'O campo telefone é obrigatório.' });
    if(!password) return res.status(422).json({ message: 'O campo senha é obrigatório.' });
    if(!confirmPassword) return res.status(422).json({ message: 'A confirmação de senha é obrigatória.' });
    if(password !== confirmPassword) return res.status(422).json({ message: 'As senhas precisam ser iguais.' });

    const checkUserExist = await User.findOne({ email: email });

    if(checkUserExist) return res.status(422).json({ message: 'Usuário já cadastrado.' });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash
    });

    try {
      const newUser = await user.save();
      return res.status(201).json({
        message: 'Usuário criado com sucesso.',
        newUser,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao criar usuário, tente novamente.',
        error
      });
    }
  }
}

export default UserController;
