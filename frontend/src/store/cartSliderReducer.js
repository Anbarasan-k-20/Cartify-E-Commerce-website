import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/cart";
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
});

export const addToCartDB = createAsyncThunk(
  "cart/addToCartDB",
  async (item, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, item);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add failed");
    }
  }
);

export const removeFromCartDB = createAsyncThunk(
  "cart/removeFromCartDB",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addToCartDB.fulfilled, (state, action) => {
        state.cart.push(action.payload);
      })

      .addCase(removeFromCartDB.fulfilled, (state, action) => {
        state.cart = state.cart.filter((item) => item._id !== action.payload);
      });
  },
});

export default cartSlice.reducer;
