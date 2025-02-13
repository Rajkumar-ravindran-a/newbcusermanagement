import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const profileSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    open : (state) => {
      state.value = true
    },
    close : (state) => {
      state.value = false
    },
    toggle : (state) => {
      state.value = !state.value
    } 
  },
})

// Action creators are generated for each case reducer function
export const { open, close, toggle } = profileSlice.actions

export default profileSlice.reducer