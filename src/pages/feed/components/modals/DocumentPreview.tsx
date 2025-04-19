const DocumentPreview: React.FC<{ currentSelectedMedia: File[] }> = ({
  currentSelectedMedia,
}) => {
  return (
    <>
      <div
        onClick={() => {
          const blobUrl = URL.createObjectURL(currentSelectedMedia[0]);
          window.open(blobUrl, "_blank");
        }}
        className="flex my-10 hover:cursor-pointer items-center justify-between p-4 mx-2 border dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700"
      >
        <div className="flex items-center gap-4">
          {/* File Details */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {currentSelectedMedia[0]?.name || "No file selected"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentSelectedMedia[0]
                ? `${(currentSelectedMedia[0].size / 1024).toFixed(2)} KB`
                : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPreview;
