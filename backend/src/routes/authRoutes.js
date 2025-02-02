import express from 'express';
import { login, register, verifyjwt, casCallback } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/verifyjwt', verifyjwt);
authRouter.get('/cas', casCallback);

export default authRouter; 