import { addToCart, removeFromCart, getCart, clearCart } from "../controllers/cartController.js";
import express from "express";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", addToCart);
cartRouter.patch("/remove-from-cart/:item_id", removeFromCart);
cartRouter.delete("/clear-cart", clearCart);
cartRouter.get("/get-cart", getCart);

export default cartRouter;