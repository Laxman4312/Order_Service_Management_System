// src/store/confirmationCallbacks.js
class ConfirmationCallbackRegistry {
  constructor() {
    this.callbacks = new Map();
    this.nextId = 1;
  }

  register(callback) {
    const id = `callback_${this.nextId++}`;
    this.callbacks.set(id, callback);
    return id;
  }

  execute(id) {
    const callback = this.callbacks.get(id);
    if (callback) {
      callback();
      this.callbacks.delete(id); // Clean up after execution
    }
  }

  clear(id) {
    this.callbacks.delete(id);
  }
}

export const confirmationCallbacks = new ConfirmationCallbackRegistry();

// src/store/slices/confirmation.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  config: {
    title: '',
    description: '',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    variant: 'contained',
    color: 'primary',
    maxWidth: 'xs',
    callbackId: null,
  },
};

const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    openConfirmation: (state, action) => {
      state.isOpen = true;
      state.config = { ...state.config, ...action.payload };
    },
    closeConfirmation: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openConfirmation, closeConfirmation } = confirmationSlice.actions;
export default confirmationSlice.reducer;
