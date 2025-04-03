import Pet from '../models/Pet.mjs';

class PetController {
  static async create(req, res) {
    res.json({
      message: 'Olá'
    });
  }
}

export default PetController;
