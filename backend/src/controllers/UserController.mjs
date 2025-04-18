import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import createUserToken from '../helpers/createUserToken.mjs';
import ValidationContract from '../helpers/validateUser.mjs';
import getTokenByRequest from '../helpers/getTokenByRequest.mjs';

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

    if (password !== confirmPassword) {
      contract.errors.push({ message: 'As senhas precisam ser iguais.' });
    }

    if (!contract.isValid()) {
      return res.status(400).json({ errors: contract.errors });
    }

    const checkUserExist = await User.findOne({ email });
    if (checkUserExist) {
      return res.status(409).json({ message: 'Usuário já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, phone, password: passwordHash });

    try {
      const newUser = await user.save();
      await createUserToken(req, res, newUser);
    } catch (error) {
      res.status(503).json({ message: 'Erro ao criar usuário, tente novamente.', error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    let contract = new ValidationContract();

    contract.isRequired(email, 'O campo email é obrigatório.');
    contract.isRequired(password, 'O campo senha é obrigatória.');

    if (!contract.isValid()) {
      return res.status(400).json({ errors: contract.errors });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não cadastrado.' });
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({ message: 'Verifique suas informações e tente novamente.' });
      }

      await createUserToken(req, res, user);
    } catch (error) {
      res.status(503).json({ message: 'Erro ao realizar login, tente novamente.', error });
    }
  }

  static async checkUserByToken(req, res) {
    try {
      const token = getTokenByRequest(req);
      if (!token) return res.status(401).json({ message: 'Acesso negado.' });

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id).select('-password');

      if (!currentUser) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      return res.status(200).json(currentUser);
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(503).json({ message: 'Erro ao buscar usuário, tente novamente.', error });
    }
  }

  static async editUser(req, res) {
    const { id } = req.params;
    const user = req.user;

    if (user.id !== id) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este usuário.' });
    }

    const { name, email, phone, password, confirmPassword } = req.body;
    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (req.file) {
      userToUpdate.image = req.file.filename;
    }

    let contract = new ValidationContract();
    contract.isRequired(name, 'O campo nome é obrigatório.');
    contract.isRequired(email, 'O campo email é obrigatório.');
    contract.isEmail(email, 'O email informado é inválido.');

    userToUpdate.name = name;
    userToUpdate.email = email;
    userToUpdate.phone = phone;

    if (password) {
      contract.hasMinLen(password, 6, 'A senha deve ter no mínimo 6 caracteres.');
      contract.isRequired(confirmPassword, 'A confirmação de senha é obrigatória.');
      if (password !== confirmPassword) {
        contract.errors.push({ message: 'As senhas precisam ser iguais.' });
      }
      const salt = await bcrypt.genSalt(12);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }

    if (!contract.isValid()) {
      return res.status(400).json({ errors: contract.errors });
    }

    try {
      await userToUpdate.save();
      res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
    } catch (error) {
      res.status(503).json({ message: 'Erro ao atualizar usuário, tente novamente.', error });
    }
  }
}

export default UserController;
