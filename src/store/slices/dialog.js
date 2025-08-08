import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dialogType: 'Add',
  isOpen: false,
  //temp
  mediaId: '',
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action) => {
      state.dialogType = action.payload ?? initialState.dialogType;
      state.isOpen = true;
    },
    setId: (state, action) => {
      state.mediaId = action.payload.id;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openDialog, closeDialog, setId } = dialogSlice.actions;
export default dialogSlice.reducer;
