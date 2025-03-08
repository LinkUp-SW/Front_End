import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  alumniCount: number;
}

interface JobsState {
  list: Job[];
}

const initialState: JobsState = {
  list: [],
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setJobs } = jobsSlice.actions;
export default jobsSlice.reducer;
