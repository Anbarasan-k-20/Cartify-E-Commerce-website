import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSliderReducer";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
