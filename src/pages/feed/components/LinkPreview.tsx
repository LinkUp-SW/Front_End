import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaGlobe, FaExternalLinkAlt } from "react-icons/fa";
import { fetchLinkPreview, LinkPreviewData } from "@/endpoints/feed";

interface LinkPreviewProps {
  url: string;
  className?: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, className }) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<LinkPreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPreviewData = async () => {
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchLinkPreview(url);
        setMetadata(data);
      } catch (err) {
        console.error("Error fetching link preview:", err);
        setError("Could not load link preview");
      } finally {
        setLoading(false);
      }
    };

    getPreviewData();
  }, [url]);

  if (loading) {
    return (
      <div
        className={`border  dark:border-gray-700 rounded-lg overflow-hidden shadow-sm ${className}`}
      >
        <div className="h-40 w-full">
          <Skeleton className="h-full w-full dark:bg-gray-700 bg-gray-200" />
        </div>
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4 dark:bg-gray-700 bg-gray-200" />
          <Skeleton className="h-4 w-full dark:bg-gray-700 bg-gray-200" />
          <div className="flex items-center mt-2">
            <Skeleton className="h-4 w-4 rounded-full mr-2 dark:bg-gray-700 bg-gray-200" />
            <Skeleton className="h-3 w-1/3 dark:bg-gray-700 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block border dark:border-gray-700 rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition ${className}`}
      >
        <div className="p-4 flex items-center">
          <FaGlobe className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-blue-600 dark:text-blue-400 break-all">{url}</p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border mt-5 dark:border-gray-700 rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm ${className}`}
    >
      {metadata.image && (
        <div className="h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={metadata.image}
            alt="Link preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
          {metadata.title}
        </h3>

        {metadata.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
            {metadata.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            {metadata.favicon ? (
              <img
                src={metadata.favicon}
                alt=""
                className="h-4 w-4 mr-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <FaGlobe className="h-4 w-4 text-gray-400 mr-2" />
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              {metadata.domain}
            </span>
          </div>
          <FaExternalLinkAlt className="h-3 w-3 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
