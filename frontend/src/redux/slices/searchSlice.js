import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  city: "",
  zip: "",
  state: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    },
    setZip(state, action) {
      state.zip = action.payload;
    },
    setState(state, action) {
      state.state = action.payload;
    },
    clearLocation(state) {
      state.city = "";
      state.zip = "";
      state.state = "";
    },
  },
});

export const {setCity, setZip, setState, clearLocation} = searchSlice.actions;
export default searchSlice.reducer;
