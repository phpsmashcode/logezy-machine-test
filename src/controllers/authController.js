import { registerUser, loginUser } from '../services/authService.js';
import { handleValidation } from '../utils/validation.js';

export const register = [
  handleValidation,
  async (req, res) => {
    try {
      console.log('Register Request Body:', req.body);
      const { name, email, password, role = 'USER' } = req.body;  // Extract params
      const user = await registerUser({ name, email, password, role });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },
];

export const login = [
  handleValidation,
  async (req, res) => {
    try {
      const data = await loginUser(req.body);
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },
];
