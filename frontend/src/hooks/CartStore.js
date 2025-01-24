import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      setCart: (cart) => set({ cart }),
      addToCart: (item) => set((state) => {
        console.log('Adding item to cart:', item);
        const itemExists = state.cart.some(cartItem => cartItem._id === item._id);
        if (!itemExists) {
          return { cart: [...state.cart, item] };
        }
        return state;
      }),
      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((item) => item._id !== itemId)
      })),
      clearCart: () => set({ cart: [] }),
      cartSize: (state) => state.cart.length,
      totalCost: () => get().cart.reduce((total, item) => total + item.price, 0),
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage, 
    }
  )
);

export default useCartStore;