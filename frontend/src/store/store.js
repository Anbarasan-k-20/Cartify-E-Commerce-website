import { configureStore } from "@reduxjs/toolkit";
import cartSliderReducer from "./cartSliderReducer";
export const store = configureStore({
  reducer: {
    cart: cartSliderReducer,
  },
});
