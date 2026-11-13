import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authentication/authSlice.js";
import forgetPasswordReducer from "../features/forgetPassword/forgetSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgetPassword: forgetPasswordReducer,
  },
});
