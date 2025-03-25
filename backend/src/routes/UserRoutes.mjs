import express from 'express';
import userController from '../controllers/UserController.mjs';
const router = express.Router();

// Routes
router.post('/register', userController.register);

export default router;
