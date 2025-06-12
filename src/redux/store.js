// src/redux/store.js
import {configureStore} from '@reduxjs/toolkit';
import tasksReducer from './feature/tasksSlice';
import videoReducer from './feature/videoSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    videos: videoReducer,
  },
});
