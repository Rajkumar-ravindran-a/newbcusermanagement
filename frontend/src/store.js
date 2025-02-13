import { configureStore } from '@reduxjs/toolkit'
import profilereducer from './redux/popups/PopupsSlice'

export const store = configureStore({
  reducer: {
    profile : profilereducer
  },
})