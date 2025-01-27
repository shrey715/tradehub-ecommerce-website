import express from 'express';
import { regenerateOTP, placeOrder, verifyOrder, fetchOrders, fetchSellerOrders, fetchOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get('/regenerate-otp/:id', regenerateOTP);
orderRouter.post('/place-order', placeOrder);
orderRouter.post('/verify-otp', verifyOrder);
orderRouter.get('/fetch-orders', fetchOrders);
orderRouter.get('/fetch-seller-orders', fetchSellerOrders);
orderRouter.get('/fetch-order/:id', fetchOrder);

export default orderRouter;