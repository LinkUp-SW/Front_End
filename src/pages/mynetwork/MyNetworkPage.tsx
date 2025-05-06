import { WithNavBar } from "../../components";
import ManageMyNetwork from "./components/ManageMyNetwork";
import Invitations from "./components/Invitations";
import ConnectWithPeople from "./components/ConnectWithPeople";
import { ConnectionProvider } from "./components/ConnectionContext";

const MyNetworkPage = () => {
  
  return (
    <ConnectionProvider>
      <div className="max-w-7xl mx-auto  flex flex-col lg:flex-row gap-6">
        {/* Manage My Network Section */}
        <div className="w-full lg:w-[25%]">
          <ManageMyNetwork />
        </div>

        {/* Invitations and connect wit people Section */}
        <div className="w-full lg:w-[75%]">
         
            <>
              <Invitations />
              <ConnectWithPeople />
            </>
          
        </div>
      </div>
    </ConnectionProvider>
  );
};

export default WithNavBar(MyNetworkPage);
