import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import useOrderStore from "../../../hooks/OrderStore";
import axiosInstance from "../../../lib/api";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

import MyCompleted from "./MyCompleted";
import MyPlaced from "./MyPlaced";
import SaleCompleted from "./SaleCompleted";
import SalePlaced from "./SalePlaced";
import { CiShoppingCart, CiDeliveryTruck, CiShop, CiCircleCheck } from "react-icons/ci";

const OrderTabButton = ({ active, icon, label, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center py-4 px-2 border-b-2 transition-colors ${
      active
        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
    }`}
  >
    <div className="relative">
      {icon}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-indigo-600 text-white rounded-full">
          {count}
        </span>
      )}
    </div>
    <span className="mt-1 text-xs font-medium">{label}</span>
  </button>
);

OrderTabButton.propTypes = {
  active: PropTypes.bool.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired
};

const Order = () => {
  const { orders = [], setOrders, sellerOrders = [], setSellerOrders } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('my-placed');

  // Ensure we have arrays before calling filter
  const placedOrdersCount = Array.isArray(orders) 
    ? orders.filter(order => order.status === 'pending').length 
    : 0;
    
  const salesOrdersCount = Array.isArray(sellerOrders) 
    ? sellerOrders.filter(order => order.status === 'pending').length 
    : 0;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/api/orders/fetch-orders`);
        if (res.data.success) {
          // Ensure we're setting arrays
          setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
          setSellerOrders(Array.isArray(res.data.sellerOrders) ? res.data.sellerOrders : []);
        } else {
          toast.error('Error: ' + res.data.message);
          // Initialize as empty arrays on error
          setOrders([]);
          setSellerOrders([]);
        }
      } catch (error) {
        console.error('Error getting orders:', error.message);
        toast.error('Internal server error');
        // Initialize as empty arrays on error
        setOrders([]);
        setSellerOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders, setSellerOrders]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 dark:text-zinc-400">Loading your orders...</p>
        </div>
      );
    }

    // Check if arrays are empty or not arrays
    const noOrders = !Array.isArray(orders) || orders.length === 0;
    const noSellerOrders = !Array.isArray(sellerOrders) || sellerOrders.length === 0;

    if (noOrders && noSellerOrders) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center px-6">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <CiShoppingCart className="w-8 h-8 text-zinc-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-2">No orders yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              When you place orders or receive purchases from other users, they will appear here
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/item/all'} 
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md transition-colors"
          >
            Browse Items
          </button>
        </div>
      );
    }

    // Make sure we pass arrays to the child components
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeSellerOrders = Array.isArray(sellerOrders) ? sellerOrders : [];

    switch (selected) {
      case 'my-placed':
        return <MyPlaced orders={safeOrders} />;
      case 'my-completed':
        return <MyCompleted orders={safeOrders} />;
      case 'sale-placed':
        return <SalePlaced orders={safeSellerOrders} />;
      case 'sale-completed':
        return <SaleCompleted orders={safeSellerOrders} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950 min-h-screen"
    >
      <Helmet>
        <title>Orders | TradeHub</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            My Orders
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Track and manage your purchases and sales
          </p>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Order tabs */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
            <div className="flex justify-around min-w-full md:justify-start">
              <OrderTabButton 
                active={selected === 'my-placed'}
                icon={<CiShoppingCart className="w-5 h-5" />}
                label="My Orders"
                count={placedOrdersCount}
                onClick={() => setSelected('my-placed')}
              />
              <OrderTabButton 
                active={selected === 'my-completed'}
                icon={<CiCircleCheck className="w-5 h-5" />}
                label="Completed"
                count={0}
                onClick={() => setSelected('my-completed')}
              />
              <OrderTabButton 
                active={selected === 'sale-placed'}
                icon={<CiDeliveryTruck className="w-5 h-5" />}
                label="To Deliver"
                count={salesOrdersCount}
                onClick={() => setSelected('sale-placed')}
              />
              <OrderTabButton 
                active={selected === 'sale-completed'}
                icon={<CiShop className="w-5 h-5" />}
                label="Sales"
                count={0}
                onClick={() => setSelected('sale-completed')}
              />
            </div>
          </div>

          <div className="p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Order;