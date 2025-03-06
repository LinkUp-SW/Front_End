import { WithNavBar } from "../../components";
import ManageMyNetwork from "./manage_my_network/ManageMyNetwork";
import Invitations from "./manage_my_network/Invitations";
import ConnectWithPeople from "./manage_my_network/ConnectWithPeople";
import CatchUp from "./manage_my_network/CatchUp";
import NetworkNavBar from "./manage_my_network/NetworkNavBar";
import { useState } from "react";

const MyNetworkPage = () => {
  const [activeTab, setActiveTab] = useState("grow");
  return (
    <div className="max-w-7xl mx-auto  flex flex-col lg:flex-row gap-6">
      {/* Manage My Network Section */}
      <div className="w-full lg:w-[25%]">
        <ManageMyNetwork />
      </div>

      {/* Invitations and connect wit people Section */}
      <div className="w-full lg:w-[75%]">
        <NetworkNavBar setActiveTab={setActiveTab} />
        {activeTab === "grow" ? (
          <>
            <Invitations />
            <ConnectWithPeople />
          </>
        ) : (
          <CatchUp />
        )}
      </div>
    </div>
  );
};

export default WithNavBar(MyNetworkPage);
