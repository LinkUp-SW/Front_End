import ManageInvitations from "./components/ManageInvitations";
import { WithNavBar } from "../../components";
const InvitationsManagerPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <ManageInvitations />
    </div>
  );
};

export default WithNavBar(InvitationsManagerPage);
