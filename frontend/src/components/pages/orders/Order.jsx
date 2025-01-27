import { Helmet } from "react-helmet";
import { motion } from "motion/react";

import axios from "axios";
import { Outlet, useNavigate } from "react-router";
import { backendUrl } from "../../../main";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import useOrderStore from "../../../hooks/OrderStore";

const Order = () => {
  const { orders, setOrders, sellerOrders, setSellerOrders } = useOrderStore();
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        setLoading(true);

        const res = await axios.get(`${backendUrl}/api/orders/fetch-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setOrders(res.data.orders);
          setSellerOrders(res.data.sellerOrders);
        } else {
          toast.error('Error: ' + res.data.message);
        }
      } catch (error) {
        console.error('Error getting orders:', error.message);
        toast.error('Internal server error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders, setSellerOrders]);

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="w-full h-full p-2"
    >
      <Helmet>
        <title>Orders | TradeHub</title>
      </Helmet>
      <div className="px-6 w-full h-full">
        <h2 className="text-3xl font-light text-left">Orders History</h2>
        <hr className="my-4 border-t border-gray-300" />
        <p className="text-lg font-light text-left my-3">Select an option to view orders:</p>
        <div className="flex flex-wrap w-full">
          <button
            className="flex-1 bg-zinc-900 text-white font-semibold px-4 py-2 border border-zinc-800 hover:bg-zinc-800 transition-colors duration-300"
            onClick={() => navigate('/orders/my/placed')}
          > 
            My Placed Orders
          </button>
          <button
            className="flex-1 bg-white text-zinc-900 font-semibold px-4 py-2 border border-zinc-800 hover:bg-zinc-200 transition-colors duration-300"
            onClick={() => navigate('/orders/my/completed')}
          >
            My Completed Orders
          </button>
          <button
            className="flex-1 bg-zinc-900 text-white font-semibold px-4 py-2 border border-zinc-800 hover:bg-zinc-800 transition-colors duration-300"
            onClick={() => navigate('/orders/sale/placed')}
          >
            Customer Placed Orders
          </button>
          <button
            className="flex-1 bg-white text-zinc-900 font-semibold px-4 py-2 border border-zinc-800 hover:bg-zinc-200 transition-colors duration-300"
            onClick={() => navigate('/orders/sale/completed')}
          >
            Customer Completed Orders
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col justify-center items-center w-full h-full gap-4">
            <h1 className="text-4xl font-bold">No orders found</h1>
          </div>
        ) : orders.length === 0 && sellerOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <Outlet />
        )}
      </div>
    </motion.div>
  );
};

export default Order;