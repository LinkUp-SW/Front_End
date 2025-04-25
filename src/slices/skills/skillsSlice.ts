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
        education: Organization;
        newSkills: {
          _id: string;
          name: string;
        }[];
      }>
    ) {
      const { education, newSkills } = action.payload;
      const newSkillIds = newSkills.map((skill) => skill._id);

      // Find current skills associated with this education
      const oldSkillIds = state.items
        .filter((skill) =>
          skill.educations.some((edu) => edu._id === education._id)
        )
        .map((skill) => skill._id);

      // Skills to which we need to add the education
      const toAdd = newSkillIds.filter((id) => !oldSkillIds.includes(id));
      // Skills from which we need to remove the education
      const toRemove = oldSkillIds.filter(
        (id) => !newSkillIds.includes(id as string)
      );

      // Remove education from skills no longer associated
      state.items.forEach((skill) => {
        if (toRemove.includes(skill._id)) {
          skill.educations = skill.educations.filter(
            (edu) => edu._id !== education._id
          );
        }
      });

      // Add education to existing skills
      state.items.forEach((skill) => {
        if (toAdd.includes(skill._id as string)) {
          if (!skill.educations) skill.educations = [];
          // Avoid duplicates
          if (!skill.educations.some((edu) => edu._id === education._id)) {
            skill.educations.push(education);
          }
        }
      });

      // Add new skill entries for any newSkills not already in state
      newSkills.forEach((skillData) => {
        if (!state.items.some((skill) => skill._id === skillData._id)) {
          state.items.push({
            _id: skillData._id,
            name: skillData.name,
            experiences: [],
            educations: [education],
            licenses: [],
            total_endorsements: 0,
            endorsments: [],
          });
        }
      });
    },
    updateExperienceSkills(
      state,
      action: PayloadAction<{
        experience: Organization;
        newSkills: {
          _id: string;
          name: string;
        }[];
      }>
    ) {
      const { experience, newSkills } = action.payload;
      const newSkillIds = newSkills.map((skill) => skill._id);

      // Find current skills associated with this experience
      const oldSkillIds = state.items
        .filter((skill) =>
          skill.experiences.some((exp) => exp._id === experience._id)
        )
        .map((skill) => skill._id);

      // Skills to which we need to add the education
      const toAdd = newSkillIds.filter((id) => !oldSkillIds.includes(id));
      // Skills from which we need to remove the education
      const toRemove = oldSkillIds.filter(
        (id) => !newSkillIds.includes(id as string)
      );

      // Remove education from skills no longer associated
      state.items.forEach((skill) => {
        if (toRemove.includes(skill._id)) {
          skill.educations = skill.educations.filter(
            (exp) => exp._id !== experience._id
          );
        }
      });

      // Add education to existing skills
      state.items.forEach((skill) => {
        if (toAdd.includes(skill._id as string)) {
          if (!skill.experiences) skill.experiences = [];
          // Avoid duplicates
          if (!skill.experiences.some((edu) => edu._id === experience._id)) {
            skill.experiences.push(experience);
          }
        }
      });

      // Add new skill entries for any newSkills not already in state
      newSkills.forEach((skillData) => {
        if (!state.items.some((skill) => skill._id === skillData._id)) {
          state.items.push({
            _id: skillData._id,
            name: skillData.name,
            experiences: [experience],
            educations: [],
            licenses: [],
            total_endorsements: 0,
            endorsments: [],
          });
        }
      });
    },
    updateLicenseSkills(
      state,
      action: PayloadAction<{
        license: Organization;
        newSkills: {
          _id: string;
          name: string;
        }[];
      }>
    ) {
      const { license, newSkills } = action.payload;
      const newSkillIds = newSkills.map((skill) => skill._id);

      // Find current skills associated with this license
      const oldSkillIds = state.items
        .filter((skill) =>
          skill.licenses.some((edu) => edu._id === license._id)
        )
        .map((skill) => skill._id);

      // Skills to which we need to add the license
      const toAdd = newSkillIds.filter((id) => !oldSkillIds.includes(id));
      // Skills from which we need to remove the license
      const toRemove = oldSkillIds.filter(
        (id) => !newSkillIds.includes(id as string)
      );

      // Remove license from skills no longer associated
      state.items.forEach((skill) => {
        if (toRemove.includes(skill._id)) {
          skill.licenses = skill.licenses.filter(
            (edu) => edu._id !== license._id
          );
        }
      });

      // Add license to existing skills
      state.items.forEach((skill) => {
        if (toAdd.includes(skill._id as string)) {
          if (!skill.licenses) skill.licenses = [];
          // Avoid duplicates
          if (!skill.licenses.some((edu) => edu._id === license._id)) {
            skill.licenses.push(license);
          }
        }
      });

      // Add new skill entries for any newSkills not already in state
      newSkills.forEach((skillData) => {
        if (!state.items.some((skill) => skill._id === skillData._id)) {
          state.items.push({
            _id: skillData._id,
            name: skillData.name,
            experiences: [],
            educations: [],
            licenses: [license],
            total_endorsements: 0,
            endorsments: [],
          });
        }
      });
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
  updateEducationSkills,
  updateExperienceSkills,
  updateLicenseSkills,
} = skillSlice.actions;
export default skillSlice.reducer;
