// store/cartSlicerReducer.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/cart";

// GET all cart items
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
});

// export const addToCartDB = createAsyncThunk(
//   "cart/addToCartDB",
//   async (product, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(API_URL, {
//         productId: product._id,
//         title: product.title,
//         price: product.price,
//         image: product.image,
//         category: product.category,
//         rating: product.rating,
//       });
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Add failed");
//     }
//   }
// );

export const addToCartDB = createAsyncThunk(
  "cart/addToCartDB",
  async (product, { rejectWithValue }) => {
    try {
      const payload = {
        productId: product._id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating,
      };
      const res = await axios.post(API_URL, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add failed");
    }
  }
);

// Increase quantity
export const increaseQtyDB = createAsyncThunk(
  "cart/increaseQtyDB",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/increase/${id}`);
      return res.data.data;
    } catch {
      return rejectWithValue("Increase failed");
    }
  }
);

// Decrease quantity
export const decreaseQtyDB = createAsyncThunk(
  "cart/decreaseQtyDB",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/decrease/${id}`);
      return res.data.data;
    } catch {
      return rejectWithValue("Decrease failed");
    }
  }
);

// Delete item
export const removeFromCartDB = createAsyncThunk(
  "cart/removeFromCartDB",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch {
      return rejectWithValue("Delete failed");
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
        state.error = action.error.message;
      })

      // ADD — replace existing OR add new
      .addCase(addToCartDB.fulfilled, (state, action) => {
        const newItem = action.payload;

        // const index = state.cart.findIndex(
        //   (i) => i.productId === newItem.productId
        // );

        const index = state.cart.findIndex(
          (i) =>
            i.productId === newItem.productId ||
            i.productId?._id === newItem.productId ||
            i.productId === newItem.productId?._id ||
            i.productId?._id === newItem.productId?._id
        );

        if (index !== -1) {
          // Replace existing item with updated one from backend
          state.cart[index] = newItem;
        } else {
          // Add new product
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

export default cartSlice.reducer;

// CART ICON COUNT
export const selectCartCount = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);
