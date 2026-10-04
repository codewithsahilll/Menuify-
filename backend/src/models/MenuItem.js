import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Main Course' },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' },
  available: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('MenuItem', schema);
