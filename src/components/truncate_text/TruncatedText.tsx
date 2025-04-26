import React, { JSX, useEffect, useRef, useState } from "react";

interface TruncatedTextProps {
  content: string;
  lineCount?: number;
  id: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  content,
  lineCount = 3,
  id,
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncatedText, setTruncatedText] = useState<string>(content);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Helper function to measure if the text overflows the desired height.
  const doesOverflow = (text: string, maxHeight: number): boolean => {
    if (textRef.current) {
      textRef.current.innerHTML = text;
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
        // Try to find a word boundary near this position
        const maxFitLength = fitText.length - 3; // -3 for "..."

        // Determine if we should attempt to preserve whole words
        const shouldPreserveWords = !hasExcessivelyLongWord(
          content.substring(0, maxFitLength),
          30
        );

        if (shouldPreserveWords) {
          // Try to find the last space before our cutoff
          let lastSpaceIndex = content.lastIndexOf(" ", maxFitLength);

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
        !word.startsWith("@")
      ) {
        return true;
      }
    }

    return false;
  };

  // Format mentions into blue, bold text
  const formatText = (text: string): JSX.Element[] => {
    // First handle mentions
    const mentionRegex = /@([^:]+):([A-Za-z0-9_\-]+)\^/g;
    const parts = text.split(mentionRegex);
    const elements: JSX.Element[] = [];

    // Process each mention part
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 1) {
        // This is the name part of a mention
        elements.push(
          <span
            key={`mention-${i}`}
            className="text-blue-600 dark:text-blue-400 font-medium"
          >
            {parts[i]}
          </span>
        );
      } else if (i % 3 === 0) {
        // This is regular text, look for markdown-style formatting
        const textContent = parts[i];

        // Handle *bold*, -underlined-, and ~italic~ formatting
        const formattedText = processTextFormatting(textContent, i);
        elements.push(...formattedText);
      }
      // Skip the ID part (i % 3 === 2)
    }

    return elements;
  };

  // Helper function to process text formatting

  // Create HTML-safe version for measurement
  const createMeasurementHTML = (text: string): string => {
    return (
      text
        // Replace mentions
        .replace(/@([^:]+):([A-Za-z0-9_\-]+)\^/g, "@$1")
        // Remove formatting markers
        .replace(/\*([^*]+)\*/g, "$1") // Bold
        .replace(/-([^-]+)-/g, "$1") // Underline
        .replace(/~([^~]+)~/g, "$1")
    ); // Italic
  };

  useEffect(() => {
    // Only perform measurement when not expanded.
    if (textRef.current && !expanded) {
      // Get computed line height (fallback to 20px if not available)
      const computedStyle = window.getComputedStyle(textRef.current);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
      const maxHeight = lineCount * lineHeight;

      // Check if the full text already fits.
      if (doesOverflow(createMeasurementHTML(content), maxHeight)) {
        setIsTruncated(true);
        // Binary search to find the correct substring length.
        let start = 0;
        let end = content.length;
        let mid: number;
        let fitText = "";

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
        setTruncatedText(fitText);
      } else {
        setIsTruncated(false);
      }
    }
  }, [content, expanded, lineCount]);

  return (
    <div className="pl-4">
      {/* Hidden element for measurement (off-screen) */}
      <p
        ref={textRef}
        id={id}
        className="text-sm whitespace-pre-wrap break-words invisible absolute -z-10"
      >
        {content}
      </p>

      <p className="text-sm whitespace-pre-wrap break-all">
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

export const processTextFormatting = (
  text: string,
  baseKey: number
): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  // Process the text in order: bold, underline, italic
  // This is a simplified approach - a more robust one would use a parsing library

  // Split for bold formatting
  const boldParts = text.split(/(\*[^*]+\*)/g);
  let key = 0;

  boldParts.forEach((part, boldIndex) => {
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
    } else {
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

// Process text for underline and italic formatting
export const processUnderlineAndItalic = (
  text: string,
  baseKey: string
): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  // Split for underline formatting
  const underlineParts = text.split(/(-[^-]+-)/g);
  let key = 0;

  underlineParts.forEach((part, underlineIndex) => {
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

  italicParts.forEach((part, italicIndex) => {
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
