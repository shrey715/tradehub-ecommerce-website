import { Helmet } from "react-helmet";
import { motion } from "motion/react";
import { CiTrash } from "react-icons/ci";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import useCartNumberStore from "../../../hooks/CartNumberStore";

import axios from "axios";
import { backendUrl } from "../../../main";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { setCartNumber } = useCartNumberStore();

  useEffect(() => {
    const getCart = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const res = await axios.get(`${backendUrl}/api/cart/get-cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setCart(res.data.cart.items);
        } else {
          toast.error("Error: " + res.data.message);
        }
      } catch (error) {
        console.error("Error getting cart:", error.message);
        toast.error("Internal server error");
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

  const removeFromCart = async (itemID) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.patch(
        `${backendUrl}/api/cart/remove-from-cart/${itemID}`,
        { item_id: itemID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCartNumber((prev) => prev - 1);
        setCart(cart.filter((item) => item._id !== itemID));
        toast.success("Item removed from cart");
      } else {
        toast.error("Error: " + res.data.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      toast.error("Internal server error");
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("jwtToken");

    if (cart.length === 0) {
      toast.error("Cart is already empty");
      return;
    }

    try {
      const res = await axios.delete(`${backendUrl}/api/cart/clear-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCartNumber(0);
        setCart([]);
        toast.success("Cart cleared");
      } else {
        toast.error("Error: " + res.data.message);
      }
    } catch (error) {
      console.error("Error clearing cart:", error.message);
      toast.error("Internal server error");
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.post(
        `${backendUrl}/api/orders/place-order`,
        {
          orders: cart.map((item) => ({
            item_id: item._id,
            quantity: item.quantity,
            amount: item.price * item.quantity,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        clearCart();
        setCart([]);
        toast.success("Order placed successfully");
      } else {
        toast.error("Error: " + res.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      toast.error("Internal server error");
    }
  }

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>My Cart | TradeHub</title>
      </Helmet>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">My Cart</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div 
                key={item._id} 
                className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row p-4 gap-6">
                  <div className="w-full md:w-1/3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">{item.name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-zinc-500 dark:text-zinc-400">Price:</div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">₹{item.price}</div>
                        <div className="text-zinc-500 dark:text-zinc-400">Quantity:</div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{item.quantity}</div>
                        <div className="text-zinc-500 dark:text-zinc-400">Total:</div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Category: {item.category.join(", ")}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Seller: {item.seller_name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <CiTrash className="mr-2" size={20} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12">
                <p className="text-center text-zinc-600 dark:text-zinc-400">Your cart is empty</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 space-y-4">
            <div className="sticky top-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-4">Order Summary</h3>
              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Total</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">₹{total}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={placeOrder}
                  className="w-full py-2 px-4 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                >
                  Continue to checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 px-4 rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;