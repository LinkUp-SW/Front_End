import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLinkPreview, LinkPreviewData } from "@/endpoints/feed";
import { FaGlobe } from "react-icons/fa";

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
          className={`flex items-center border dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 ${className}`}
        >
          <div className="h-[60px] w-[60px] flex-shrink-0">
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
          className={`flex items-center border dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 ${className}`}
        >
          <div className="p-3 flex items-center">
            <FaGlobe className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-blue-600 dark:text-blue-400 text-sm truncate">
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
        className={`flex items-center border dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 ${className}`}
      >
        {metadata.image ? (
          <div className="h-[60px] w-[60px] flex-shrink-0 bg-gray-100 dark:bg-gray-700">
            <img
              src={metadata.image}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.classList.add(
                  "flex",
                  "items-center",
                  "justify-center"
                );
                const icon = document.createElement("div");
                icon.innerHTML =
                  '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                (e.target as HTMLImageElement).parentElement!.appendChild(icon);
              }}
            />
          </div>
        ) : (
          <div className="h-[60px] w-[60px] flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {metadata.favicon ? (
              <img
                src={metadata.favicon}
                alt=""
                className="h-6 w-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                }}
              />
            ) : (
              <FaGlobe className="h-5 w-5 text-gray-400" />
            )}
          </div>
        )}

        <div className="p-3 flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
            {metadata.title}
          </h4>

          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {metadata.domain}
            </span>
          </div>
        </div>
      </a>
    );
  }
);

export default CompactLinkPreview;
