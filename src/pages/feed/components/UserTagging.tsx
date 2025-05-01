import React, { useState, useEffect, useRef } from "react";
import { searchUsersForTag, UserTagResult } from "@/endpoints/search";
import Cookies from "js-cookie";
import { createPortal } from "react-dom";

interface UserTaggingProps {
  text: string;
  onTextChange: (text: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  className?: string;
  children?: React.ReactNode;
  maxUserSuggestions?: number;
}

interface TaggingPosition {
  startPosition: number;
  currentPosition: number;
  searchText: string;
}

const UserTagging: React.FC<UserTaggingProps> = ({
  text,
  onTextChange,
  inputRef,
  className = "",
  children,
  maxUserSuggestions = 5,
}) => {
  const [taggingPosition, setTaggingPosition] =
    useState<TaggingPosition | null>(null);
  const [userSuggestions, setUserSuggestions] = useState<UserTagResult[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const token = Cookies.get("linkup_auth_token");

  // Track if mouse is over the suggestions dropdown
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);

  // Portal component for rendering outside the component hierarchy
  const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return createPortal(children, document.body);
  };

  // Enhanced cursor position calculation
  const calculateSuggestionsPosition = () => {
    if (!inputRef.current || !taggingPosition) return { top: 0, left: 0 };

    const textarea = inputRef.current;

    // Save the current selection
    const originalSelStart = textarea.selectionStart || 0;
    const originalSelEnd = textarea.selectionEnd || 0;

    // Try to get position using getCaretCoordinates
    const selectionPosition = getCaretCoordinates(
      textarea,
      taggingPosition.currentPosition
    );
    const inputRect = textarea.getBoundingClientRect();

    // Restore selection if needed
    if (
      textarea.selectionStart !== originalSelStart ||
      textarea.selectionEnd !== originalSelEnd
    ) {
      textarea.setSelectionRange(originalSelStart, originalSelEnd);
    }

    // Return position with scroll offset
    return {
      top: inputRect.top + selectionPosition.top + 25 + window.scrollY, // 25px below cursor
      left: inputRect.left + selectionPosition.left + window.scrollX,
    };
  };

  // Helper function to get caret coordinates
  function getCaretCoordinates(
    element: HTMLTextAreaElement | HTMLInputElement,
    position: number
  ) {
    // Create a mirror div to measure where the caret is
    const mirror = document.createElement("div");
    const style = window.getComputedStyle(element);

    // Copy styles to mirror element
    const styleProperties = [
      "box-sizing",
      "width",
      "height",
      "padding-left",
      "padding-right",
      "padding-top",
      "padding-bottom",
      "border-width",
      "font-family",
      "font-size",
      "font-style",
      "font-variant",
      "font-weight",
      "line-height",
      "letter-spacing",
      "text-indent",
      "text-transform",
      "white-space",
      "word-spacing",
    ];

    styleProperties.forEach((prop) => {
      mirror.style.setProperty(prop, style.getPropertyValue(prop));
    });

    mirror.style.position = "absolute";
    mirror.style.top = "0";
    mirror.style.left = "0";
    mirror.style.visibility = "hidden";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.overflow = "auto";

    // Get text before cursor
    const textBeforeCaret = element.value.substring(0, position);

    // Add span to mark caret position
    mirror.textContent = textBeforeCaret;
    const caretMarker = document.createElement("span");
    caretMarker.textContent = "|";
    mirror.appendChild(caretMarker);

    // Add to document, measure, then remove
    document.body.appendChild(mirror);
    const markerRect = caretMarker.getBoundingClientRect();
    document.body.removeChild(mirror);

    return {
      top: markerRect.top - mirror.getBoundingClientRect().top,
      left: markerRect.left - mirror.getBoundingClientRect().left,
    };
  }

  // Handle text changes and detect @ tagging
  useEffect(() => {
    if (!text) {
      setTaggingPosition(null);
      setUserSuggestions([]);
      return;
    }

    // Get cursor position
    const cursorPosition = inputRef.current?.selectionStart || 0;

    // Check if we're in a tagging context
    let inTaggingContext = false;
    let tagStartPosition = -1;

    for (let i = cursorPosition - 1; i >= 0; i--) {
      // Find the start of tagging (@ character)
      if (text[i] === "@") {
        // Only consider this @ as a tag start if there's no completed tag between cursor and this @
        // Check if there's a completed tag format (@Name_Name:id) between this @ and cursor
        const textBetween = text.substring(i, cursorPosition);

        // If there's a colon in the text between @ and cursor, this means we've already
        // completed a tag and shouldn't be in tagging context anymore
        if (!textBetween.includes(":")) {
          inTaggingContext = true;
          tagStartPosition = i;
        }
        break;
      }

      // Only stop if we encounter a new line
      if (text[i] === "\n") {
        break;
      }
    }

    if (inTaggingContext) {
      // Extract the current search query
      const searchText = text.slice(tagStartPosition + 1, cursorPosition);

      setTaggingPosition({
        startPosition: tagStartPosition,
        currentPosition: cursorPosition,
        searchText,
      });

      // Only search if we have at least 1 character after @
      if (searchText.length > 0) {
        fetchUserSuggestions(searchText);
      } else {
        setUserSuggestions([]);
      }
    } else {
      setTaggingPosition(null);
      setUserSuggestions([]);
    }
  }, [text, inputRef.current?.selectionStart]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Keep suggestions open if clicking inside the dropdown
      if (isMouseOverSuggestions) return;

      // Don't close if clicking inside the textarea
      if (inputRef.current && inputRef.current.contains(e.target as Node)) {
        return;
      }

      // Otherwise, close the suggestions
      setTaggingPosition(null);
      setUserSuggestions([]);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMouseOverSuggestions]);

  // Fetch user suggestions
  const fetchUserSuggestions = async (query: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await searchUsersForTag(
        token,
        query,
        maxUserSuggestions
      );
      // Make sure we're handling the right response structure
      if (response && response.people) {
        setUserSuggestions(response.people);
        setSelectedSuggestionIndex(0); // Reset selection index
      }
    } catch (error) {
      console.error("Failed to fetch user suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inside handleSelectUser function
  const handleSelectUser = (user: UserTagResult) => {
    if (!taggingPosition) return;

    // Replace the @query with @display name:user_id^ format (with spaces intact)
    const beforeTag = text.slice(0, taggingPosition.startPosition);
    const afterTag = text.slice(taggingPosition.currentPosition);

    // Keep the display name with spaces and add the caret at the end
    const newText = `${beforeTag}@${user.name}:${user.user_id}^ ${afterTag}`;

    onTextChange(newText);
    setTaggingPosition(null);
    setUserSuggestions([]);

    // Focus back on input and set cursor position after the tag
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newPosition =
          taggingPosition.startPosition +
          user.name.length +
          user.user_id.length +
          4; // +3 for @, : and ^, +1 for the space
        inputRef.current.selectionStart = newPosition;
        inputRef.current.selectionEnd = newPosition;
      }
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!userSuggestions.length || !taggingPosition) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < userSuggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : userSuggestions.length - 1
        );
        break;

      case "Enter":
        if (taggingPosition && userSuggestions.length > 0) {
          e.preventDefault();
          handleSelectUser(userSuggestions[selectedSuggestionIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setTaggingPosition(null);
        setUserSuggestions([]);
        break;

      case "Tab":
        if (taggingPosition && userSuggestions.length > 0) {
          e.preventDefault();
          handleSelectUser(userSuggestions[selectedSuggestionIndex]);
        }
        break;
    }
  };

  // Calculate position of suggestions popup
  const suggestionsPosition = calculateSuggestionsPosition();

  return (
    <div className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {children} {/* Render the input element passed as a child */}
      {/* Suggestions Dropdown */}
      {taggingPosition && userSuggestions.length > 0 && (
        <Portal>
          <div
            ref={suggestionsRef}
            className="fixed z-[9999] bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-72 max-h-60 overflow-y-auto"
            style={{
              top: `${suggestionsPosition.top}px`,
              left: `${suggestionsPosition.left}px`,
              pointerEvents: "auto", // Ensure mouse events work
            }}
            onMouseEnter={() => setIsMouseOverSuggestions(true)}
            onMouseLeave={() => setIsMouseOverSuggestions(false)}
          >
            <div className="py-1">
              {userSuggestions.map((user, index) => (
                <div
                  key={user.user_id}
                  className={`px-3 py-2 flex items-center gap-3 cursor-pointer ${
                    index === selectedSuggestionIndex
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectUser(user);
                  }}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  {/* User Avatar */}
                  {user.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-200 font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* User Info with connection degree and headline */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.connection_degree && (
                        <span className="font-medium">
                          {user.connection_degree}
                        </span>
                      )}
                      {user.connection_degree && user.headline && (
                        <span className="mx-1">·</span>
                      )}
                      {user.headline && <span>{user.headline}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Portal>
      )}
      {/* Loading State */}
      {taggingPosition && isLoading && (
        <Portal>
          <div
            className="fixed z-[9999] bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-72 p-4 text-center"
            style={{
              top: `${suggestionsPosition.top}px`,
              left: `${suggestionsPosition.left}px`,
              pointerEvents: "auto", // Ensure mouse events work
            }}
          >
            <span className="text-gray-500 dark:text-gray-400">
              Searching users...
            </span>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default UserTagging;
