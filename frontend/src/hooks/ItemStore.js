import { create } from 'zustand';

const useItemStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));

export default useItemStore;