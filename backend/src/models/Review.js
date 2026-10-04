import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  customerName: { type: String, default: 'Customer' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('Review', schema);
