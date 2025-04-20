import Header from "./Header";
import Buttons from "./Buttons";
import SideBar from "./SideBar";
import ChatingScreen from "./ChatingScreen";
import SendingMessages from "./SendingMessages";
import { WithNavBar, WhosHiringImage, LinkUpFooter } from "../../components";

const MessagingPage = () => {
  return (
    <>
      <div className="flex h-[calc(100vh-100px)] w-full fixed top-[100px] left-10 right-0">
        <div className="bg-white flex-1 h-full border-r border-gray-200 flex flex-col">
          <div className="bg-white border-b border-gray-200 flex-shrink-0">
            <Header />
            <Buttons />
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
              <SideBar />
            </div>

            <div className="w-2/3 flex flex-col overflow-hidden">
              <div className="flex-grow overflow-hidden flex flex-col">
                <ChatingScreen />
              </div>

              <div className="border-t border-gray-200 bg-white flex-shrink-0">
                <SendingMessages />
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 pl-4 hidden lg:block">
          <div className="h-full flex flex-col justify-between">
            <div className="rounded-lg border border-gray-200">
              <WhosHiringImage />
            </div>
            <div className="mt-auto">
              <LinkUpFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithNavBar(MessagingPage);
