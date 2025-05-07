import React, { JSX, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface TruncatedTextProps {
  content: string;
  id: string;
  lineCount?: number;
  hideLinks?: boolean;
  limitHeight?: boolean;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  content,
  id,
  lineCount = 3,
  hideLinks = false,
  limitHeight = false,
  className,
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncatedText, setTruncatedText] = useState<string>(content);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Helper function to measure if the text overflows the desired height
  const doesOverflow = (text: string, maxHeight: number): boolean => {
    if (textRef.current) {
      textRef.current.innerHTML = text;
      return textRef.current.clientHeight > maxHeight;
    }
    return false;
  };

  // Create HTML-safe version for measurement
  const createMeasurementHTML = (text: string): string => {
    return (
      text
        // Preserve URLs by replacing them with placeholder text of the same length
        ?.replace(/https?:\/\/[^\s]+/g, (url) => {
          // Replace the URL with a placeholder of the same length
          return "U".repeat(url.length);
        })
        // Replace mentions
        .replace(/@([^:]+):([A-Za-z0-9_-]+)\^/g, "@$1")

        // Remove formatting markers
        .replace(/\*([^*]+)\*/g, "$1") // Bold
        .replace(/-([^-]+)-/g, "$1") // Underline
        .replace(/~([^~]+)~/g, "$1")
    ); // Italic
  };

  // Add this helper function to detect excessively long words
  const hasExcessivelyLongWord = (
    text: string,
    maxWordLength: number
  ): boolean => {
    const words = text.split(/\s+/);

    // Check if any word exceeds the maximum length
    for (const word of words) {
      // Ignore URLs and mentions which are naturally long
      if (
        word.length > maxWordLength &&
        !word.startsWith("http") &&
        !word.includes("://") && // Check for URLs
        !word.startsWith("@")
      ) {
        return true;
      }
    }
    return false;
  };

  // Effect for text truncation
  useEffect(() => {
    // Only perform measurement when not expanded
    if (textRef.current && !expanded) {
      // Get computed line height (fallback to 20px if not available)
      const computedStyle = window.getComputedStyle(textRef.current);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
      const maxHeight = lineCount * lineHeight;

      // Check if the full text already fits
      if (doesOverflow(createMeasurementHTML(content), maxHeight)) {
        setIsTruncated(true);

        // Binary search to find the correct substring length
        let start = 0;
        let end = content.length;
        let mid: number;
        let fitText = "";

        // First pass: find the maximum number of characters that fit
        while (start <= end) {
          mid = Math.floor((start + end) / 2);
          const testText = content.substring(0, mid) + "...";
          const measureHTML = createMeasurementHTML(testText);

          if (doesOverflow(measureHTML, maxHeight)) {
            end = mid - 1;
          } else {
            fitText = testText;
            start = mid + 1;
          }
        }

        // We now have the max character count that fits
        const maxFitLength = fitText.length - 3; // -3 for "..."

        // Determine if we should attempt to preserve whole words
        const shouldPreserveWords = !hasExcessivelyLongWord(
          content.substring(0, maxFitLength),
          30
        );

        if (shouldPreserveWords) {
          // Try to find the last space before our cutoff
          const lastSpaceIndex = content.lastIndexOf(" ", maxFitLength);

          // If we found a space within a reasonable distance
          if (lastSpaceIndex !== -1 && maxFitLength - lastSpaceIndex < 15) {
            setTruncatedText(content.substring(0, lastSpaceIndex) + "...");
          } else {
            // Use the character-based truncation as fallback
            setTruncatedText(fitText);
          }
        } else {
          // Use character-based truncation for text with very long words
          setTruncatedText(fitText);
        }
      } else {
        setIsTruncated(false);
      }
    }
  }, [content, expanded, lineCount]);

  // Format text with support for mentions, URLs, and formatting
  const formatText = (text: string): React.ReactNode[] => {
    // Step 1: Extract and protect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls: { placeholder: string; url: string }[] = [];
    let urlCounter = 0;

    const textWithUrlPlaceholders = text?.replace(urlRegex, (url) => {
      const placeholder = `__URL_${urlCounter}__`;
      urls.push({ placeholder, url });
      urlCounter++;
      return placeholder;
    });

    // Step 2: Process mentions
    const mentionRegex = /@([^:]+):([A-Za-z0-9_-]+)\^/g;
    const segments: {
      type: "text" | "mention" | "url";
      content: string;
      userId?: string;
      url?: string;
    }[] = [];

    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(textWithUrlPlaceholders)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content: textWithUrlPlaceholders.substring(lastIndex, match.index),
        });
      }

      // Add the mention
      segments.push({
        type: "mention",
        content: match[1], // The display name
        userId: match[2], // The user ID
      });

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < textWithUrlPlaceholders?.length) {
      segments.push({
        type: "text",
        content: textWithUrlPlaceholders.substring(lastIndex),
      });
    }

    // Step 3: Restore URLs in the segments
    const finalSegments: typeof segments = [];

    segments.forEach((segment) => {
      if (segment.type === "text") {
        const textWithUrls = segment.content;
        let lastTextIndex = 0;

        // Check for URL placeholders
        for (const { placeholder, url } of urls) {
          const placeholderIndex = textWithUrls.indexOf(
            placeholder,
            lastTextIndex
          );
          if (placeholderIndex !== -1) {
            // Add text before URL
            if (placeholderIndex > lastTextIndex) {
              finalSegments.push({
                type: "text",
                content: textWithUrls.substring(
                  lastTextIndex,
                  placeholderIndex
                ),
              });
            }

            // Add URL
            finalSegments.push({
              type: "url",
              content: url,
              url,
            });

            lastTextIndex = placeholderIndex + placeholder.length;
          }
        }

        // Add remaining text after all URLs
        if (lastTextIndex < textWithUrls.length) {
          finalSegments.push({
            type: "text",
            content: textWithUrls.substring(lastTextIndex),
          });
        }
      } else {
        // Keep mentions as is
        finalSegments.push(segment);
      }
    });

    // Step 4: Apply text formatting and render
    return finalSegments.map((segment, index) => {
      if (segment.type === "mention") {
        if (!hideLinks) {
          return (
            <Link
              key={`mention-${index}`}
              to={`/user-profile/${segment.userId}`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
            >
              {segment.content}
            </Link>
          );
        } else {
          return (
            <span
              key={`mention-${index}`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
            >
              {segment.content}
            </span>
          );
        }
      } else if (segment.type === "url") {
        if (hideLinks) {
          return (
            <div
              key={`url-${index}`}
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-words"
              onClick={(e) => e.stopPropagation()}
            >
              {segment.content}
            </div>
          );
        } else if (segment.url)
          return (
            <Link to={segment.url}>
              <div
                key={`url-${index}`}
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-words"
                onClick={(e) => e.stopPropagation()}
              >
                {segment.content}
              </div>
            </Link>
          );
      } else {
        // Apply formatting to text segments
        const formattedElements = applyFormatting(
          segment.content,
          `segment-${index}`
        );
        return (
          <React.Fragment key={`text-${index}`}>
            {formattedElements}
          </React.Fragment>
        );
      }
    });
  };

  // Apply text formatting (bold, italic, underline)
  const applyFormatting = (
    text: string,
    baseKey: string
  ): React.ReactNode[] => {
    // Process bold text first
    const parts = text.split(/(\*[^*]+\*)/g);

    return parts.map((part, index) => {
      const key = `${baseKey}-${index}`;

      // Handle bold text
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        const content = part.substring(1, part.length - 1);
        return (
          <span key={key} className="font-bold">
            {applyUnderlineAndItalic(content, `${key}-bold`)}
          </span>
        );
      }

      // Handle regular text (might contain underline/italic)
      return applyUnderlineAndItalic(part, `${key}-text`);
    });
  };

  // Apply underline and italic formatting
  const applyUnderlineAndItalic = (
    text: string,
    baseKey: string
  ): React.ReactNode[] => {
    // Process underline
    const parts = text.split(/(-[^-]+-)/g);

    return parts.map((part, index) => {
      const key = `${baseKey}-${index}`;

      // Handle underlined text
      if (part.startsWith("-") && part.endsWith("-") && part.length > 2) {
        const content = part.substring(1, part.length - 1);
        return (
          <span key={key} className="underline">
            {applyItalic(content, `${key}-underline`)}
          </span>
        );
      }

      // Handle regular text (might contain italic)
      return applyItalic(part, `${key}-text`);
    });
  };

  // Apply italic formatting
  const applyItalic = (text: string, baseKey: string): React.ReactNode[] => {
    // Process italic
    const parts = text.split(/(~[^~]+~)/g);

    return parts.map((part, index) => {
      const key = `${baseKey}-${index}`;

      // Handle italic text
      if (part.startsWith("~") && part.endsWith("~") && part.length > 2) {
        const content = part.substring(1, part.length - 1);
        return (
          <span key={key} className="italic">
            {content}
          </span>
        );
      }

      // Regular text (no formatting)
      return part ? <span key={key}>{part}</span> : null;
    });
  };

  return (
    <div
      className={`pl-4 w-full overflow-y-auto ${
        limitHeight ? "max-h-30" : ""
      } ${className || ""}`}
    >
      {/* Hidden element for measurement (off-screen) */}
      <p
        ref={textRef}
        id={id}
        className="text-sm whitespace-pre-wrap break-words max-w-fit invisible w-1/2 absolute -z-10"
      >
        {content}
      </p>

      <p className="text-sm whitespace-pre-wrap break-all max-w-full  w-full">
        {expanded || !isTruncated
          ? formatText(content)
          : formatText(truncatedText)}

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

// Process text for underline and italic formatting
export const processUnderlineAndItalic = (
  text: string,
  baseKey: string
): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  // Split for underline formatting
  const underlineParts = text.split(/(-[^-]+-)/g);
  let key = 0;

  underlineParts.forEach((part) => {
    if (part.startsWith("-") && part.endsWith("-") && part.length > 2) {
      // Extract content between dashes
      const content = part.substring(1, part.length - 1);

      // Process the underlined content for italic
      const italicElements = processItalic(
        content,
        `${baseKey}-underline-${key}`
      );

      // Wrap in underline formatting
      elements.push(
        <span key={`${baseKey}-underline-${key++}`} className="underline">
          {italicElements}
        </span>
      );
    } else {
      // Process non-underlined content for italic
      const regularElements = processItalic(
        part,
        `${baseKey}-regular-${key++}`
      );
      elements.push(...regularElements);
    }
  });

  return elements;
};

// Process text for italic formatting
export const processItalic = (text: string, baseKey: string): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  // Split for italic formatting
  const italicParts = text.split(/(~[^~]+~)/g);
  let key = 0;

  italicParts.forEach((part) => {
    if (part.startsWith("~") && part.endsWith("~") && part.length > 2) {
      // Extract content between tildes
      const content = part.substring(1, part.length - 1);

      // Add italic formatting
      elements.push(
        <span key={`${baseKey}-italic-${key++}`} className="italic">
          {content}
        </span>
      );
    } else if (part) {
      // Regular text (no formatting)
      elements.push(<span key={`${baseKey}-regular-${key++}`}>{part}</span>);
    }
  });

  return elements;
};

export const processTextFormatting = (
  text: string,
  baseKey: number
): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  // Process the text in order: bold, underline, italic
  // Check if text contains URL placeholders
  if (text.includes("__URL_PLACEHOLDER_")) {
    // If it has URL placeholders, preserve them
    elements.push(<span key={`${baseKey}-preserved`}>{text}</span>);
    return elements;
  }

  // Split for bold formatting
  const boldParts = text.split(/(\*[^*]+\*)/g);
  let key = 0;

  boldParts.forEach((part) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      // Extract content between asterisks
      const content = part.substring(1, part.length - 1);

      // Process the bold content for underline and italic
      const boldElements = processUnderlineAndItalic(
        content,
        `${baseKey}-bold-${key}`
      );

      // Wrap in bold formatting
      elements.push(
        <span key={`${baseKey}-bold-${key++}`} className="font-bold">
          {boldElements}
        </span>
      );
    } else if (part) {
      // Process non-bold content for underline and italic
      const regularElements = processUnderlineAndItalic(
        part,
        `${baseKey}-regular-${key++}`
      );
      elements.push(...regularElements);
    }
  });

  return elements;
};
