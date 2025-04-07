import express from 'express';
import PetController from '../controllers/PetController.mjs';
import imageUpload from '../helpers/imagemUpload.mjs';

// Middlewares

import checkUSerToken from '../middlewares/checkUserToken.mjs';

const router = express.Router();

router.post('/create', checkUSerToken, imageUpload.array('images'), PetController.create);

export default router;
