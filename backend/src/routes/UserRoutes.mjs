import express from 'express';  // Import Express to create a router and handle HTTP requests
import userController from '../controllers/UserController.mjs';  // Import the UserController that handles business logic for user routes
import checkUserToken from '../middlewares/checkUserToken.mjs';  // Import middleware to check if the user is authenticated via token
import imagemUpload from '../helpers/imagemUpload.mjs'; // Import Helper for upload image in db.

// Create a new router instance using Express
const router = express.Router();

// Routes

// Register a new user
router.post('/register', userController.register);
// POST request to '/register' will trigger the 'register' function in the UserController

// Login an existing user
router.post('/login', userController.login);
// POST request to '/login' will trigger the 'login' function in the UserController

// Check if the user is authenticated based on the token
router.get('/checkuser', userController.checkUserByToken);
// GET request to '/checkuser' will trigger the 'checkUserByToken' function in the UserController

// Get user details by ID
router.get('/:id', userController.getUserById);
// GET request to '/:id' will retrieve user details using the 'getUserById' function in the UserController. The ':id' is a dynamic parameter.

// Edit user information (only authenticated users)
router.patch('/edit/:id', checkUserToken, imagemUpload.single('image'), userController.editUser);
// PATCH request to '/edit/:id' will trigger the 'editUser' function in the UserController. The 'checkUserToken' middleware ensures that the request is authenticated before proceeding.

export default router;
