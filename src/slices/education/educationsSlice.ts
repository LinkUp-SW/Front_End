// src/store/educationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Education } from "@/types";

interface EducationState {
  items: Education[];
}

const initialState: EducationState = {
  items: [],
};

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    setEducations(state, action: PayloadAction<Education[]>) {
      state.items = action.payload;
    },
    addEducation(state, action: PayloadAction<Education>) {
      state.items.push(action.payload);
    },
    updateEducation(state, action: PayloadAction<Education>) {
      const idx = state.items.findIndex((e) => e._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeEducation(state, action: PayloadAction<string>) {
      state.items = state.items.filter((e) => e._id !== action.payload);
    },
  },
});

export const { setEducations, addEducation, updateEducation, removeEducation } =
  educationSlice.actions;
export default educationSlice.reducer;
