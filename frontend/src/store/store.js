//D:\E Commerce Website\frontend\src\store\store.js
import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice.js";
import buyProductSlice from "./buyProductSlice.js";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    buyProduct: buyProductSlice,
  },
});

export default store;