import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFeedbacks,
  getFeedbackById,
  addFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../services/feedbackServices";

export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetchFeedbacks",
  async (thunkAPI) => {
    try {
      const feedbacks = await getFeedbacks();
      return feedbacks;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addFeedbacks = createAsyncThunk(
  "feedback/addFeedbacks",
  async (feedback, thunkAPI) => {
    try {
      const response = await addFeedback(feedback);
      console.log(response, "response//addFeedbacks");

      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchFeedbackById = createAsyncThunk(
  "feedback/fetchFeedbackById",
  async (id, thunkAPI) => {
    try {
      const feedback = await getFeedbackById(id);
      console.log(feedback, "feedback//fetchFeedbackById");

      return feedback;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateFeedbacks = createAsyncThunk(
  "feedback/updateFeedbacks",
  async ({ id, feedback }, thunkAPI) => {
    try {
      console.log(feedback, "feedback//updateFeedbacks");
      const response = await updateFeedback(id, feedback);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteFeedbacks = createAsyncThunk(
  "feedback/deleteFeedbacks",
  async (id, thunkAPI) => {
    try {
      const response = await deleteFeedback(id);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    feedback: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    reset(state) {
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeedbackById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedback = action.payload;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks.push(action.payload.data);
      })
      .addCase(addFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.data;
      })
      .addCase(updateFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = state.feedbacks.map((feedback) => {
          console.log(
            feedback,
            "feedback",
            action.payload,
            "action.payload updated"
          );

          if (feedback.id === action.payload.data.id) {
            return {
              ...feedback,
              title: action.payload.data.title,
              platform: action.payload.data.platform,
              module: action.payload.data.module,
              description: action.payload.data.description,
              tags: action.payload.data.tags,
              attachment: action.payload.data.attachment,
            };
          }
          return feedback;
        });
      })
      .addCase(deleteFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload, "action.payload");
        state.feedbacks = state.feedbacks.filter((feedback) => {
          console.log(feedback.id, "feedback");
          return feedback.id !== parseInt(action.payload.id);
        });
      })
      .addCase(deleteFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = feedbackSlice.actions;
export default feedbackSlice.reducer;
