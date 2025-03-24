import FollowingFolllowers from "./components/FollowingFollowers";
import { WithNavBar } from "../../components";
const FollowingFolllowersPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <FollowingFolllowers />
    </div>
  );
};

export default WithNavBar(FollowingFolllowersPage);
