// modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState<T = unknown> {
  // Use generic type with a default of unknown
  isOpen: boolean;
  modalType: string | null;
  modalData?: T | null; // Generic modalData
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  modalData: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: <T>(
      state: ModalState<T>,
      action: PayloadAction<{ modalType: string; modalData?: T }>
    ) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.modalData = action.payload.modalData || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
