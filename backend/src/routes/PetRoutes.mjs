import express from 'express';
import PetController from '../controllers/PetController.mjs';
import imageUpload from '../helpers/imageUpload.mjs';
import checkUserToken from '../middlewares/checkUserToken.mjs';

const router = express.Router();

router.get('/', PetController.getAllPets);
router.get('/mypets', checkUserToken, PetController.getAllUserPet);
router.get('/myadoptions', checkUserToken, PetController.getAllUserAdoptions);
router.post('/create', checkUserToken, imageUpload.array('images'), PetController.create);

export default router;
