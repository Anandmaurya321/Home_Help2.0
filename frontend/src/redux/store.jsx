

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authRedux'

export const store = configureStore({
  reducer: {
    auth: authReducer, // you can access it via state.auth
  },
});

