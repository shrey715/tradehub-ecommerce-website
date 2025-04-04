import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { CiTrash, CiShoppingCart } from "react-icons/ci";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import useCartNumberStore from "../../../hooks/CartNumberStore";

import axiosInstance from "../../../lib/api";

const CartItem = ({ item, onRemove }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <Link 
          to={`/item/${item._id}`} 
          className="text-base font-medium text-zinc-900 dark:text-zinc-50 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors line-clamp-1"
        >
          {item.name}
        </Link>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Sold by {item.seller_name}</p>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm font-medium">Qty: {item.quantity}</p>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">₹{item.price}</p>
        </div>
      </div>
      
      <button 
        onClick={() => onRemove(item._id)}
        className="p-2 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        aria-label="Remove item"
      >
        <CiTrash className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    seller_name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <CiShoppingCart className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-2">Your cart is empty</h2>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">Looks like you haven&apos;t added any items to your cart yet</p>
      <Link 
        to="/item/all" 
        className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
      >
        Browse Items
      </Link>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { setCartNumber } = useCartNumberStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCart = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/cart/get-cart`);

        if (res.data.success) {
          setCart(res.data.cart.items);
        } else {
          toast.error("Error: " + res.data.message);
        }
      } catch (error) {
        console.error("Error getting cart:", error.message);
        toast.error("Internal server error");
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, []);

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotal(total);
  }, [cart]);

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await axiosInstance.patch(`/api/cart/remove-from-cart/${itemId}`);

      if (res.data.success) {
        setCart(cart.filter(item => item._id !== itemId));
        setCartNumber(prevCount => prevCount - 1);
        toast.success("Item removed from cart");
      } else {
        toast.error("Error: " + res.data.message);
      }
    } catch (error) {
      console.error("Error removing item:", error.message);
      toast.error("Internal server error");
    }
  };

  const handleCheckout = async () => {
    try {
      const orders = cart.map(item => ({
        item_id: item._id,
        quantity: item.quantity,
        amount: item.price * item.quantity
      }));

      const res = await axiosInstance.post(`/api/orders/place-order`, { orders });

      if (res.data.success) {
        // Clear cart
        await axiosInstance.delete(`/api/cart/clear-cart`);
        setCartNumber(0);
        toast.success("Order placed successfully");
        navigate('/orders');
      } else {
        toast.error("Error: " + res.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      toast.error("Internal server error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-8"
    >
      <Helmet>
        <title>Shopping Cart | TradeHub</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-50">Shopping Cart</h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {cart.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="sticky top-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-5 space-y-5">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Items ({cart.length})</span>
                    <span className="text-zinc-900 dark:text-zinc-50">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Shipping</span>
                    <span className="text-zinc-900 dark:text-zinc-50">Free</span>
                  </div>
                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Total</span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">₹{total}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-400 text-white rounded-md transition-colors"
                >
                  Place Order
                </button>
                
                <Link
                  to="/item/all"
                  className="block w-full text-center py-2 text-sm text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;