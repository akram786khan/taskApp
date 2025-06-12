// // src/redux/tasksSlice.js
// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
//   const response = await axios.get(
//     'https://jsonplaceholder.typicode.com/todos',
//   );
//   return response.data;
// });

// const tasksSlice = createSlice({
//   name: 'tasks',
//   initialState: {
//     allTasks: [],
//     filter: 'all',
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setFilter: (state, action) => {
//       state.filter = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(fetchTasks.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.allTasks = action.payload;
//       })
//       .addCase(fetchTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export const {setFilter} = tasksSlice.actions;
// export default tasksSlice.reducer;

// tasksSlice.js

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Existing async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/todos?_limit=20',
  );
  return response.data;
});

export const addTask = createAsyncThunk('tasks/addTask', async newTask => {
  return {
    ...newTask,
    id: Date.now(), // local ID since there's no backend
  };
});

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({id, updates}) => {
    return {id, updates};
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    allTasks: [],
    loading: false,
    error: null,
    filter: 'all',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    // ✅ Local-only DELETE reducer
    deleteTask: (state, action) => {
      const idToDelete = action.payload;
      state.allTasks = state.allTasks.filter(task => task.id !== idToDelete);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.allTasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.allTasks.push(action.payload);
      })

      .addCase(editTask.fulfilled, (state, action) => {
        const {id, updates} = action.payload;
        const index = state.allTasks.findIndex(task => task.id === id);
        if (index !== -1) {
          state.allTasks[index] = updates;
        }
      });
  },
});

export const {setFilter, deleteTask} = tasksSlice.actions;
export default tasksSlice.reducer;
