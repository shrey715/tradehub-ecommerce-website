import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: [String],
    required: true
  },
  image: {
    type: mongoose.Schema.Types.Buffer,
    required: true
  },
});

const Item = mongoose.model('Item', ItemSchema) || mongoose.models.Item;

export default Item;