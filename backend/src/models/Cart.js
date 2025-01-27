import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: {
    type: [{
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    required: true
  }
});

const Cart = mongoose.model('Cart', CartSchema) || mongoose.models.Cart;

export default Cart;