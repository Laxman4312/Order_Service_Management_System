// src/hooks/useSnackbarStore.js
import { create } from 'zustand';

const useSnackbarStore = create((set) => ({
  isOpen: false,
  config: {
    message: '',
    severity: 'info', // 'success', 'info', 'warning', 'error'
  },
  open: (config) => set({ isOpen: true, config }),
  close: () => set({ isOpen: false }),
}));

export default useSnackbarStore;
