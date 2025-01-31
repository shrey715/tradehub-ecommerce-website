import { Helmet } from "react-helmet";
import { motion } from "motion/react";

import axiosInstance from "../../../lib/api";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import useOrderStore from "../../../hooks/OrderStore";

import MyCompleted from "./MyCompleted";
import MyPlaced from "./MyPlaced";
import SaleCompleted from "./SaleCompleted";
import SalePlaced from "./SalePlaced";

const Order = () => {
  const { orders, setOrders, sellerOrders, setSellerOrders } = useOrderStore();
  const [ loading, setLoading ] = useState(false);
  const [ selected, setSelected ] = useState('main');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/api/orders/fetch-orders`);
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
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>Orders | TradeHub</title>
      </Helmet>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Orders History
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Select an option to view orders
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setSelected('my-placed')}
            className="w-full p-4 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            My Placed Orders
          </button>
          <button
            onClick={() => setSelected('my-completed')}
            className="w-full p-4 text-sm font-medium rounded-lg bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-colors"
          >
            My Completed Orders
          </button>
          <button
            onClick={() => setSelected('sale-placed')}
            className="w-full p-4 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Customer Placed Orders
          </button>
          <button
            onClick={() => setSelected('sale-completed')}
            className="w-full p-4 text-sm font-medium rounded-lg bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-colors"
          >
            Customer Completed Orders
          </button>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent dark:border-zinc-50 dark:border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-500 dark:text-zinc-400">Loading orders...</p>
            </div>
          ) : orders.length === 0 && sellerOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-2">
              <p className="text-xl font-medium text-zinc-900 dark:text-zinc-50">No orders found</p>
              <p className="text-zinc-500 dark:text-zinc-400">Orders you place or receive will appear here</p>
            </div>
          ) : (
            <div className="p-6">
              {selected === 'main' && (
                <div className="flex flex-col items-center justify-center p-12 space-y-2">
                  <p className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Welcome to Orders</p>
                  <p className="text-zinc-500 dark:text-zinc-400">Continue by selecting any tab above</p>
                </div>
              )}
              {selected === 'my-placed' && <MyPlaced orders={orders} />}
              {selected === 'my-completed' && <MyCompleted orders={orders} />}
              {selected === 'sale-placed' && <SalePlaced orders={sellerOrders} />}
              {selected === 'sale-completed' && <SaleCompleted orders={sellerOrders} />}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Order;