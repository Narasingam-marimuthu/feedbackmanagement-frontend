import { configureStore } from '@reduxjs/toolkit';
import feedbacReducer from '../features/feedback/feedbackSlice';
export const store = configureStore({
  reducer: {
    feedback: feedbacReducer,
  },
});
