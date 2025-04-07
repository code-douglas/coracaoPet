import Pet from '../models/Pet.mjs';
import ValidationContract from '../helpers/validateUser.mjs';
import getTokenByRequest from '../helpers/getTokenByRequest.mjs';
import getUserByJwtToken from '../helpers/getUserByJwtToken.mjs';

class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const images = req.files;
    const available = true;
    let contract = new ValidationContract();

    // Validation
    contract.isRequired(name, 'O campo nome é obrigatório.');
    contract.isRequired(images, 'A imagem é obrigatório.');
    contract.hasMinLen(name, 3, 'O campo nome, deve conter no minimo 3 caracteres.');
    contract.isRequired(age, 'O campo idade é obrigatório.');
    contract.isRequired(weight, 'O campo peso é obrigatório.');
    contract.isRequired(color, 'O campo cor é obrigatório.');

    if (!contract.isValid()) {
      return res.status(422).json({ errors: contract.errors });
    }

    const token = getTokenByRequest(req);
    const user =  await getUserByJwtToken(token);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone
      }
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: 'Pet cadastrado com sucesso.', newPet });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cadastrar pet, tente novamente.', error });
    }
    //Images upload

  }
}

export default PetController;
