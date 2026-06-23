import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Rider from '../models/Rider.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's a Staff user or a Rider
      const staffUser = await User.findById(decoded.id).select('-password');
      const riderUser = await Rider.findById(decoded.id).select('-password');

      if (staffUser) {
        req.user = staffUser;
        req.userType = 'Staff';
      } else if (riderUser) {
        req.rider = riderUser;
        req.userType = 'Rider';
      } else {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Optional helper middleware to strictly enforce role access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Access is denied for your role' });
    }
  };
};