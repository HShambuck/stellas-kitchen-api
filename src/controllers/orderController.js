import Order from '../models/Order.js';

// @desc    Get all orders for the centralized kitchen dashboard
// @route   GET /api/orders
// @access  Protected (Staff/Manager only)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('assignedRider', 'name phoneNumber vehicleRegistration')
      .sort({ createdAt: -1 }); // Newest orders first
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ingest order from Customer Web App (QR code scan)
// @route   POST /api/orders/web/qr
// @access  Public
export const createWebQROrder = async (req, res) => {
  const { phoneNumber, tableNumber, items, totalAmount } = req.body;
  try {
    const newOrder = await Order.create({
      phoneNumber,
      tableNumber,
      items,
      totalAmount,
      channelSource: 'QR'
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Ingest order from Customer Web App (Shareable Link)
// @route   POST /api/orders/web/link
// @access  Public
export const createWebLinkOrder = async (req, res) => {
  const { customerName, phoneNumber, deliveryAddress, items, totalAmount } = req.body;
  try {
    const newOrder = await Order.create({
      customerName,
      phoneNumber,
      deliveryAddress,
      items,
      totalAmount,
      channelSource: 'Link'
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a manual phone/walk-in order via Staff App
// @route   POST /api/orders/manual
// @access  Protected (Staff/Manager only)
export const createManualOrder = async (req, res) => {
  const { customerName, phoneNumber, deliveryAddress, items, totalAmount } = req.body;
  try {
    const newOrder = await Order.create({
      customerName,
      phoneNumber,
      deliveryAddress,
      items,
      totalAmount,
      channelSource: 'Manual'
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order lifecycle status state
// @route   PATCH /api/orders/:id/status
// @access  Protected (Staff/Rider)
export const updateOrderStatus = async (req, res) => {
  const { statusState } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.statusState = statusState;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders waiting for a rider to accept
// @route   GET /api/orders/available-deliveries
// @access  Protected (Rider only)
export const getAvailableDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      statusState: 'Ready for Dispatch',
      assignedRider: null  // Crucial: Ensures another rider hasn't claimed it
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rider accepts a delivery from the available pool
// @route   POST /api/orders/:id/accept
// @access  Protected (Rider only)
export const acceptDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.assignedRider) return res.status(400).json({ message: 'Order already claimed by another rider' });

    // Tie the rider to the order record (req.rider._id from auth middleware)
    order.assignedRider = req.rider._id;
    
    // 💡 Changed to 'Out for Delivery' so it clears instantly from the kitchen dashboard list
    order.statusState = 'Out for Delivery'; 

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};