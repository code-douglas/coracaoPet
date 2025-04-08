import express from 'express';
import userController from '../controllers/UserController.mjs';
import checkUserToken from '../middlewares/checkUserToken.mjs';
import imageUpload from '../helpers/imageUpload.mjs';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/checkuser', userController.checkUserByToken);
router.get('/:id', userController.getUserById);
router.patch('/edit/:id', checkUserToken, imageUpload.single('image'), userController.editUser);

export default router;
