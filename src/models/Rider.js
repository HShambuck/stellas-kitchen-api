import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Rider' },
  vehicleRegistration: { type: String, required: false },
  scheduleStatus: { 
    type: String, 
    required: true, 
    enum: ['Offline', 'Available', 'On Delivery Run'],
    default: 'Offline' 
  }
}, { timestamps: true });

// Pre-save middleware to automatically hash passwords before saving
riderSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

riderSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Rider = mongoose.model('Rider', riderSchema);
export default Rider;