import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null, // Token ko localStorage se bhi check kar lete hain
  isLoggedIn: localStorage.getItem('token') ? true : false,
};

export const authSlice = createSlice({
    name:'auth',
    initialState , 
    reducers:{
        loginUser : (state , action)=>{
          state.user = action.payload.user,
          state.token = action.payload.token,
          state.isLoggedIn = true
          localStorage.setItem('isLoggedIn' , 'true')
        },
        logoutUser : (state )=>{ //no need to pass any parameter:: 
          state.user = null,
          state.token = null,
          state.isLoggedIn = false
          localStorage.clear();
          console.log('user is logout by redux')
        }
    }
})

export const{loginUser , logoutUser} = authSlice.actions;


// exporting in default form :::
export default authSlice.reducer;  



