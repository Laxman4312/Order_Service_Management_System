// src/services/confirmationService.js
import { create } from 'zustand';

const useConfirmationStore = create((set) => ({
  isOpen: false,
  config: {
    title: '',
    type: 'null',
    description: '',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    variant: 'default',
    maxWidth: 'xs',
    onConfirm: () => {},
  },
  open: (config) => set({ isOpen: true, config }),
  close: () => set({ isOpen: false }),
}));

export default useConfirmationStore;
