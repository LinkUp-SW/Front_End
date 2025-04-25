// src/store/licenseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { License } from "@/types";

interface LicenseState {
  items: License[];
}

const initialState: LicenseState = {
  items: [],
};

const licenseSlice = createSlice({
  name: "license",
  initialState,
  reducers: {
    setLicenses(state, action: PayloadAction<License[]>) {
      state.items = action.payload;
    },
    addLicense(state, action: PayloadAction<License>) {
      state.items.push(action.payload);
    },
    updateLicense(state, action: PayloadAction<License>) {
      const idx = state.items.findIndex((l) => l._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeLicense(state, action: PayloadAction<string>) {
      state.items = state.items.filter((l) => l._id !== action.payload);
    },
  },
});

export const { setLicenses, addLicense, updateLicense, removeLicense } =
  licenseSlice.actions;
export default licenseSlice.reducer;
