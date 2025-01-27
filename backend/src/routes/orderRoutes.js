import express from 'express';
import { regenerateOTP, placeOrder, verifyOrder, fetchOrders } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get('/regenerate-otp/:id', regenerateOTP);
orderRouter.post('/place-order', placeOrder);
orderRouter.post('/verify-order', verifyOrder);
orderRouter.get('/fetch-orders', fetchOrders);

export default orderRouter;