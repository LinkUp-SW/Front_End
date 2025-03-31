import { getUserBio } from "@/endpoints/userProfile";
import { UserProfileBio } from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface UserBioState {
  isLoading: boolean;
  error: AxiosError | null;
  data: UserProfileBio | null;
}

const initialState: UserBioState = {
  isLoading: false,
  data: null,
  error: null,
};

interface FetchUserBioPayload {
  token: string;
  userId: string;
}

// Here we add a rejectValue generic option so that our thunk
// returns an AxiosError on failure.
export const fetchUserBio = createAsyncThunk<
  UserProfileBio,
  FetchUserBioPayload,
  { rejectValue: AxiosError }
>("fetchUserBio", async ({ token, userId }, thunkAPI) => {
  try {
    const response = await getUserBio(token, userId);
    return response;
  } catch (err) {
    // Cast the error to AxiosError and reject with its value.
    const error = err as AxiosError;
    return thunkAPI.rejectWithValue(error);
  }
});

export const refetchUserBio = createAsyncThunk<
  UserProfileBio,
  FetchUserBioPayload,
  { rejectValue: AxiosError }
>("refetchUserBio", async ({ token, userId }, thunkAPI) => {
  try {
    const response = await getUserBio(token, userId);
    return response;
  } catch (err) {
    const error = err as AxiosError;
    return thunkAPI.rejectWithValue(error);
  }
});

const userBioSlice = createSlice({
  name: "userBio",
  initialState,
  reducers: {
    // Synchronous actions to clear error or reset data.
    clearError(state) {
      state.error = null;
    },
    resetUserBio(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handlers for fetchUserBio
    builder.addCase(fetchUserBio.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserBio.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchUserBio.rejected, (state, action) => {
      state.isLoading = false;
      // Use the rejected value if available, otherwise cast the error.
      state.error = action.payload ? action.payload : (action.error as unknown as AxiosError);
    });

    // Handlers for refetchUserBio
    builder.addCase(refetchUserBio.pending, (state) => {
      state.isLoading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(refetchUserBio.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(refetchUserBio.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload ? action.payload : (action.error as unknown as AxiosError);
    });
  },
});

export const { clearError, resetUserBio } = userBioSlice.actions;
export default userBioSlice.reducer;
