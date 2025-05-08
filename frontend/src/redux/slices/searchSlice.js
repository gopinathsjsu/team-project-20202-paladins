import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: ''
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    clearLocation(state) {
      state.location = '';
    }
  }
});

export const { setLocation, clearLocation } = searchSlice.actions;
export default searchSlice.reducer;