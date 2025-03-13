import Header from "./Header";
import Buttons from "./Buttons";
import SideBar from "./SideBar";
import ChatingScreen from "./ChatingScreen";
import SendingMessages from "./SendingMessages";
import { WithNavBar } from "../../components";
import { useState } from "react";

const MessagingPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Focused");

  return (
    <>
      <div className="bg-white">
        <Header />
        <Buttons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="flex">
          <SideBar activeFilter={activeFilter} />
          <div className=" w-3/5 border-1 border-[#e8e8e8] ">
            <ChatingScreen />
            <SendingMessages />
          </div>
        </div>
      </div>
    </>
  );
};

export default WithNavBar(MessagingPage);
