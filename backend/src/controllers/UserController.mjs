import bcrypt from 'bcrypt';
import User from '../models/User.mjs';
import createUserToken from '../helpers/createUserToken.mjs';
import ValidationContract from '../helpers/validateUser.mjs';

class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body;
    let contract = new ValidationContract();

    contract.isRequired(name, 'O campo nome é obrigatório.');
    contract.isRequired(email, 'O campo email é obrigatório.');
    contract.isEmail(email, 'O email informado é inválido.');
    contract.isRequired(phone, 'O campo telefone é obrigatório.');
    contract.isRequired(password, 'O campo senha é obrigatória.');
    contract.hasMinLen(password, 6, 'A senha deve ter no mínimo 6 caracteres.');
    contract.isRequired(confirmPassword, 'A confirmação de senha é obrigatória.');
    if (password !== confirmPassword) contract.errors.push({ message: 'As senhas precisam ser iguais.' });

    if (!contract.isValid()) {
      return res.status(422).json({ errors: contract.errors });
    }

    const checkUserExist = await User.findOne({ email: email });
    if (checkUserExist) return res.status(422).json({ message: 'Usuário já cadastrado.' });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      password: passwordHash
    });

    try {
      const newUser = await user.save();
      await createUserToken(req, res, newUser);
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao criar usuário, tente novamente.',
        error
      });
    }
  }
  static async login(req, res) {
    const { email, password } = req.body;
    let contract = new ValidationContract();

    contract.isRequired(email, 'O campo email é obrigatório.');
    contract.isRequired(password, 'O campo senha é obrigatória.');

    const user = await User.findOne({ email: email });
    if (!user) return res.status(422).json({ message: 'Usuário não cadastrado.' });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(422).json({ message: 'Verifique suas informações e tente novamente.' });

    await createUserToken(req, res, user);

  }
}

export default UserController;
