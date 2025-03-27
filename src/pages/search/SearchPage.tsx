import React from "react";
import { WithNavBar } from "../../components";
import People from "./components/People";
import Jobs from "./components/Jobs";
const SearchPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <People/>
      <Jobs/>
    </div>
  );
};

export default WithNavBar(SearchPage);
