import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

interface PostImagesProps {
  images: string[];
  isLandscape: boolean;
  className?: string;
}

const PostImages: React.FC<PostImagesProps> = ({
  images,
  isLandscape,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div
        className={`flex w-full h-auto gap-0.5 pl-4 pt-4 ${
          images.length === 1 && "justify-center"
        } ${isLandscape ? "flex-col pl-0" : "flex-row"} ${className}`}
      >
        {/* Main Image */}
        <div
          className={`${isLandscape ? "w-full" : "w-2/3"} ${
            images.length > 1 && "w-full"
          } cursor-pointer`}
          onClick={() => openModal(0)}
        >
          <img
            src={images[0]}
            alt="Main Post Image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Extra Images */}
        {images.length > 1 && (
          <div
            className={`flex ${
              isLandscape
                ? "flex-row w-full gap-0.5 mt-0.5"
                : "flex-col w-1/3 gap-0.5"
            } h-full`}
          >
            {images.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className={`${
                  isLandscape ? "flex-1 h-full" : "w-full flex-1"
                } relative cursor-pointer`}
                onClick={() => openModal(index + 1)}
              >
                <img
                  src={image}
                  alt={`Extra Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* "+X" Effect for Extra Images */}
                {index === 2 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center text-white text-lg font-medium">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTitle />
        <DialogDescription />
        <DialogContent className="max-w-7xl w-screen h-screen p-0 dark:bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-0 right-0 text-gray-300 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaTimes className="w-8 h-8" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 text-white bg-black z-10 p-3 hover:bg-black/50 rounded-full transition-colors"
                >
                  <FaArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 text-white bg-black z-10 p-3 hover:bg-black/50 rounded-full transition-colors"
                >
                  <FaArrowRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Current Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={images[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostImages;
