import express from 'express';
import userController from '../controllers/UserController.mjs';
const router = express.Router();

// Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/checkuser', userController.checkUserByToken);
router.get('/:id', userController.getUserById);

export default router;
