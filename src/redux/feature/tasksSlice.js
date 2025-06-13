import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Toast from "react-native-toast-message";
// Existing async thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=20"
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      Toast.show({
        type: "error",
        text1: err.message,
        text2: err.message,
      });
      const status = err.response?.status;
      return thunkAPI.rejectWithValue({ message, status });
    }
  }
);

export const addTask = createAsyncThunk("tasks/addTask", async (newTask) => {
  return {
    ...newTask,
    id: Date.now(), // local ID since there's no backend
  };
});

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, updates }) => {
    return { id, updates };
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    allTasks: [],
    loading: false,
    error: null,
    filter: "all",
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    // ✅ Local-only DELETE reducer
    deleteTask: (state, action) => {
      const idToDelete = action.payload;
      state.allTasks = state.allTasks.filter((task) => task.id !== idToDelete);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = { message: null, status: null };
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.allTasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error = payload
          ? { message: payload.message, status: payload.status }
          : { message: action.error.message, status: null };
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.allTasks.push(action.payload);
      })

      .addCase(editTask.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const index = state.allTasks.findIndex((task) => task.id === id);
        if (index !== -1) {
          state.allTasks[index] = updates;
        }
      });
  },
});

export const { setFilter, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
