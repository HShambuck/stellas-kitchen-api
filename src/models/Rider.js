import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  vehicleRegistration: { type: String, required: true }, // e.g., Motorbike plate number
  scheduleStatus: { 
    type: String, 
    required: true, 
    enum: ['Offline', 'Active/Idle', 'On Delivery Run'], 
    default: 'Offline' 
  }
}, { timestamps: true });

riderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

riderSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Rider = mongoose.model('Rider', riderSchema);
export default Rider;