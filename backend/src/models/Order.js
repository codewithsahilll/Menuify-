import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
  menuItemId: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  quantity: Number
}, { _id: false });
const schema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  items: [itemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['PLACED','ACCEPTED','PREPARING','READY','REJECTED','COLLECTED'], default: 'PLACED' }
}, { timestamps: true });
export default mongoose.model('Order', schema);
