import { openModal } from "@/slices/modal/modalSlice";

// Example utility function to convert an array of strings to lowercase
export const convertStringsArrayToLowerCase = (arr: string[]): string[] => {
  return arr.map((el) => el.toLocaleLowerCase());
};

// Annotate the function so TypeScript can infer the generic type properly.
export const handleOpenModalType = <T>(
  modalType: string,
  modalData: T|null=null
): ReturnType<typeof openModal> => {
  return openModal({ modalType, modalData });
};
