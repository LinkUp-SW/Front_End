import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MediaItem } from "../types";

interface MediaManagerProps {
  media: MediaItem[];
  setMedia: (media: MediaItem[]) => void;
}

const MediaManager: React.FC<MediaManagerProps> = ({ media, setMedia }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPendingFile(file);
      setTitle("");
      setDescription("");
      e.target.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeMedia = (id: string) => {
    setMedia(media.filter((item) => item.id !== id));
  };

  const handleCancel = () => {
    setPendingFile(null);
    setTitle("");
    setDescription("");
  };

  const handleApply = () => {
    if (!pendingFile) return;
    const newMedia: MediaItem = {
      id: uuidv4(),
      file: pendingFile,
      title: title.trim(),
      description: description.trim(),
    };
    setMedia([...media, newMedia]);
    setPendingFile(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="flex flex-col gap-2 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          Media
        </h2>
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex items-center gap-1 text-blue-600 cursor-pointer border border-blue-600 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-300 hover:text-white dark:hover:text-gray-800 font-semibold transition-all duration-300 px-2 py-1 rounded-full dark:text-blue-400 text-sm"
        >
          <span>+</span>
          <span>Add media</span>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Existing Media Items */}
      <div className="flex flex-wrap gap-2">
        {media.map((item) => (
          <div key={item.id} className="relative">
            <img
              src={URL.createObjectURL(item.file)}
              alt={item.title}
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeMedia(item.id)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2"
            >
              x
            </button>
            {item.title && (
              <p className="text-xs text-center mt-1">{item.title}</p>
            )}
          </div>
        ))}
      </div>

      {/* Inline "Add Media" Panel */}
      {pendingFile && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h3 className="text-md font-semibold mb-2">Add media details</h3>

          {/* Thumbnail Preview */}
          <div className="mb-2">
            <img
              src={URL.createObjectURL(pendingFile)}
              alt="Thumbnail"
              className="w-32 h-32 object-cover rounded"
            />
          </div>

          {/* Title (Required) */}
          <label className="block text-sm font-medium mb-1">
            Title*
            <input
              className="mt-1 block w-full border p-2 rounded-md"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          {/* Description (Optional) */}
          <label className="block text-sm font-medium mt-3 mb-1">
            Description (optional)
            <textarea
              className="mt-1 block w-full border p-2 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 dark:text-white rounded-xl hover:bg-gray-300 text-black dark:hover:text-black cursor-pointer font-semibold transition-all duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer font-semibold transition-all duration-300 ease-in-out"
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
