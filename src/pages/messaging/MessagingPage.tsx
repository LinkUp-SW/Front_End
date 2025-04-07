import Header from "./Header";
import Buttons from "./Buttons";
import SideBar from "./SideBar";
import ChatingScreen from "./ChatingScreen";
import SendingMessages from "./SendingMessages";
import { WithNavBar, WhosHiringImage, LinkUpFooter } from "../../components";

const MessagingPage = () => {
  return (
    <>
      <div className=" flex max-w-screen-xl mx-auto mt-0 h-screen overflow-hidden align-top">
        <div className="bg-white flex-1 min-h-screen border-r border-gray-200">
          <div className=" bg-white border-b border-gray-200">
            <Header />
            <Buttons />
          </div>

          <div className="flex h-[calc(100vh-120px)]">
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <SideBar />
            </div>

            <div className="w-2/3 flex flex-col">
              <div className="flex-grow overflow-y-auto">
                <ChatingScreen />
              </div>

              <div className="border-t border-gray-200 bg-white">
                <SendingMessages />
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 pl-4 lg:block">
          <div className=" mt-0">
            <div className="mt-0 rounded-lg border border-gray-200">
              <WhosHiringImage />
            </div>
            <div className="mt-4">
              <LinkUpFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithNavBar(MessagingPage);
