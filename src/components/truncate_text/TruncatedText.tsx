import React, { useEffect, useRef, useState } from "react";

interface TruncatedTextProps {
  content: string;
  lineCount?: number;
  id:string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  content,
  lineCount = 3,
  id
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncatedText, setTruncatedText] = useState<string>(content);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Helper function to measure if the text overflows the desired height.
  const doesOverflow = (text: string, maxHeight: number): boolean => {
    if (textRef.current) {
      textRef.current.innerText = text;
      return textRef.current.clientHeight > maxHeight;
    }
    return false;
  };

  useEffect(() => {
    // Only perform measurement when not expanded.
    if (textRef.current && !expanded) {
      // Get computed line height (fallback to 20px if not available)
      const computedStyle = window.getComputedStyle(textRef.current);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
      const maxHeight = lineCount * lineHeight;

      // Check if the full text already fits.
      if (doesOverflow(content, maxHeight)) {
        setIsTruncated(true);
        // Binary search to find the correct substring length.
        let start = 0;
        let end = content.length;
        let mid: number;
        let fitText = "";
        while (start <= end) {
          mid = Math.floor((start + end) / 2);
          const testText = content.substring(0, mid) + "...";
          if (doesOverflow(testText, maxHeight)) {
            end = mid - 1;
          } else {
            fitText = testText;
            start = mid + 1;
          }
        }
        setTruncatedText(fitText);
      } else {
        setIsTruncated(false);
      }
    }
  }, [content, expanded, lineCount]);

  return (
    <div>
      {/* Hidden element for measurement (off-screen) */}
      <p
        ref={textRef}
        id={id}
        className="text-sm whitespace-pre-wrap break-words invisible absolute -z-10"
      >
        {content}
      </p>

      <p className="text-sm whitespace-pre-wrap break-words">
        {expanded || !isTruncated ? content : truncatedText}
        {isTruncated && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-slate-500 hover:underline hover:text-blue-600 dark:hover:text-blue-400 dark:text-slate-400 hover:cursor-pointer inline ml-1"
          >
            {expanded ? "less" : "more"}
          </button>
        )}
      </p>
    </div>
  );
};

export default TruncatedText;
