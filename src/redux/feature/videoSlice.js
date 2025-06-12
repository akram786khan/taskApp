import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

export const fetchVideos = createAsyncThunk(
  'videos/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        'https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/14a27bd0bcd0cd323b35ad79cf3b493dddf6216b/videos.json',
      );
      await AsyncStorage.setItem('allVideoData', JSON.stringify(res.data));
      return res.data; // Ensure videos key is used
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch videos.');
    }
  },
);

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    items: [],
    loading: false,
    error: null,
    download: {}, // { id: path }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchVideos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default videoSlice.reducer;
