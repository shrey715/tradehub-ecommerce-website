import express from 'express';
import { getCurrentUser, updateCurrentUser, getUserID, getSellerDetails } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', getCurrentUser);
userRouter.patch('/', updateCurrentUser);
userRouter.get('/me', getUserID);
userRouter.get('/seller/:id', getSellerDetails);

export default userRouter;