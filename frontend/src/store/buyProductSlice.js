import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const API = import.meta.env.VITE_API_BASE_URL;

export const placeOrder = createAsyncThunk(
  "buyProduct/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      // Use axiosInstance which auto-attaches token from localStorage
      const res = await axiosInstance.post("/orders/place-order", orderData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Order placement failed"
      );
    }
  }
);

const buyProductSlice = createSlice({
  name: "buyProduct",
  initialState: {
    loading: false,
    success: false,
    error: null,
    order: null,
  },
  reducers: {
    resetOrder: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.data;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Order failed";
        state.order = null;
      });
  },
});

export const { resetOrder } = buyProductSlice.actions;
export default buyProductSlice.reducer;
