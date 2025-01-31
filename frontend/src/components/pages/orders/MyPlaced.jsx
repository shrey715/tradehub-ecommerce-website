import useOrderStore from "../../../hooks/OrderStore";
import { Helmet } from "react-helmet";

import axiosInstance from "../../../lib/api";

import { motion } from "motion/react";
import toast from "react-hot-toast";

const MyPlaced = () => {
  const { orders } = useOrderStore();

  const handleRegenerateOTP = async (order_id) => {
    try {
      const res = await axiosInstance.get(`/api/orders/regenerate-otp/${order_id}`);

      if (res.data.success) {
        toast.success("The OTP is: "+ res.data.otp, {
          // icon: '🔑'
          icon: '🥵'
        });
      } else {
        console.log(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error regenerating OTP:', error.message);
      toast.error('Internal server error');
    }
  };

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="w-full h-full p-2"
    >
      <Helmet>
        <title>My Placed Orders | TradeHub</title>
      </Helmet>
      <div className="w-full h-full p-4">
        <h2 className="text-2xl font-light text-left mb-4">My Placed Orders</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Order ID</th>
              <th className="border-b p-2 text-left">Item Name</th>
              <th className="border-b p-2 text-left">Quantity</th>
              <th className="border-b p-2 text-left">Amount</th>
              <th className="border-b p-2 text-left">Seller Name</th>
              <th className="border-b p-2 text-left">Contact</th>
              <th className="border-b p-2 text-left">Date</th>
              <th className="border-b p-2 text-left">Status</th>
              <th className="border-b p-2 text-left">OTP</th>
            </tr>
          </thead>
          <tbody className="font-light">
            {Array.isArray(orders) && orders.filter(order => order.status === 'pending').length > 0 ? (
              orders.filter(order => order.status === 'pending').map((order) => (
                <tr key={order._id} className="hover:bg-zinc-200 cursor-pointer transition duration-200">
                  <td className="border-b p-2">{order._id}</td>
                  <td className="border-b p-2">{order.item_id.name}</td>
                  <td className="border-b p-2">{order.quantity}</td>
                  <td className="border-b p-2">&#8377; {order.amount}</td>
                  <td className="border-b p-2">{order.seller_id.fname} {order.seller_id.lname}</td>
                  <td className="border-b p-2">{order.seller_id.contact_no}</td>
                  <td className="border-b p-2">
                    {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                  </td>
                  <td className="border-b p-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="border-b p-2">
                    <button className="bg-zinc-900 text-white p-1 rounded-md" onClick={() => handleRegenerateOTP(order._id)}>Regenerate OTP</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border-b p-2 text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default MyPlaced;