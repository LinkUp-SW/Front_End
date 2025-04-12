import React from "react";

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
  if (!images || images.length === 0) return null;

  return (
    <div
      className={`flex w-full h-auto gap-0.5 pl-4 pt-4 ${
        images.length === 1 && "justify-center"
      } ${isLandscape ? "flex-col pl-0" : "flex-row"} ${className}`}
    >
      {/* Main Image */}
      <div
        className={`${isLandscape ? "w-full" : "w-2/3"} ${
          images.length > 1 && "w-full"
        }`}
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
              } relative`}
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
  );
};

export default PostImages;
