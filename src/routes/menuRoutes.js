import express from 'express';
import Menu from '../models/Menu.js';

const router = express.Router();

// @desc    Fetch available menu items for both Web and Mobile apps
// @route   GET /api/menu
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Menu.find({ isAvailable: true });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;