import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import axios from "axios";
import { backendUrl } from "../../../main";
import { useNavigate } from "react-router";

import { useEffect } from "react";
import useOrderStore from "../../../hooks/OrderStore";

import toast from "react-hot-toast";

const DeliverItems = () => {
  const { sellerOrders, setSellerOrders } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerOrders = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const res = await axios.get(`${backendUrl}/api/orders/fetch-seller-orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setSellerOrders(res.data.sellerOrders);
        } else {
          console.log(res.data.message);
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching seller orders:', error.message);
        toast.error('Internal server error');
      }
    };

    fetchSellerOrders();
  }, [setSellerOrders]);

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="min-h-screen bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>Deliver | TradeHub</title>
      </Helmet>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Orders to Deliver
        </h2>
        <div className="grid gap-4">
          {Array.isArray(sellerOrders) && sellerOrders.filter(order => order.status === 'pending').length > 0 ? (
            sellerOrders.filter(order => order.status === 'pending').map((order) => (
              <div
                key={order._id}
                className="group relative rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/deliver/${order._id}`)}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <img
                      src={`https://picsum.photos/seed/${order.item_id._id}/200/300`}
                      alt={order.item_id.name}
                      className="w-full h-60 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Order ID: {order._id}
                      </p>
                      <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
                        {order.item_id.name}
                      </h3>
                      <div className="flex gap-4">
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">
                          Quantity: {order.quantity}
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          ₹{order.amount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Buyer:</span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {order.buyer_id.fname} {order.buyer_id.lname}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Contact:</span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {order.buyer_id.contact_no}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Date:</span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="inline-flex items-center">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12">
              <p className="text-center text-zinc-600 dark:text-zinc-400">
                No orders to deliver
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DeliverItems;