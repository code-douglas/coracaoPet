import express from 'express';  // Import Express to create the application and handle HTTP requests
import cors from 'cors';  // Import CORS middleware to handle cross-origin resource sharing
import UserRoutes from './routes/UserRoutes.mjs';  // Import the routes for user-related functionality

const app = express();  // Initialize the Express application

// Middleware to parse incoming JSON requests and send back JSON responses
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
// This configuration allows requests from 'http://localhost:3000' (front-end) to access the API (back-end).
// 'credentials: true' allows cookies or other credentials to be included in cross-origin requests.
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Serve static files from the 'public' folder
// This is useful for serving images, styles, or other assets publicly.
app.use(express.static('public'));

// Routes
// Use the UserRoutes for any requests starting with '/users'
// All user-related API endpoints will be handled by UserRoutes (e.g., /users/register, /users/login)
app.use('/users', UserRoutes);

// Start the server and listen on port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
