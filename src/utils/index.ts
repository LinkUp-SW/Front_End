import { openModal } from "../slices/modal/modalSlice";

export const convertStringsArrayToLowerCase = (arr: string[]) => {
  return arr.map((el) => el.toLocaleLowerCase());
};

export const handleOpenModalType = (modalType: string) => {
  return openModal(modalType);
};
