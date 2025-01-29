import express from 'express';
import { createItem, getItems, getItemByID, getMyItems, updateItem, deleteItem } from '../controllers/itemController.js';
import upload from '../middlewares/uploadMiddleware.js';

const itemRouter = express.Router();

itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/all', getItems);
itemRouter.get('/my-listings', getMyItems);
itemRouter.get('/:id', getItemByID);
itemRouter.patch('/:id', upload.single('image'), updateItem);
itemRouter.delete('/:id', deleteItem);

export default itemRouter;