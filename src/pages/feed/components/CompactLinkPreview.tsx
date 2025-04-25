import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLinkPreview, LinkPreviewData } from "@/endpoints/feed";

interface CompactLinkPreviewProps {
  url: string;
  className?: string;
}

const CompactLinkPreview: React.FC<CompactLinkPreviewProps> = React.memo(
  ({ url, className }) => {
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState<LinkPreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
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

      fetchData();
    }, [url]);

    if (loading) {
      return (
        <div
          className={`flex items-center border dark:border-gray-700 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800 ${className}`}
        >
          <div className="h-16 w-16 flex-shrink-0">
            <Skeleton className="h-full w-full dark:bg-gray-700 bg-gray-200" />
          </div>
          <div className="p-2 flex-1">
            <Skeleton className="h-4 w-3/4 dark:bg-gray-700 bg-gray-200 mb-1" />
            <Skeleton className="h-3 w-1/2 dark:bg-gray-700 bg-gray-200" />
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
          className={`flex items-center border dark:border-gray-700 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        >
          <div className="p-3">
            <span className="text-blue-600 dark:text-blue-400 text-sm">
              {url}
            </span>
          </div>
        </a>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex mt-5 items-start border dark:border-gray-700 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      >
        {metadata.image && (
          <div className="h-16 w-16 flex-shrink-0">
            <img
              src={metadata.image}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className="p-3 flex-1">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
            {metadata.title}
          </h4>

          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {metadata.domain || new URL(url).hostname.replace("www.", "")}
            </span>
          </div>
        </div>
      </a>
    );
  }
);

export default CompactLinkPreview;
