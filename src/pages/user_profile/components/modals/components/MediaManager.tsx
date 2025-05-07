import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MediaItem } from "./types";
import { toast } from "sonner";

interface MediaManagerProps {
  media: MediaItem[];
  setMedia: (media: MediaItem[]) => void;
  id: string;
}

const MediaManager: React.FC<MediaManagerProps> = ({ media, setMedia, id }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if the selected file is an image by its MIME type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        e.target.value = ""; // Clear the file input
        return; // Exit if it's not an image
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is a Base64 string with the media type prefix (e.g., data:image/png;base64,...)
        setPendingFile(reader.result as string);
      };
      reader.readAsDataURL(file);
      setTitle("");
      setDescription("");
      e.target.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeMedia = (mediaId: string) => {
    setMedia(media.filter((item) => item.id !== mediaId));
  };

  const handleCancel = () => {
    setPendingFile(null);
    setTitle("");
    setDescription("");
  };

  const handleApply = () => {
    if (!pendingFile) return;
    if (!title.trim()) return toast.error("Please Enter a title for the Media");
    const newMedia: MediaItem = {
      id: uuidv4(),
      media: pendingFile,
      title: title.trim(),
      description: description.trim(),
    };
    setMedia([...media, newMedia]);
    setPendingFile(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div id={`${id}-container`} className="flex flex-col gap-2 pt-5">
      <div id={`${id}-header`} className="flex items-center justify-between">
        <h2
          id={`${id}-title`}
          className="text-lg font-semibold text-gray-500 dark:text-gray-400"
        >
          Media
        </h2>
        <button
          id={`${id}-add-button`}
          type="button"
          onClick={handleButtonClick}
          className="flex items-center gap-1 text-blue-600 cursor-pointer border border-blue-600 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-300 hover:text-white dark:hover:text-gray-800 font-semibold transition-all duration-300 px-2 py-1 rounded-full dark:text-blue-400 text-sm"
        >
          <span>+</span>
          <span>Add media</span>
        </button>
        <input
          id={`${id}-file-input`}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Existing Media Items */}
      <div id={`${id}-media-items`} className="flex flex-wrap gap-2">
        {media.map((item) => (
          <div
            id={`${id}-media-item-${item.id}`}
            key={item.id}
            className="relative"
          >
            <img
              id={`${id}-media-image-${item.id}`}
              src={item.media}
              alt={item.title}
              className="w-20 h-20 object-cover rounded"
            />
            <button
              id={`${id}-remove-button-${item.id}`}
              type="button"
              onClick={() => removeMedia(item.id)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 cursor-pointer"
            >
              x
            </button>
            {item.title && (
              <p
                id={`${id}-media-title-${item.id}`}
                className="text-xs text-center mt-1"
              >
                {item.title}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Inline "Add Media" Panel */}
      {pendingFile && (
        <div
          id={`${id}-pending-panel`}
          className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800"
        >
          <h3 id={`${id}-pending-title`} className="text-md font-semibold mb-2">
            Add media details
          </h3>

          {/* Thumbnail Preview */}
          <div id={`${id}-thumbnail-preview`} className="mb-2">
            <img
              id={`${id}-thumbnail-image`}
              src={pendingFile}
              alt="Thumbnail"
              className="w-32 h-32 object-cover rounded"
            />
          </div>

          {/* Title (Required) */}
          <label
            id={`${id}-title-label`}
            className="block text-sm font-medium mb-1"
          >
            Title*
            <input
              id={`${id}-title-input`}
              className="mt-1 block w-full border p-2 rounded-md"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          {/* Description (Optional) */}
          <label
            id={`${id}-description-label`}
            className="block text-sm font-medium mt-3 mb-1"
          >
            Description (optional)
            <textarea
              id={`${id}-description-input`}
              className="mt-1 block w-full border p-2 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          {/* Action Buttons */}
          <div
            id={`${id}-action-buttons`}
            className="flex justify-end gap-2 mt-4"
          >
            <button
              id={`${id}-cancel-button`}
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 dark:text-white rounded-xl hover:bg-gray-300 text-black dark:hover:text-black cursor-pointer font-semibold transition-all duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              id={`${id}-apply-button`}
              type="button"
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 disabled:cursor-not-allowed text-white rounded-xl disabled:opacity-60 disabled:hover:bg-blue-600 hover:bg-blue-700 cursor-pointer font-semibold transition-all duration-300 ease-in-out"
              disabled={!title.trim()}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;
