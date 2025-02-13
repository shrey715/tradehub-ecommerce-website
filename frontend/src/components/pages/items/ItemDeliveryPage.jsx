import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import { useParams } from "react-router";
import { useEffect, useState } from "react";

import axiosInstance from "../../../lib/api";

import toast from "react-hot-toast";
import Loading from "../common/Loading";

const ItemDeliveryPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/orders/fetch-order/${id}`);

        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Error fetching order");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const verifyOrder = async (otp) => {
    try {
      const res = await axiosInstance.post(`/api/orders/verify-otp`, { order_id: id, otp });

      if (res.data.success) {
        toast.success("Order verified successfully");
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      toast.error("Error verifying order");
    }
  };

  const handleButtonClick = () => {
    if (!isConfirmMode) {
      setIsConfirmMode(true);
      return;
    }
    verifyOrder(otp);
    setIsConfirmMode(false);
  };
  
  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>Verify Delivery | TradeHub</title>
      </Helmet>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Verify Delivery
        </h2>

        {loading ? (
          <Loading />
        ) : order ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
                  Order Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-zinc-500 dark:text-zinc-400">Order ID</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{order._id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-500 dark:text-zinc-400">Amount</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">₹{order.amount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-500 dark:text-zinc-400">Buyer</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {order.buyer_id.fname} {order.buyer_id.lname}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-500 dark:text-zinc-400">Status</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{order.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {order.status === 'completed' ? (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-6 text-center">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  Order has been completed and verified
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
                    Verify OTP
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Enter the OTP provided by the buyer to complete the delivery
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={handleButtonClick}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-colors"
                    >
                      {isConfirmMode ? "Confirm Transaction" : "Verify OTP"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">Order not found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ItemDeliveryPage;