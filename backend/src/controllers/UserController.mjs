import User from '../models/User.mjs';

class UserController {
  static async register(req, res) {
    res.json('Olá, bem vindo ao Coração de Pet.');
  }
}

export default UserController;
