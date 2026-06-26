import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodItemName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: function() { return this.channelSource !== 'QR'; } 
  },
  phoneNumber: { type: String, default: "" },
  deliveryAddress: { 
    type: String, 
    required: function() { return this.channelSource === 'Link'; } 
  },
  tableNumber: { 
    type: String, 
    required: function() { return this.channelSource === 'QR'; } 
  },
  items: [orderItemSchema], 
  totalAmount: { type: Number, required: true },
  channelSource: { 
    type: String, 
    required: true, 
    enum: ['QR', 'Link', 'Manual'] 
  },
  statusState: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Preparing', 'Ready for Dispatch', 'Out for Delivery', 'Delivered'], 
    default: 'Pending' 
  },
  assignedRider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rider', 
    default: null 
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;