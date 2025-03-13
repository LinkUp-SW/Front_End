import ManageInvitations from "./components/ManageInvitations";
import { WithNavBar } from "../../components";
const InvitationsManagerPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Manage Invitations</h1>
      <ManageInvitations />
    </div>
  );
};

export default WithNavBar(InvitationsManagerPage);
