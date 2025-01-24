import express from 'express';
import { createItem, getItems, getItemByID } from '../controllers/itemController.js';
import upload from '../middlewares/uploadMiddleware.js';

const itemRouter = express.Router();

itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/all', getItems);
itemRouter.get('/:id', getItemByID);

export default itemRouter;