import { createReducer } from "@reduxjs/toolkit"
import { login, logout } from "./actions"

const initialState = {
  user: null,
}

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.user = action.payload
    })
    .addCase(logout, (state, action) => {
      state.user = null
    })
})
