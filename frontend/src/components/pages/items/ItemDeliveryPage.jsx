import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { CiLock, CiCircleCheck, CiWarning, CiDeliveryTruck } from "react-icons/ci";

import axiosInstance from "../../../lib/api";

import toast from "react-hot-toast";

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8"
    >
      <Helmet>
        <title>Verify Delivery | TradeHub</title>
      </Helmet>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Verify Delivery</h1>
          <Link
            to="/deliver"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1"
          >
            <span>Back to Deliveries</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-800 dark:border-zinc-200"></div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-1">Order #{order._id.slice(-6)}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>
                        {order.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
                    ₹{order.amount}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  {/* Buyer Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Buyer Information
                    </h3>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                          <CiUser className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">
                            {order.buyer_id.fname} {order.buyer_id.lname}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {order.buyer_id.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Order Details
                    </h3>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-50">
                              {order.item_id.name}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Qty: {order.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-zinc-700 dark:text-zinc-300">
                          ₹{order.item_id.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              {order.status === 'completed' ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-6 flex items-center gap-3 border-t border-green-200 dark:border-green-900/30">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CiCircleCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      Order has been completed and verified
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      No further action is required
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CiLock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                          Verify OTP from Buyer
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                          Ask the buyer to provide the OTP shown on their order page
                        </p>
                      </div>
                    </div>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter the 6-digit OTP"
                          className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-lg tracking-wider text-center"
                        />
                      </div>

                      {isConfirmMode && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-start gap-2">
                          <CiWarning className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-800 dark:text-amber-300">
                            Please confirm that you&apos;ve delivered the item to the buyer and received payment
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleButtonClick}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                          isConfirmMode 
                            ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                            : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {isConfirmMode ? (
                          <>
                            <CiCircleCheck className="w-5 h-5" />
                            Confirm Delivery
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
              Having issues? <Link to="/user/support" className="text-zinc-900 dark:text-zinc-200 underline">Contact Support</Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 mb-4">
              <CiDeliveryTruck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-2">Order Not Found</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">The order you&apos;re looking for doesn&apos;t exist or has been removed</p>
            <Link
              to="/deliver"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
            >
              View All Deliveries
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Add the missing CiUser import at the top
function CiUser(props) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

export default ItemDeliveryPage;