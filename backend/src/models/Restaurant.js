import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  qrToken: { type: String, required: true, unique: true }
}, { timestamps: true });
export default mongoose.model('Restaurant', schema);
