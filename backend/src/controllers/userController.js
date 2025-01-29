import Order from "../models/Order.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// route for fetching current user
const getCurrentUser = async (req, res) => {
  console.log('Request to get current user');
  try {
    const userID = req.userID;

    if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
      console.log("Invalid user ID");
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(userID).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// route for getting user id
const getUserID = async (req, res) => {
  console.log('Request to get user id');
  try {
    const userId = req.userID;
    res.status(200).json({ success: true, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// route for updating current user
const updateCurrentUser = async (req, res) => {
  console.log('Request to update current user');
  try {
    const userID = req.userID;
    const { fname, lname, age, email, contact_no } = req.body;

    if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndUpdate(
      userID,
      { fname, lname, age, email, contact_no },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

const updatePassword = async (req, res) => {
  console.log('Request to update user password');
  try {
    const userID = req.userID;
    const { currentPassword, newPassword } = req.body;

    if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// route to get seller name, email and contact number on item pages, by item id
const getSellerDetails = async (req, res) => {
  console.log('Request to get seller details');
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid seller ID' });
    }

    const [seller, orders] = await Promise.all([
      User.findById(id).select('fname lname email contact_no'),
      Order.find({ 
        seller_id: id, 
        status: 'completed' 
      })
      .populate('item_id', 'name price image')
      .populate('buyer_id', 'fname lname')
      .sort({ date: -1 })
      .limit(10)
    ]);

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
    const completedOrders = orders.length;

    res.status(200).json({ 
      success: true, 
      seller,
      stats: {
        totalSales,
        completedOrders
      },
      recentOrders: orders
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { getCurrentUser, updateCurrentUser, getUserID, getSellerDetails, updatePassword };