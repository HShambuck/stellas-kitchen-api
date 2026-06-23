import Rider from '../models/Rider.js';
import Order from '../models/Order.js';

// @desc    Get all active/idle riders for staff assignment selection
// @route   GET /api/riders/available
// @access  Protected (Staff/Manager only)
export const getAvailableRiders = async (req, res) => {
  try {
    const activeRiders = await Rider.find({ scheduleStatus: 'Active/Idle' }).select('-password');
    res.status(200).json(activeRiders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Allow rider to toggle their active shift/availability status
// @route   PATCH /api/riders/status
// @access  Protected (Rider only)
export const updateRiderStatus = async (req, res) => {
  const { scheduleStatus } = req.body;
  try {
    // req.rider is populated by the auth middleware
    const rider = await Rider.findById(req.rider._id);
    if (!rider) return res.status(404).json({ message: 'Rider profile not found' });

    rider.scheduleStatus = scheduleStatus;
    const updatedRider = await rider.save();

    res.status(200).json({
      _id: updatedRider._id,
      name: updatedRider.name,
      scheduleStatus: updatedRider.scheduleStatus
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetch active, undelivered jobs assigned to the logged-in rider
// @route   GET /api/riders/my-deliveries
// @access  Protected (Rider only)
export const getMyDeliveries = async (req, res) => {
  try {
    const jobs = await Order.find({ 
      assignedRider: req.rider._id, 
      statusState: { $ne: 'Delivered' } 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};