import { useEffect, useState } from "react";
import {
  deleteUserProfileImage,
  updateUserProfileImage,
} from "@/endpoints/userProfile";
import Cookies from "js-cookie";
import { FiEdit, FiTrash } from "react-icons/fi";
import { LuImageUp } from "react-icons/lu";
import { LiaSaveSolid } from "react-icons/lia";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import fileToBase64, { compressDataUrl, getDataBlob } from "@/utils";
import ImageEditor from "@/components/image_editor/ImageEditor";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // Adjust the import path to your store type
import { editUserBio } from "@/slices/user_profile/userBioSlice";
import { useFormStatus } from "@/hooks/useFormStatus";
import { defaultProfileImage } from "@/constants";

const ProfilePictureModal = ({
  src,
  setPic,
  setIsOpen,
}: {
  src: string;
  setPic: (img: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const token = Cookies.get("linkup_auth_token");
  const [profilePic, setProfilePic] = useState(src);
  const [showEditor, setShowEditor] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userBio = useSelector((state: RootState) => state.userBio.data);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  useEffect(() => {
    if (userBio?.is_default_profile_photo || src === null) {
      setEditedImage(null);
    } else {
      getDataBlob(src)
        .then((data) => {
          setEditedImage(data);
          setUploadedImage(data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const onEdit = async () => {
    try {
      const imageBase64 = await getDataBlob(src);
      setProfilePic(imageBase64);
      setShowEditor(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleFileSelect = async (file: File) => {
    const fileBase64 = await fileToBase64(file);
    setEditedImage(fileBase64);
    setUploadedImage(fileBase64);
    setShowEditor(true);
  };

  const onUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024)
          return toast.error("Image is larger than 2MB");
        handleFileSelect(file);
      }
    };

    fileInput.click();
  };

  const onSave = async () => {
    startSubmitting();
    try {
      const imageToSave = editedImage || profilePic;

      if (!imageToSave) {
        toast.error("No image to save");
        return;
      }

      const compressedBlob = await compressDataUrl(imageToSave, 800, 800, 0.7);

      // 2. wrap in a File
      const file = new File([compressedBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      // Wrap the signin method with toast.promise for success/error handling
      const toastResult = toast.promise(
        updateUserProfileImage(token as string, file), // Using the axios signin method
        {
          loading: "Updating Image...",
        }
      );

      // Await the result of the toast promise
      const data = await toastResult.unwrap();
      toast.success(data.message);
      setShowEditor(false);
      setEditedImage(null);
      setProfilePic(data.profilePicture || imageToSave);
      setPic(data.profilePicture || imageToSave);
      dispatch(
        editUserBio({
          ...userBio,
          is_default_profile_photo: false,
          profile_photo: data.profilePicture,
        })
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error(getErrorMessage(error));
    } finally {
      stopSubmitting();
    }
  };

  const onDelete = async () => {
    startSubmitting();
    try {
      // Wrap the signin method with toast.promise for success/error handling
      const toastResult = toast.promise(
        deleteUserProfileImage(token as string), // Using the axios signin method
        {
          loading: "Deleting Image...",
        }
      );

      // Await the result of the toast promise
      const data = await toastResult.unwrap();

      toast.success(data.message);
      setIsOpen(false);
      setPic(data.profilePicture);
      dispatch(
        editUserBio({
          ...userBio,
          is_default_profile_photo: true,
          profile_photo: data.profilePicture,
        })
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      stopSubmitting();
    }
  };

  return (
    <div
      id="profile-picture-modal"
      className="grid w-full gap-4 place-items-center"
    >
      {showEditor ? (
        <div id="image-editor-container" className="animate-fade-in-up w-full">
          <ImageEditor
            sourceImage={uploadedImage as string}
            onSave={(dataUrl) => {
              setEditedImage(dataUrl);
              setProfilePic(dataUrl);
            }}
            onClose={() => {
              setShowEditor(false);
            }}
            onCancel={() => {
              setShowEditor(false);
              setEditedImage(null);
              setUploadedImage(profilePic);
            }}
          />
        </div>
      ) : (
        <>
          <div id="profile-image-container" className="relative group">
            <img
              id="profile-image"
              src={editedImage || profilePic || defaultProfileImage}
              alt="Profile"
              className="w-40 h-40 md:w-56 md:h-56 rounded-full ring-4 ring-gray-200 dark:ring-gray-600 transition-all duration-300"
            />
          </div>
          <div
            id="profile-actions"
            className="flex flex-grow flex-wrap w-full items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300"
          >
            <button
              id="edit-button"
              disabled={
                ((userBio?.is_default_profile_photo || src === null) &&
                  editedImage === null) ||
                isSubmitting
              }
              onClick={onEdit}
              className="flex disabled:opacity-65 cursor-not-allowed items-center flex-grow gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <FiEdit className="w-5 h-5" />
              <span className="text-sm font-medium">Edit</span>
            </button>

            <button
              id="upload-button"
              onClick={onUpload}
              className="flex flex-grow items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
            >
              <LuImageUp className="w-5 h-5" />
              <span className="text-sm font-medium">Upload Photo</span>
            </button>

            <button
              id="delete-button"
              disabled={
                userBio?.is_default_profile_photo || isSubmitting || !src
              }
              onClick={onDelete}
              className="flex flex-grow disabled:opacity-65 cursor-not-allowed items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
            >
              <FiTrash className="w-5 h-5" />
              <span className="text-sm font-medium">Delete</span>
            </button>

            <button
              id="save-button"
              onClick={onSave}
              disabled={
                isSubmitting ||
                (!editedImage && userBio?.is_default_profile_photo) ||
                (!editedImage && !src)
              }
              className="flex flex-grow disabled:opacity-65 cursor-not-allowed items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <LiaSaveSolid className="w-5 h-5" />
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePictureModal;
