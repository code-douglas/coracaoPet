import { isValidObjectId } from 'mongoose';
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

  static async getAllPets(req, res) {
    try {
      const allPets = await Pet.find().sort('-createdAt');

      if(allPets.length == 0) {
        res.status(400).json({
          message: 'Sem pets cadastrados no momento'
        });
        return;
      }

      return res.status(200).json({
        pets: allPets
      });
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possivel resgatar dados no banco de dados, tente novamente.', error
      });
    }
  }

  static async getAllUserPet(req, res) {
    const token = getTokenByRequest(req);
    const user =  await getUserByJwtToken(token);

    try {
      const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');

      if(pets.length == 0) {
        res.status(400).json({
          message: 'Você não possui pets cadastrados.',
        });

        return;
      }

      res.status(200).json({
        pets,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possivel resgatar dados no banco de dados, tente novamente.', error
      });
    }
  }

  static async getAllUserAdoptions(req, res) {

    const token = getTokenByRequest(req);
    const user =  await getUserByJwtToken(token);

    try {
      const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');

      if(pets.length == 0) {
        res.status(400).json({
          message: 'Você não possui pets adotados.',
        });

        return;
      }

      res.status(200).json({
        pets,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possivel resgatar dados no banco de dados, tente novamente.', error
      });
    }

  }

  static async getPetById(req, res) {
    const id = req.params.id;

    if(!isValidObjectId(id)) {
      res.status(422).json({
        message: 'ID invalido.'
      });
      return;
    }

    try {
      const pet = await Pet.findOne({ _id: id });

      if(!pet) {
        res.status(422).json({
          message: 'Pet não encontrado.'
        });
        return;
      }

      res.status(200).json({
        pet: pet
      });
    } catch(error) {
      res.status(422).json({
        message: 'Algo deu errado, tente novamente mais tarde.',
        error
      });
    }
  }

  static async removePetById(req, res) {
    const token = getTokenByRequest(req);
    const user =  await getUserByJwtToken(token);
    const id = req.params.id;
    const pet = await Pet.findOne({ _id: id });

    if(!isValidObjectId(id)) {
      res.status(422).json({
        message: 'ID invalido.'
      });
      return;
    }

    if(!pet) {
      res.status(422).json({
        message: 'Pet não encontrado.'
      });
      return;
    }

    if(pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: 'Houve um problema ao processar a sua requisição, tente novamente mais tarde.!' });
    }

    await Pet.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Pet removido com sucesso.'
    });
  }
}

export default PetController;
