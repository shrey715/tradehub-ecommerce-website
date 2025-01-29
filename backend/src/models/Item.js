import mongoose from "mongoose";
import Cart from "./Cart.js";

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
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
});

ItemSchema.pre('remove', async function(next) {
  try {
    await Cart.updateMany(
      {},
      { $pull: { items: { item_id: this._id } } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

const Item = mongoose.model('Item', ItemSchema) || mongoose.models.Item;

export default Item;