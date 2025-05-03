// src/store.ts

import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme/themeSlice"; // Import theme slice
import screenReducer from "./slices/screen/screenSlice"; // Import the slice
import jobsReducer from "./slices/jobs/jobsSlice";
import messagingReducer from "./slices/messaging/messagingSlice";
import modalReducer from "./slices/modal/modalSlice";
import userBioReducer from "./slices/user_profile/userBioSlice";
import postsReducer from "./slices/feed/postsSlice";
import educationReducer from "./slices/education/educationsSlice";
import licenseReducer from "./slices/license/licensesSlice";
import skillReducer from "./slices/skills/skillsSlice";
import experienceReducer from "./slices/experience/experiencesSlice";
import dialogSlice from "./slices/feed/createPostSlice";
// For now, we’ll set up an empty reducer. Later, you can add slices or combine reducers.
export const store = configureStore({
  reducer: {
    // Add your reducers here
    theme: themeReducer,
    screen: screenReducer,
    jobs: jobsReducer,
    modal: modalReducer,
    messaging: messagingReducer,
    userBio: userBioReducer,
    posts: postsReducer,
    education: educationReducer,
    license: licenseReducer,
    skill: skillReducer,
    experience: experienceReducer,
    createPost: dialogSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore all actions from license/addLicense and that slice’s state
        ignoredActions: [
          "license/addLicense",
          "license/updateLicense",
          "education/addEducation",
          "education/updateEducation",
          "experience/addExperience",
          "experience/updateExperience",
          "skill/addLicenseToSkill",
        ],
        ignoredPaths: [
          "license.items",
          "education.items",
          "experience.items",
          "skill.items",
          'messaging.message.timestamp'
        ],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
