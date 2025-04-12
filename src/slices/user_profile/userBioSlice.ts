import { getUserBio } from "@/endpoints/userProfile";
import { UserProfileBio } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface UserBioState {
  loading: boolean;
  error: AxiosError | null;
  data: UserProfileBio | null;
}

const initialState: UserBioState = {
  loading: false,
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
    // New action to edit/update user bio fields in the state.
    editUserBio(state, action: PayloadAction<Partial<UserProfileBio>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Handlers for fetchUserBio
    builder.addCase(fetchUserBio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserBio.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchUserBio.rejected, (state, action) => {
      state.loading = false;
      // Use the rejected value if available, otherwise cast the error.
      state.error = action.payload
        ? action.payload
        : (action.error as unknown as AxiosError);
    });

    // Handlers for refetchUserBio
    builder.addCase(refetchUserBio.pending, (state) => {
      state.loading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(refetchUserBio.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(refetchUserBio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload
        ? action.payload
        : (action.error as unknown as AxiosError);
    });
  },
});

export const { clearError, resetUserBio, editUserBio } = userBioSlice.actions;
export default userBioSlice.reducer;
