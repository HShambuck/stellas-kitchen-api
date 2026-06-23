import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Main Course', 'Sides', 'Drinks', 'Desserts'] },
  isAvailable: { type: Boolean, required: true, default: true }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);
export default Menu;