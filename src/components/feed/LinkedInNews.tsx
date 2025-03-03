import { Card, CardContent } from "../ui/card";

const LinkedInNews = () => (
  <div className=" p-4">
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">LinkedIn News</h3>
        <ul className="mt-2 text-gray-700">
          <li>Nvidia downplays DeepSeek threat</li>
          <li>Banks turn to socials to build trust</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default LinkedInNews;
