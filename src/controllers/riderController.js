import Rider from '../models/Rider.js';
import Order from '../models/Order.js';

// 💡 Removed getAvailableRiders to align completely with the Pull model logistics.

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

// @desc    Fetch active run AND today's completed jobs for the logged-in rider
// @route   GET /api/riders/my-deliveries
// @access  Protected (Rider only)
export const getMyDeliveries = async (req, res) => {
  try {
    // 💡 Finds any order assigned to this rider that isn't completely archived
    const jobs = await Order.find({ 
      assignedRider: req.rider._id,
      // Grabs everything currently 'Out for Delivery' or freshly 'Delivered'
      statusState: { $in: ['Out for Delivery', 'Delivered'] } 
    }).sort({ updatedAt: -1 }); // Newest transitions show up at the top
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};