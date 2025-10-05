
import { createSlice } from "@reduxjs/toolkit";

const CounterSlice = createSlice({
    name:'CounterSlice',
    initialState:{value:0},
    reducers:{
        increment : (state)=>{state.value+=1},
        decrement : (state)=>{state.value-=1},
        reset : (state)=>{state.value=0}
    }
})

export default CounterSlice.reducer

export const{increment , decrement , reset} = CounterSlice.actions
