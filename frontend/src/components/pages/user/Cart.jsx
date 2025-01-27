import { Helmet } from "react-helmet";
import { motion } from "motion/react";
import { CiTrash } from "react-icons/ci";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import axios from "axios";
import { backendUrl } from "../../../main";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

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
    try {
      const res = await axios.delete(`${backendUrl}/api/cart/clear-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
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
      className="w-full h-full p-2"
    >
      <Helmet>
        <title>My Cart | TradeHub</title>
      </Helmet>
      <div className="px-6 w-full h-full">
        <h2 className="text-3xl font-light text-left">My Cart</h2>
        <hr className="my-4 border-t border-gray-300" />
        <div className="flex flex-col md:flex-row justify-between item-start gap-4">
          <div className="flex flex-col gap-4 w-full md:w-2/3">
            {cart.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row gap-4 w-full border border-zinc-900 p-4">
                <img
                  src={`https://picsum.photos/seed/${item._id}/200/300`}
                  alt={item.name}
                  className="w-full md:w-1/3 h-48 object-cover"
                />
                <div className="flex flex-col justify-between w-full md:w-2/3">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-2xl font-light text-left">
                        <span className="font-normal">Item: </span>
                        {item.name}
                      </h3>
                      <h3 className="text-2xl font-light text-left">
                        <span className="font-normal">Price: </span>
                        &#8377; {item.price}
                      </h3>
                      <h3 className="text-2xl font-light text-left">
                        <span className="font-normal">Quantity: </span>
                        {item.quantity}
                      </h3>
                      <h3 className="text-2xl font-light text-left">
                        <span className="font-normal">Total: </span>
                        &#8377; {item.price * item.quantity}
                      </h3>
                      <hr className="my-2 border-t border-gray-300" />
                      <p className="text-lg font-light text-left">
                        <span className="font-normal">Category: </span>
                        {item.category.join(", ")}
                      </p>
                      <p className="text-lg font-light text-left">
                        <span className="font-normal">Seller: </span>
                        {item.seller_name}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="flex items-center self-end bg-zinc-900 text-white font-semibold py-2 px-4 border hover:bg-red-600 transition-colors duration-75 mt-4 md:mt-0"
                    >
                      <CiTrash className="mr-2" size={28} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {
              cart.length === 0 && (
                <div className="flex justify-center items-center w-full h-48 border border-zinc-900 p-4">
                  <h3 className="text-2xl font-light text-left">
                    Your cart is empty
                  </h3>
                </div>
              )
            }
          </div>
          <div className="flex flex-col gap-4 w-full md:w-1/3 border border-zinc-900 p-4">
            <h3 className="text-2xl font-light text-left">
              <span className="font-normal">Total Bill: </span>
              &#8377; {total}
            </h3>
            <button
              onClick={clearCart}
              className="bg-white text-zinc-900 font-semibold py-2 px-4 border border-zinc-900 hover:bg-zinc-200 transition-colors duration-75"
            >
              Clear Cart
            </button>
            <button
              onClick={placeOrder}
              className="bg-zinc-900 text-white font-semibold py-2 px-4 border border-zinc-900 hover:bg-zinc-700 transition-colors duration-75"
            >
              Continue to checkout
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;