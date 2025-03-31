import React from "react";
import Comment, { CommentProps } from "./Comment";

// Extend CommentProps so Reply can use all the same properties
interface ReplyProps extends CommentProps {
  // Optionally add extra props specific for replies
}

const Reply: React.FC<ReplyProps> = (props) => {
  return (
    // Example: adding left padding and a border to indicate a reply
    <div className="pl-10">
      <Comment {...props} />
    </div>
  );
};

export default Reply;
