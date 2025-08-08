import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSaving: false,
  transitions: false,
  deleteModal: false,
  deleteId: '',
  query: '',
  filter: {},
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    triggerIsSavingFlag: (state, action) => {
      state.isSaving = action.payload;
    },
    triggerTransitionsFlag: (state) => {
      state.transitions = true;
    },
    setDeleteId: (state, action) => {
      state.deleteId = action.payload.id;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    openDeleteModal: (state) => {
      state.deleteModal = true;
    },
    closeDeleteModal: (state) => {
      state.deleteModal = initialState.deleteModal;
      state.deleteId = initialState.deleteId;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearQUery: (state) => {
      state.query = initialState.query;
    },
  },
});

export const {
  triggerIsSavingFlag,
  triggerTransitionsFlag,
  openDeleteModal,
  closeDeleteModal,
  setQuery,
  setDeleteId,
  setFilter,
  clearQUery,
} = generalSlice.actions;
export default generalSlice.reducer;
