// CoverPictureModal.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { getCroppedImg, getDataBlob } from "@/utils"; // helper to perform cropping via canvas
import {
  updateUserCoverPhoto,
  deleteUserCoverPhoto,
} from "@/endpoints/userProfile";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useFormStatus } from "@/hooks/useFormStatus";
import { FiEdit, FiTrash } from "react-icons/fi";
import { LuImageUp } from "react-icons/lu";
import { LiaSaveSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { editUserBio } from "@/slices/user_profile/userBioSlice";

type CoverPictureModalProps = {
  src: string; // initial cover photo URL
  setCover: (img: string) => void; // callback to update the cover photo in parent
  setIsOpen: (isOpen: boolean) => void; // callback to close the modal
};

const CoverPictureModal: React.FC<CoverPictureModalProps> = ({
  src,
  setCover,
  setIsOpen,
}) => {
  const token = Cookies.get("linkup_auth_token");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  // Change initial state from an empty string to null so we don't pass an empty src.
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editableImage, setEditableImage] = useState<string | null>(null);
  // Edit mode toggle. When false the component shows only the preview.
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Cropping state.
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Hidden file input ref.
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const userBio = useSelector((state: RootState) => state.userBio.data);

  // On mount (or when src changes) load the image from src and convert it to base64.
  useEffect(() => {
    const loadInitialImage = async () => {
      if (src) {
        try {
          const base64 = await getDataBlob(src);
          setPreviewImage(base64);
          setEditableImage(base64);
        } catch (error) {
          console.error("Error loading initial image:", error);
          toast.error("Failed to load the current image.");
        }
      }
    };
    loadInitialImage();
  }, [src]);

  // Handle file selection (via the Upload New button).
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type.
      if (!file.type.startsWith("image/")) {
        toast.error("Selected file is not a valid image.");
        return;
      }
      // Validate file size (limit: 5MB).
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds the maximum limit (5MB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setEditableImage(result);
        // Automatically enable edit mode when a new image is selected.
        if (!isEditing) {
          setIsEditing(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Cropper callback – updates the cropping area.
  const onCropComplete = useCallback((_: Area, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  // Handle saving the cropped image.
  const handleSave = async () => {
    if (editableImage && croppedAreaPixels) {
      try {
        startSubmitting();
        // Generate cropped image URL from the editable image using the crop area.
        const croppedImageUrl = await getCroppedImg(
          editableImage,
          croppedAreaPixels
        );
        // Convert the cropped image URL to a blob and then wrap it as a File.
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "cover.jpg", { type: "image/jpeg" });

        // Call the backend update endpoint.
        const data = await updateUserCoverPhoto(token as string, file);
        toast.success(data.message || "Cover photo updated successfully.");
        dispatch(
          editUserBio({
            ...userBio,
            is_defult_cover_photo: false,
            profile_photo: data.coverPhoto,
          })
        );
        // Update the preview image and propagate the change to parent.
        setPreviewImage(data.coverPhoto || croppedImageUrl);
        setCover(data.coverPhoto || croppedImageUrl);
        // Exit edit mode and close the modal.
        setIsEditing(false);
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating cover photo:", error);
        toast.error("Failed to update cover photo.");
      } finally {
        stopSubmitting();
      }
    } else {
      toast.error("Please adjust cropping before saving.");
    }
  };

  // Cancel editing and revert to the previous preview image.
  const handleCancel = () => {
    setEditableImage(previewImage);
    setIsEditing(false);
  };

  // Handle deletion of the current cover photo.
  const handleDelete = async () => {
    try {
      startSubmitting();
      const data = await deleteUserCoverPhoto(token as string);
      toast.success(data.message || "Cover photo deleted successfully.");
      // Update the preview image after deletion (could be a default cover image).
      setPreviewImage(data.coverPhoto || null);
      setCover(data.coverPhoto || null);
      setIsOpen(false);
      dispatch(
        editUserBio({
          ...userBio,
          is_defult_cover_photo: true,
          profile_photo: data.coverPhoto,
        })
      );
    } catch (error) {
      console.error("Error deleting cover photo:", error);
      toast.error("Failed to delete cover photo.");
    } finally {
      stopSubmitting();
    }
  };

  return (
    <div id="cover-picture-modal" className="w-full">
      {/* Preview or Editing View */}
      {!isEditing ? (
        // Preview Mode: show the full-width image only if previewImage exists.
        <div className="w-full">
          {previewImage && (
            <img
              src={previewImage}
              alt="Cover Preview"
              className="w-full aspect-[4/1] object-cover"
            />
          )}
        </div>
      ) : (
        // Editing Mode: display the cropping UI.
        <div className="relative w-full h-64 overflow-hidden bg-transparent">
          {editableImage && (
            <Cropper
              image={editableImage}
              crop={crop}
              zoom={zoom}
              aspect={4 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="cover"
              restrictPosition={true}
            />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        {isEditing ? (
          <>
            {/* Allow uploading a new image while editing */}
            <Button
              variant="ghost"
              onClick={() => inputRef.current?.click()}
              disabled={isSubmitting}
              id="upload-cover-photo-btn"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-500 transition-colors duration-200"
            >
              <LuImageUp className="w-5 h-5" />
              Upload New
            </Button>
            <Button
              className="affimativeBtn flex gap-2"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              <LiaSaveSolid className="w-5 h-5" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              id="cancel-btn"
              className="destructiveBtn"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting || userBio?.is_defult_cover_photo}
              id="edit-cover-photo-btn"
              className="flex disabled:opacity-65 cursor-not-allowed items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500 transition-colors duration-200"
            >
              <FiEdit className="w-5 h-5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              id="upload-cover-photo-btn"
              onClick={() => inputRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-500 transition-colors duration-200"
            >
              <LuImageUp className="w-5 h-5" />
              Upload New
            </Button>
            {/* Delete button (always visible) */}
            <Button
              variant="destructive"
              onClick={handleDelete}
              id="delete-cover-photo-btn"
              disabled={isSubmitting || userBio?.is_defult_cover_photo}
              className="destructiveBtn flex gap-2"
            >
              <FiTrash className="w-5 h-5" />
              Delete
            </Button>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        id="upload-cover-photo-input"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default CoverPictureModal;
