import { WithNavBar } from "../../components";
import ManageMyNetwork from './manage_my_network/ManageMyNetwork'
import Invitations from './manage_my_network/Invitations'
import ConnectWithPeople from './manage_my_network/ConnectWithPeople'

const MyNetworkPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-2 flex flex-col lg:flex-row gap-6">
  {/* Manage My Network Section */}
  <div className="w-full lg:w-[25%]">
    <ManageMyNetwork />
  </div>

  {/* Invitations and connect wit people Section */}
  <div className="w-full lg:w-[75%]">
    <Invitations />
    <ConnectWithPeople />
    

  </div>

  
    
</div>

  );
};

export default WithNavBar(MyNetworkPage)