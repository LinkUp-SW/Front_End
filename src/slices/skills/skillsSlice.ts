// src/store/skillSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization, Skill } from "@/types";

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
    addExperienceToSkill(
      state,
      action: PayloadAction<{
        skillId: string;
        skillName: string;
        experience: Organization;
      }>
    ) {
      const { skillId, skillName, experience } = action.payload;
      const skill = state.items.find((s) => s._id === skillId);
      if (skill) {
        if (!skill.experiences) skill.experiences = [];
        if (!skill.experiences.some((exp) => exp._id === experience._id)) {
          skill.experiences.push(experience);
        }
      } else {
        state.items.push({
          _id: skillId,
          name: skillName,
          experiences: [experience],
          educations: [],
          licenses: [],
          total_endorsements: 0,
          endorsments: [],
        });
      }
    },
    addEducationToSkill(
      state,
      action: PayloadAction<{
        skillId: string;
        skillName: string;
        education: Organization;
      }>
    ) {
      const { skillId, skillName, education } = action.payload;
      const skill = state.items.find((s) => s._id === skillId);
      if (skill) {
        if (!skill.educations) skill.educations = [];
        if (!skill.educations.some((exp) => exp._id === education._id)) {
          skill.educations.push(education);
        }
      } else {
        state.items.push({
          _id: skillId,
          name: skillName,
          experiences: [],
          educations: [education],
          licenses: [],
          total_endorsements: 0,
          endorsments: [],
        });
      }
    },
    addLicenseToSkill(
      state,
      action: PayloadAction<{
        skillId: string;
        skillName: string;
        license: Organization;
      }>
    ) {
      const { skillId, skillName, license } = action.payload;
      const skill = state.items.find((s) => s._id === skillId);
      if (skill) {
        if (!skill.licenses) skill.licenses = [];
        if (!skill.licenses.some((exp) => exp._id === license._id)) {
          skill.licenses.push(license);
        }
      } else {
        state.items.push({
          _id: skillId,
          name: skillName,
          experiences: [],
          educations: [],
          licenses: [license],
          total_endorsements: 0,
          endorsments: [],
        });
      }
    },
    removeOrganizationFromSkills(
      state,
      action: PayloadAction<{ orgId: string }>
    ) {
      const { orgId } = action.payload;
      state.items.forEach((skill) => {
        const eduIdx = skill.educations.findIndex((e) => e._id === orgId);
        if (eduIdx !== -1) return skill.educations.splice(eduIdx, 1);

        const expIdx = skill.experiences.findIndex((e) => e._id === orgId);
        if (expIdx !== -1) return skill.experiences.splice(expIdx, 1);

        const licIdx = skill.licenses.findIndex((l) => l._id === orgId);
        if (licIdx !== -1) return skill.licenses.splice(licIdx, 1);
      });
    },
    updateEducationSkills(
      state,
      action: PayloadAction<{
        eduId: string;
        newSkills: {
          _id: string;
          name: string;
        }[];
      }>
    ) {
      const { eduId, newSkills } = action.payload;
      const educationSkillsIds = state.items
        .filter((skill) => skill.educations.some((edu) => edu._id === eduId))
        .map((skill) => skill._id);

      const newSkillsIds = newSkills.map((skill) => skill._id);
      newSkillsIds.forEach((newSkill) => {
        if (!educationSkillsIds.includes(newSkill)) {
          educationSkillsIds.push(newSkill);
        }
      });
      // const filteredEducationSkillsIds = educationSkillsIds.filter(
      //   (skillId) => {
      //     if (skillId) return newSkillsIds.includes(skillId); // Keep only the IDs that are in newSkillsIds
      //   }
      // );
    },
  },
});

export const {
  setSkills,
  addSkill,
  updateSkill,
  removeSkill,
  endorseSkill,
  addExperienceToSkill,
  addEducationToSkill,
  addLicenseToSkill,
  removeOrganizationFromSkills,
} = skillSlice.actions;
export default skillSlice.reducer;
