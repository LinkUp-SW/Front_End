import React, { useState, useRef, useEffect } from "react";
import Comment, { CommentProps } from "./Comment";
import Reply from "./Reply";

const CommentWithReplies: React.FC<any> = ({ replies, ...commentProps }) => {
  const [showReplies] = useState(true);
  const [mainCommentHeight, setMainCommentHeight] = useState(0);
  const [replyHeights, setReplyHeights] = useState(0);

  const commentRef = useRef<HTMLDivElement>(null);

  // Create a ref array for replies
  const replyRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Measure main comment height

  useEffect(() => {
    if (commentRef.current) {
      // Divide by 16 if you want rem conversion
      setMainCommentHeight(commentRef.current.offsetHeight / 16);
    }
  }, [commentProps]);

  // Measure replies heights and sum them
  useEffect(() => {
    if (replies && replyRefs.current.length > 0) {
      const total = replyRefs.current.reduce((acc, ref) => {
        return ref ? acc + ref.offsetHeight / 16 : acc;
      }, 0);
      setReplyHeights(total);
    } else {
      setReplyHeights(0);
    }
  }, [replies, showReplies]);

  return (
    <div className="flex flex-col relative">
      {/* Border element whose height is adjusted based on the main comment and replies */}
      <div
        className="border-b-2 border-l-2 dark:border-gray-700 rounded-lg absolute w-10 left-4"
        style={{
          height: (mainCommentHeight + replyHeights) * 16 - 90, // converting back to px if needed
        }}
      ></div>

      {/* Main comment container with ref */}
      <div ref={commentRef}>
        <Comment {...commentProps} />
      </div>

      {/* Replies toggle and list */}
      {replies && replies.length > 0 && (
        <>
          {/* {replies.length > 1 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              {showReplies
                ? "Hide Replies"
                : `Show Replies (${replies.length})`}
            </button>
          )} */}

          {showReplies && (
            <div className="mt-2 space-y-2">
              {replies.map((reply: any, idx: number) => (
                <div
                  key={idx}
                  ref={(el) => {
                    replyRefs.current[idx] = el;
                  }}
                  className="relative"
                >
                  {/* You can adjust or add your border for each reply if needed */}
                  <div className="w-12 h-full rounded-full absolute bg-white dark:bg-gray-900 left-8" />
                  <Reply {...reply} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentWithReplies;
