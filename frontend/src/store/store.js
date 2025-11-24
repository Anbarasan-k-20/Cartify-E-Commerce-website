//D:\E Commerce Website\frontend\src\store\store.js

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSliderReducer.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
