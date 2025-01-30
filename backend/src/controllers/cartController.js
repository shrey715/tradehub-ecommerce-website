import Cart from "../models/Cart.js";
import Item from "../models/Item.js";
import User from "../models/User.js"

// route for adding item to cart
const addToCart = async (req, res) => {
  console.log('Adding item to cart:', req.body.item_id);
  try {
    const itemID = req.body.item_id;
    const userID = req.userID;
    const quantity = req.body.quantity;

    const cart = await Cart.findOne({ user_id: userID });

    if (!cart) {
      const newCart = await Cart.create({
        user_id: userID,
        items: [{ item_id: itemID, quantity: quantity }]
      });
      res.status(200).json({ success: true, cart: newCart });
      return;
    }

    const itemIndex = cart.items.findIndex(item => item.item_id.toString() === itemID);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ item_id: itemID, quantity: quantity });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//route for removing item from cart
const removeFromCart = async (req, res) => {
  console.log('Removing item from cart:', req.params.item_id);
  try {
    const itemID = req.params.item_id;
    const userID = req.userID;

    const cart = await Cart.findOneAndUpdate(
      { user_id: userID },
      { $pull: { items: { item_id: itemID } } },
      { new: true }
    );

    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//route for clearing cart
const clearCart = async (req, res) => {
  console.log('Clearing cart');
  try {
    const userID = req.userID;

    const cart = await Cart.findOneAndDelete({ user_id: userID });
    
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//route for getting cart
const getCart = async (req, res) => {
  console.log('Getting cart');
  try {
    const userID = req.userID;

    const cart = await Cart.findOne({ user_id: userID });

    if (!cart || cart.items.length === 0) {
      res.status(200).json({ success: true, cart: { items: [] } });
      return;
    }

    const cartItems = cart.items;
    const items = await Promise.all(cartItems.map(async (item) => {
      const itemDetails = await Item.findById(item.item_id);
      const sellerDetails = await User.findById(itemDetails.seller_id);
      return {
        _id: item.item_id,
        name: itemDetails.name,
        price: itemDetails.price,
        image: itemDetails.image,
        quantity: item.quantity,
        seller_id: itemDetails.seller_id,
        seller_name: `${sellerDetails.fname} ${sellerDetails.lname}`,
        category: itemDetails.category
      };
    }));

    res.status(200).json({ success: true, cart: { items } });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//route to return number of cart items
const getCartCount = async (req, res) => {
  console.log('Getting cart count');
  try {
    const userID = req.userID;

    const cart = await Cart.findOne({ user_id: userID });

    if (!cart || cart.items.length === 0) {
      res.status(200).json({ success: true, count: 0 });
      return;
    }

    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export { addToCart, removeFromCart, clearCart, getCart, getCartCount };