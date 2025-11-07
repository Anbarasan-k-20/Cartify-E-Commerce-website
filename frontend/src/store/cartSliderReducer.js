import{createSlice} from '@reduxjs/toolkit'

let cartSlice = createSlice({
    name:'cart',
    initialState:[],
    reducers:{
        addToCart(state,action){

        },
        removeFromCart(state,action){

        }
    }
})

export cartSlice.reducer