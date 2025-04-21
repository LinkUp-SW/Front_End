// src/store.ts

import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme/themeSlice"; // Import theme slice
import screenReducer from "./slices/screen/screenSlice"; // Import the slice
import jobsReducer from "./slices/jobs/jobsSlice";
import messagingReducer from "./slices/messaging/messagingSlice";
import modalReducer from "./slices/modal/modalSlice";
import userBioReducer from "./slices/user_profile/userBioSlice";
import educationReducer from "./slices/education/educationsSlice";
import licenseReducer from "./slices/license/licensesSlice";
import skillReducer from "./slices/skills/skillsSlice";
import experienceReducer from "./slices/experience/experiencesSlice";
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
    education: educationReducer,
    license: licenseReducer,
    skill: skillReducer,
    experience: experienceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
