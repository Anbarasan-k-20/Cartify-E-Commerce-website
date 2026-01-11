import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// GET all cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cart");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const addToCartDB = createAsyncThunk(
  "cart/addToCartDB",
  async (product, { rejectWithValue }) => {
    try {
      const payload = {
        productId: product._id,
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating,
      };
      const res = await axiosInstance.post("/cart", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add failed");
    }
  }
);

export const increaseQtyDB = createAsyncThunk(
  "cart/increaseQtyDB",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/cart/increase/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Increase failed");
    }
  }
);

export const decreaseQtyDB = createAsyncThunk(
  "cart/decreaseQtyDB",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/cart/decrease/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Decrease failed");
    }
  }
);

export const removeFromCartDB = createAsyncThunk(
  "cart/removeFromCartDB",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/cart/${id}`);
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
  reducers: {
    clearCart: (state) => {
      state.cart = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addToCartDB.fulfilled, (state, action) => {
        const newItem = action.payload;
        const index = state.cart.findIndex(
          (item) =>
            item.productId === newItem.productId || item._id === newItem._id
        );

        if (index !== -1) {
          state.cart[index] = newItem;
        } else {
          state.cart.push(newItem);
        }
      })

      // INCREASE qty
      .addCase(increaseQtyDB.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.cart.findIndex((i) => i._id === updated._id);
        if (index !== -1) state.cart[index] = updated;
      })

      // DECREASE qty
      .addCase(decreaseQtyDB.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.cart.findIndex((i) => i._id === updated._id);
        if (index !== -1) state.cart[index] = updated;
      })

      // REMOVE
      .addCase(removeFromCartDB.fulfilled, (state, action) => {
        state.cart = state.cart.filter((i) => i._id !== action.payload);
      });
  },
});

export const selectCartCount = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
