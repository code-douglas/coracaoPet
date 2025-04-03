import express from 'express';
import PetController from '../controllers/PetController.mjs';
import imageUpload from '../helpers/imagemUpload.mjs';

const router = express.Router();

router.post('/create', PetController.create);

export default router;
