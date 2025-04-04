import { create } from 'zustand';

const useOrderStore = create((set) => ({
  orders: [],
  sellerOrders: [],
  setOrders: (orders) => set({ orders }),
  setSellerOrders: (sellerOrders) => set({ sellerOrders }),
}));

export default useOrderStore;