import bcrypt from "bcrypt";
import Order from "../models/Order.js";
import Item from "../models/Item.js";

// route for regenerating OTP
const regenerateOTP = async (req, res) => {
  console.log("Regenerating OTP");
  try {
    const order_id = req.params.id;

    if (!order_id) {
      console.log("Order ID not found");
      return res.status(400).json({ success: false, message: 'Order ID not found' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    if (!hashedOtp) {
      console.log("Error hashing OTP");
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const order = await Order.findByIdAndUpdate(order_id, { hashed_otp: hashedOtp }, { new: true });

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    console.log("OTP regenerated successfully");
    res.status(200).json({ success: true, message: 'OTP regenerated successfully', otp: otp });
  } catch (error) {
    console.error('Error regenerating OTP:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// route for placing an order
const placeOrder = async (req, res) => {
  console.log("Placing an order");
  try {
    const orders = req.body.orders;
    const userID = req.userID;

    if (!orders || orders.length === 0) {
      console.log("Missing orders");
      return res.status(400).json({ success: false, message: 'Missing orders' });
    }

    const otps = orders.map(() => Math.floor(1000 + Math.random() * 9000));
    const hashedOtps = await Promise.all(otps.map(otp => bcrypt.hash(otp.toString(), 10)));

    if (!hashedOtps) {
      console.log("Error hashing OTPs");
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const orderDetails = await Promise.all(orders.map(async (order, index) => {
      const item = await Item.findById(order.item_id);
      if (!item) {
        throw new Error(`Item with ID ${order.item_id} not found`);
      }
      return {
        buyer_id: userID,
        seller_id: item.seller_id,
        item_id: order.item_id,
        amount: order.amount,
        hashed_otp: hashedOtps[index],
        quantity: order.quantity,
        status: 'pending'
      };
    }));

    const newOrders = await Order.insertMany(orderDetails);
    if (!newOrders) {
      console.log("Error placing order");
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    // Reduce the stock of each item
    await Promise.all(orders.map(async (order) => {
      await Item.findByIdAndUpdate(order.item_id, { $inc: { stock: -order.quantity } });
    }));

    console.log("Order placed successfully");
    res.status(201).json({ success: true, message: 'Order placed successfully', orders: newOrders });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// route for verifying an order
const verifyOrder = async (req, res) => {
  console.log("Verifying order");
  try {
    const { order_id, otp } = req.body;

    if (!order_id || !otp) {
      console.log("Missing required fields");
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const order = await Order.findById(order_id);
    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isValid = await bcrypt.compare(otp.toString(), order.hashed_otp);
    if (!isValid) {
      console.log("Invalid OTP");
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    order.status = 'completed';
    await order.save();

    console.log("Order verified successfully");
    res.status(200).json({ success: true, message: 'Order verified successfully', order: order });
  } catch (error) {
    console.error('Error verifying order:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// route for fetching all orders of the user, as buyer and seller
const fetchOrders = async (req, res) => {
  console.log("Fetching orders");
  try {
    const userID = req.userID;

    const orders = await Order.find({ buyer_id: userID })
      .select('-hashed_otp')
      .populate({
        path: 'item_id',
        select: 'name'
      })
      .populate({
        path: 'seller_id',
        select: 'fname lname contact_no'
      });

    const sellerOrders = await Order.find({ seller_id: userID })
      .select('-hashed_otp')
      .populate({
        path: 'item_id',
        select: 'name'
      })
      .populate({
        path: 'buyer_id',
        select: 'fname lname contact_no'
      });

    console.log(orders);
    console.log("Orders fetched successfully");
    res.status(200).json({ success: true, message: 'Orders fetched successfully', orders, sellerOrders });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export { regenerateOTP, placeOrder, verifyOrder, fetchOrders };