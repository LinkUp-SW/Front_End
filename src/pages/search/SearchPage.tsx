import React from "react";
import { WithNavBar } from "../../components";
import People from "./components/People";
const SearchPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <People/>
    </div>
  );
};

export default WithNavBar(SearchPage);
