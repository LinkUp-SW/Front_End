import AllPeople from "./components/AllPeople";
import { WithNavBar } from "../../components";
const AllPeoplePage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <AllPeople />
    </div>
  );
};

export default WithNavBar(AllPeoplePage);