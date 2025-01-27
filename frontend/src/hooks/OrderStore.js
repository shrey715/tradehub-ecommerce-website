import { create } from 'zustand';

const useOrderStore = create((set) => ({
  sellerOrders: {},
  orders: {},
  setSellerOrders: (sellerOrders) => set({ sellerOrders }),
  setOrders: (orders) => set({ orders }),
}));

export default useOrderStore;