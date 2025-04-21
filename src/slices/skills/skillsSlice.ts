// src/store/skillSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Skill } from "@/types";

interface SkillState {
  items: Skill[];
}

const initialState: SkillState = {
  items: [],
};

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.items = action.payload;
    },
    addSkill(state, action: PayloadAction<Skill>) {
      state.items.push(action.payload);
    },
    updateSkill(state, action: PayloadAction<Skill>) {
      const idx = state.items.findIndex((s) => s._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.items = state.items.filter((s) => s._id !== action.payload);
    },
    // e.g. endorsement could be handled here:
    endorseSkill(
      state,
      action: PayloadAction<{
        skillId: string;
        endorsement: Skill["endorsments"][0];
      }>
    ) {
      const skill = state.items.find((s) => s._id === action.payload.skillId);
      if (skill) {
        skill.endorsments.push(action.payload.endorsement);
        skill.total_endorsements = (skill.total_endorsements || 0) + 1;
      }
    },
  },
});

export const { setSkills, addSkill, updateSkill, removeSkill, endorseSkill } =
  skillSlice.actions;
export default skillSlice.reducer;
