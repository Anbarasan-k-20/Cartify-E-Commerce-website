import { createSlice } from "@reduxjs/toolkit";

let cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart(state, action) {
      console.log(action.payload);
    },
    removeFromCart(state, action) {
      console.log(state, action);
    },
  },
});

export default cartSlice.reducer;

export let { addToCart, removeFromCart } = cartSlice.actions;
