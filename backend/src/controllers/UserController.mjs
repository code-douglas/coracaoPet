import bcrypt from 'bcrypt';
import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';
import createUserToken from '../helpers/createUserToken.mjs';
import ValidationContract from '../helpers/validateUser.mjs';
import getTokenByRequest from '../helpers/getTokenByRequest.mjs';

class UserController {
  static async register(req, res) {
    // Extracting user input from the request body
    const { name, email, phone, password, confirmPassword } = req.body;

    // Creating a validation contract to store validation errors
    let contract = new ValidationContract();

    // Validating required fields
    contract.isRequired(name, 'O campo nome é obrigatório.');
    contract.isRequired(email, 'O campo email é obrigatório.');

    // Validating if email format is correct
    contract.isEmail(email, 'O email informado é inválido.');

    // Validating required phone number
    contract.isRequired(phone, 'O campo telefone é obrigatório.');

    // Validating required password
    contract.isRequired(password, 'O campo senha é obrigatória.');

    // Checking if password meets the minimum length requirement
    contract.hasMinLen(password, 6, 'A senha deve ter no mínimo 6 caracteres.');

    // Checking if confirmPassword field is provided
    contract.isRequired(confirmPassword, 'A confirmação de senha é obrigatória.');

    // Checking if password and confirmPassword match
    if (password !== confirmPassword) {
      contract.errors.push({ message: 'As senhas precisam ser iguais.' });
    }

    // If validation fails, return errors with HTTP status 422 (Unprocessable Entity)
    if (!contract.isValid()) {
      return res.status(422).json({ errors: contract.errors });
    }

    // Checking if a user with the same email already exists in the database
    const checkUserExist = await User.findOne({ email: email });
    if (checkUserExist) {
      return res.status(422).json({ message: 'Usuário já cadastrado.' });
    }

    // Generating a salt for password hashing
    const salt = await bcrypt.genSalt(12);

    // Hashing the password before storing it in the database
    const passwordHash = await bcrypt.hash(password, salt);

    // Creating a new user instance with the provided data
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash  // Storing the hashed password for security
    });

    try {
      // Saving the new user to the database
      const newUser = await user.save();

      // Generating an authentication token for the newly created user
      await createUserToken(req, res, newUser);
    } catch (error) {
      // Handling any unexpected errors during user creation
      res.status(500).json({
        message: 'Erro ao criar usuário, tente novamente.',
        error
      });
    }
  }
  static async login(req, res) {
    // Extracting user input (email and password) from the request body
    const { email, password } = req.body;

    // Creating a validation contract to store validation errors
    let contract = new ValidationContract();

    // Validating if email and password fields are provided
    contract.isRequired(email, 'O campo email é obrigatório.');
    contract.isRequired(password, 'O campo senha é obrigatória.');

    // If validation fails, return errors with HTTP status 422 (Unprocessable Entity)
    if (!contract.isValid()) {
      return res.status(422).json({ errors: contract.errors });
    }

    try {
      // Searching for the user in the database using the provided email
      const user = await User.findOne({ email: email });

      // If user is not found, return an error
      if (!user) {
        return res.status(422).json({ message: 'Usuário não cadastrado.' });
      }

      // Comparing the provided password with the stored hashed password
      const checkPassword = await bcrypt.compare(password, user.password);

      // If passwords do not match, return an error message
      if (!checkPassword) {
        return res.status(422).json({ message: 'Verifique suas informações e tente novamente.' });
      }

      // If everything is correct, generate an authentication token for the user
      await createUserToken(req, res, user);

    } catch (error) {
      // Handling any unexpected errors
      res.status(500).json({
        message: 'Erro ao realizar login, tente novamente.',
        error
      });
    }
  }
  static async checkUserByToken(req, res) {
    // Variable to hold the current user based on the token
    let currentUser;

    // Check if an authorization header is present in the request
    if(req.headers.authorization) {
      try {
        // Extract the token from the request using a helper function
        const token = getTokenByRequest(req);

        // Verify the token using JWT and the secret key
        const decodedToken = jwt.verify(token, 'oursecret');

        // Find the user in the database by their ID from the decoded token
        currentUser  = await User.findById(decodedToken.id);

        // Ensure the password is not returned in the response
        currentUser.password = undefined;

      } catch (error) {
        // Log any errors that occur during token verification or user lookup
        console.log('Token inválido ou erro ao verificar usuário:', error);

        // Return a 401 Unauthorized status if the token is invalid or there is an error
        return res.status(401).send({ message: 'Token inválido ou erro ao verificar usuário.' });
      }
    }

    // If no token is provided, log and return a 200 OK with the user data (if any)
    console.log('Sem retorno.');

    // Send a response with the current user object or an empty response if no user is found
    return res.status(200).json(currentUser);
  }
  static async getUserById(req, res) {
    // Extract the user ID from request parameters
    const { id } = req.params;

    try {
      // Find the user in the database by ID, excluding the password field for security
      const user = await User.findById(id).select('-password');

      // Log the retrieved user data (useful for debugging)
      console.log(user);

      // If the user is not found, return a 404 status with an appropriate message
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Return the user data with a 200 status
      res.status(200).json({ user });

    } catch (error) {
      // Handle any errors, such as an invalid ID format or database connection issues
      console.error('Erro ao buscar usuário:', error);

      res.status(500).json({
        message: 'Erro ao buscar usuário, tente novamente.',
        error
      });
    }
  }
  static async editUser(req, res) {
    // Respond with a success message indicating that the user was updated
    res.status(200).json({
      message: 'Usuário atualizado com sucesso.'
    });

    // The return statement ensures no further code is executed after the response is sent
    return;
  }
}

export default UserController;
