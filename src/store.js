import { createSlice, configureStore } from "@reduxjs/toolkit";

const loginInitialState = { email: "", isLoggedIn: false };

const loginSlice = createSlice({
  name: "login",
  initialState: loginInitialState,
  reducers: {
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
});

export default store;
export const { updateEmail } = loginSlice.actions;
