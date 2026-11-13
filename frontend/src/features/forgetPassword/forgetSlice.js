import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
};

const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload.email;
    },
    removeEmail: (state, _) => {
      state.email = null;
    },
  },
});

export const { setEmail, removeEmail } = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;
