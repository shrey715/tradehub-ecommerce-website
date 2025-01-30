import { create } from 'zustand';

const useCartNumberStore = create((set) => ({
  cartNumber: 0,
  setCartNumber: (cartNumber) => set({ cartNumber }),
}));

export default useCartNumberStore;