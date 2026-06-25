import User from '../models/User.js';
import Rider from '../models/Rider.js';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new Staff/Manager account
// @route   POST /api/auth/staff/register
export const registerStaff = async (req, res) => {
  const { name, phoneNumber, password, role } = req.body;
  try {
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, phoneNumber, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth Staff & get token
// @route   POST /api/auth/staff/login
export const loginStaff = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid phoneNumber or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new Rider account
// @route   POST /api/auth/rider/register
// Inside your controller file, apply .trim() uniformly across methods:

// Inside your controller file, apply .trim() uniformly across methods:

export const registerRider = async (req, res) => {
  const { name, phoneNumber, password, vehicleRegistration } = req.body;
  try {
    const cleanPhone = phoneNumber.trim(); // 💡 Standardized string lookup
    const riderExists = await Rider.findOne({ phoneNumber: cleanPhone });
    if (riderExists) return res.status(400).json({ message: 'Rider already registered' });

    const rider = await Rider.create({ 
      name, 
      phoneNumber: cleanPhone, 
      password, 
      role: 'Rider', // Saved clearly
      vehicleRegistration 
    });
    
    res.status(201).json({
      _id: rider._id,
      name: rider.name,
      phoneNumber: rider.phoneNumber,
      role: rider.role,
      vehicleRegistration: rider.vehicleRegistration,
      scheduleStatus: rider.scheduleStatus,
      token: generateToken(rider._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginRider = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const cleanPhone = phoneNumber.trim(); // 💡 Standardized string lookup
    const rider = await Rider.findOne({ phoneNumber: cleanPhone });
    
    if (rider && (await rider.matchPassword(password))) {
      res.json({
        _id: rider._id,
        name: rider.name,
        phoneNumber: rider.phoneNumber,
        role: rider.role, // Reads directly from DB now
        vehicleRegistration: rider.vehicleRegistration,
        scheduleStatus: rider.scheduleStatus,
        token: generateToken(rider._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};