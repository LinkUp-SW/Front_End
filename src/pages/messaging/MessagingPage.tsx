import Header from "./Header";
import Buttons from "./Buttons";
import SideBar from "./SideBar";
import ChatingScreen from "./ChatingScreen";
import SendingMessages from "./SendingMessages";
import { WithNavBar } from "../../components";

const MessagingPage = () => {
  return (
    <>
      <div className="bg-white">
        <Header />
        <Buttons />

        <div className="flex">
          <SideBar />
          <div className=" w-3/5 border-1 border-[#e8e8e8] ">
            <ChatingScreen />
            <SendingMessages />
          </div>
        </div>
      </div>
    </>
  );
};

export default WithNavBar(MessagingPage)  ;
