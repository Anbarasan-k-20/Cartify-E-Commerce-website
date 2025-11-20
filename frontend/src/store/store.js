import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSliderReducer.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
