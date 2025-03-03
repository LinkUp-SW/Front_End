import React from "react";
import { Card, CardContent } from "../ui/card";

interface PostProps {
  name: string;
  content: string;
}

const Post: React.FC<PostProps> = ({ name, content }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-gray-700 mt-2">{content}</p>
    </CardContent>
  </Card>
);
export default Post;
