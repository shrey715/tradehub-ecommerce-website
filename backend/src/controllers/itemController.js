import Item from '../models/Item.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// route for fetching all items that don't belong to the user
const getItems = async (req, res) => {
  console.log("Fetching items not belonging to the user");
  try {
    const userID = req.userID;
    console.log("User ID: " + userID);
    if (!userID) {
      console.log("User ID not found");
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found' });
    }

    const items = await Item.aggregate([
      { $match: { seller_id: { $ne: new mongoose.Types.ObjectId(userID) }, stock: { $gt: 0 } } },
      { $lookup: {
          from: 'users',
          localField: 'seller_id',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      { $project: {
          _id: 1,
          name: 1,
          price: 1,
          image: 1,
          description: 1,
          category: 1,
          seller_id: 1,
          seller_name: { $concat: ['$seller.fname', ' ', '$seller.lname'] }
        }
      }
    ]);

    for (let i = 0; i < items.length; i++) {
      console.log("Item " + i + ": " + items[i].seller_id); 
    }

    console.log("Fetched " + items.length + " items");
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// route for getting one item by ID
const getItemByID = async (req, res) => {
  console.log("Fetching item by ID: " + req.params.id);
  try {
    const itemID = req.params.id;

    if (!itemID) {
      console.log("Item ID not found");
      return res.status(400).json({ success: false, message: 'Item ID not found' });
    }

    const item = await Item.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(itemID) } },
      { $lookup: {
          from: 'users',
          localField: 'seller_id',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      { $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          category: 1,
          image: 1,
          stock: 1,
          seller: {
            id: '$seller._id', 
            name: { $concat: ['$seller.fname', ' ', '$seller.lname'] },
            email: '$seller.email',
            contact_no: '$seller.contact_no'
          }
        }
      }
    ]);

    if (!item && item.seller_id === req.userID) {
      console.log("Unauthorized: Item belongs to user");
      return res.status(401).json({ success: false, message: 'Unauthorized: Item belongs to user' });
    }
    
    if (!item.length) {
      console.log("Item not found");
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    console.log("Item found");
    res.status(200).json({ success: true, item: item[0] });
  } catch (error) {
    console.error('Error fetching item:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// route for adding an item
const createItem = async (req, res) => {
  console.log("New item creation request received");
  try {
    const { name, price, description, stock, image, category } = req.body;

    // validate required fields
    if (!name || typeof name !== 'string') {
      console.log("Invalid or missing name");
      return res.status(400).json({ success: false, message: 'Invalid or missing name' });
    }
    if (!price || isNaN(Number(price))) {
      console.log("Invalid or missing price");
      return res.status(400).json({ success: false, message: 'Invalid or missing price' });
    }
    if (!description || typeof description !== 'string') {
      console.log("Invalid or missing description");
      return res.status(400).json({ success: false, message: 'Invalid or missing description' });
    }
    if (!stock || isNaN(Number(stock))) {
      console.log("Invalid or missing stock");
      return res.status(400).json({ success: false, message: 'Invalid or missing stock' });
    }
    if (!category || typeof category !== 'string') {
      console.log("Invalid or missing category");
      return res.status(400).json({ success: false, message: 'Invalid or missing category' });
    }
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const seller_id = req.userID;
    if (!seller_id) {
      console.log("Seller ID not found");
      return res.status(401).json({ success: false, message: 'Unauthorized: Seller ID not found' });
    }

    const categoryArray = category.split(',').map((category) => category.trim().toLowerCase());

    const uploadResponse = await cloudinary.uploader.upload(image);

    const newItem = new Item({
      name,
      price: Number(price),
      description,
      category: categoryArray,
      image: uploadResponse.secure_url,
      seller_id,
      stock: Number(stock)
    });

    const savedItem = await newItem.save();
    console.log("Item created successfully");
    res.status(201).json({ success: true, message: 'Item created successfully', item: savedItem });
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// route for fetching all items by the user selling them
const getMyItems = async (req, res) => {
  console.log("Fetching items belonging to the user");
  try {
    const userID = req.userID;

    if (!userID) {
      console.log("User ID not found");
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID not found' });
    }

    console.log("User ID: " + userID);

    const items = await Item.aggregate([
      { $match: { seller_id: new mongoose.Types.ObjectId(userID) } },
      { $addFields: {
          status: {
            $cond: {
              if: { $gt: ["$stock", 0] },
              then: "available",
              else: "out of stock"
            }
          }
      }},
      { $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          image: 1,
          category: 1,
          stock: 1,
          status: 1
        }
      }
    ]);

    console.log("Fetched " + items.length + " items");

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// route for updating an item by the seller
const updateItem = async (req, res) => {
  console.log("Updating item: " + req.params.id);
  try {
    const itemId = req.params.id;
    const updates = req.body;
    const userID = req.userID;

    const item = await Item.findOne({ _id: itemId, seller_id: userID });
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found or unauthorized' 
      });
    }

    if (updates.name && typeof updates.name !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid name format' 
      });
    }
    if (updates.price && isNaN(Number(updates.price))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid price format' 
      });
    }
    if (updates.stock && isNaN(Number(updates.stock))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid stock format' 
      });
    }

    if (updates.category) {
      updates.category = updates.category
        .split(',')
        .map(cat => cat.trim().toLowerCase());
    }

    if (req.body.image) {
      const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
        upload_preset: 'ml_default'
      });
      updates.image = uploadResponse.secure_url;
    }

    Object.keys(updates).forEach(key => {
      if (key !== 'seller_id') { 
        item[key] = updates[key];
      }
    });

    await item.save();

    const itemRes = item.toObject();
    itemRes.image = undefined;
    itemRes.status = itemRes.stock > 0 ? 'available' : 'out of stock';    

    console.log("Item updated successfully");
    res.status(200).json({ 
      success: true, 
      message: 'Item updated successfully',
      item: itemRes
    });

  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// route for deleting an item by the seller
const deleteItem = async (req, res) => {
  console.log("Deleting item: " + req.params.id);
  try {
    const itemId = req.params.id;
    const userID = req.userID;

    const item = await Item.findByIdAndDelete({ _id: itemId, seller_id: userID });
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found or unauthorized' 
      });
    }
        
    console.log("Item deleted successfully");
    res.status(200).json({ 
      success: true, 
      message: 'Item deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export { createItem, getItems, getItemByID, getMyItems, updateItem, deleteItem };