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

    contract.isRequired(name, 'O campo nome é obrigatório.');
    contract.isRequired(images, 'A imagem é obrigatória.');
    contract.hasMinLen(name, 3, 'O campo nome deve conter no mínimo 3 caracteres.');
    contract.isRequired(age, 'O campo idade é obrigatório.');
    contract.isRequired(weight, 'O campo peso é obrigatório.');
    contract.isRequired(color, 'O campo cor é obrigatório.');

    if (!contract.isValid()) {
      return res.status(400).json({ errors: contract.errors });
    }

    const token = getTokenByRequest(req);
    const user = await getUserByJwtToken(token);

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
      res.status(503).json({ message: 'Erro ao cadastrar pet, tente novamente.', error });
    }
  }

  static async getAllPets(req, res) {
    try {
      const allPets = await Pet.find().sort('-createdAt');

      if (allPets.length === 0) {
        return res.status(204).send();
      }

      return res.status(200).json({ pets: allPets });
    } catch (error) {
      return res.status(503).json({
        message: 'Não foi possível resgatar dados no banco de dados, tente novamente.',
        error
      });
    }
  }

  static async getAllUserPet(req, res) {
    const token = getTokenByRequest(req);
    const user = await getUserByJwtToken(token);

    try {
      const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');

      if (pets.length === 0) {
        return res.status(204).send();
      }

      res.status(200).json({ pets });
    } catch (error) {
      res.status(503).json({
        message: 'Não foi possível resgatar dados no banco de dados, tente novamente.',
        error
      });
    }
  }

  static async getAllUserAdoptions(req, res) {
    const token = getTokenByRequest(req);
    const user = await getUserByJwtToken(token);

    try {
      const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');

      if (pets.length === 0) {
        return res.status(204).send();
      }

      res.status(200).json({ pets });
    } catch (error) {
      res.status(503).json({
        message: 'Não foi possível resgatar dados no banco de dados, tente novamente.',
        error
      });
    }
  }

  static async getPetById(req, res) {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    try {
      const pet = await Pet.findOne({ _id: id });

      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
      }

      res.status(200).json({ pet });
    } catch (error) {
      res.status(503).json({
        message: 'Algo deu errado, tente novamente mais tarde.',
        error
      });
    }
  }

  static async removePetById(req, res) {
    const token = getTokenByRequest(req);
    const user = await getUserByJwtToken(token);
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    if (pet.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: 'Você não tem permissão para excluir este pet.'
      });
    }

    try {
      await Pet.findByIdAndDelete(id);
      res.status(200).json({ message: 'Pet removido com sucesso.' });
    } catch (error) {
      res.status(503).json({
        message: 'Ocorreu um erro, tente mais tarde.',
        error
      });
    }
  }

  static async updatePet(req, res) {
    const id = req.params.id;
    const { name, age, weight, color } = req.body;
    const images = req.files;
    const updatedData = {};

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    const token = getTokenByRequest(req);
    const user = await getUserByJwtToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: 'Você não tem permissão para atualizar este pet.'
      });
    }

    let contract = new ValidationContract();

    contract.isRequired(name, 'O campo nome é obrigatório.');
    contract.hasMinLen(name, 3, 'O campo nome, deve conter no minimo 3 caracteres.');
    contract.isRequired(age, 'O campo idade é obrigatório.');
    contract.isRequired(weight, 'O campo peso é obrigatório.');
    contract.isRequired(color, 'O campo cor é obrigatório.');
    contract.isRequired(images, 'A imagem é obrigatória.');

    if (!contract.isValid()) {
      return res.status(400).json({ errors: contract.errors });
    }

    updatedData.name = name;
    updatedData.age = age;
    updatedData.weight = weight;
    updatedData.color = color;
    updatedData.images = [];
    images.map((image) => {
      updatedData.images.push(image.filename);
    });

    try {
      await Pet.findByIdAndUpdate(id, updatedData);
      res.status(200).json({ message: 'Pet atualizado com sucesso.' });
    } catch (error) {
      res.status(503).json({
        message: 'Ocorreu um erro ao processar sua solicitação, tente novamente mais tarde.',
        error
      });
    }
  }
}

export default PetController;
