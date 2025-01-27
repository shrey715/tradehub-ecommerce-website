import useOrderStore from "../../../hooks/OrderStore";
import { Helmet } from "react-helmet";

import { motion } from "motion/react";

const MyCompleted = () => {
  const { orders } = useOrderStore();

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="w-full h-full p-2"
    >
      <Helmet>
        <title>My Completed Orders | TradeHub</title>
      </Helmet>
      <div className="w-full h-full p-4">
        <h2 className="text-2xl font-light text-left mb-4">My Completed Orders</h2>
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
            </tr>
          </thead>
          <tbody className="font-light">
            {Array.isArray(orders) && orders.filter(order => order.status === 'completed').length > 0 ? (
              orders.filter(order => order.status === 'completed').map((order) => (
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
                  <td className="border-b p-2">{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border-b p-2 text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default MyCompleted;