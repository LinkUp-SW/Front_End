// src/store/experienceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Experience } from "@/types";

interface ExperienceState {
  items: Experience[];
}

const initialState: ExperienceState = {
  items: [],
};

const experienceSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    setExperiences(state, action: PayloadAction<Experience[]>) {
      state.items = action.payload;
    },
    addExperience(state, action: PayloadAction<Experience>) {
      state.items.push(action.payload);
    },
    updateExperience(state, action: PayloadAction<Experience>) {
      const idx = state.items.findIndex((x) => x._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeExperience(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x._id !== action.payload);
    },
  },
});

export const {
  setExperiences,
  addExperience,
  updateExperience,
  removeExperience,
} = experienceSlice.actions;
export default experienceSlice.reducer;
