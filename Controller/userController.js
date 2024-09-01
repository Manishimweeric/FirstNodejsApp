import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const jwtSecret = process.env.JWT_SECRET; 

// Exporting functions as named exports
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input data
  if (!email || !password) {
    return res.status(400).json({ error: '"email" and "password" are required' });
  }
  
  try {
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;  
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });

    res.json({ token: `Bearer ${token}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
