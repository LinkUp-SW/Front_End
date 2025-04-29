import Header from "./Header";
import Buttons from "./Buttons";
import SideBar from "./SideBar";
import ChatingScreen from "./ChatingScreen";
import SendingMessages from "./SendingMessages";
import { WithNavBar, WhosHiringImage, LinkUpFooter } from "../../components";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import manOnChair from "../../assets/man_on_chair.svg";

const MessagingPage = () => {
  const isSelectedSidebar = useSelector(
    (state: RootState) => state.messaging.responsiveIsSidebar
  );

  return (
    <div className=" flex h-[calc(100vh-100px)] w-full fixed top-[50px] lg:top-[100px] left-0 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 flex-1 h-full border-r  lg:ml-10 border-gray-200 dark:border-gray-700 flex flex-col">
        <div
          className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 ${
            isSelectedSidebar ? "hidden lg:block" : "block"
          }`}
        >
          <Header />
          <Buttons />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div
            className={`w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col ${
              isSelectedSidebar ? "hidden" : "block"
            } lg:block`}
          >
            <SideBar />
          </div>

          <div
            className={`${
              isSelectedSidebar ? "w-full" : "w-2/3"
            } lg:w-2/3 lg:flex flex-col overflow-hidden ${
              isSelectedSidebar ? "block" : "hidden"
            } lg:block`}
          >
            {isSelectedSidebar ? (
              <>
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto">
                    <ChatingScreen />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                    <SendingMessages />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-gray-800">
                  <img src={manOnChair} className="w-1/2 h-auto" />
                  <p className="text-gray-500 dark:text-gray-300 text-lg">
                    Select a conversation to start chatting
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-full hidden pl-6 pr-2 lg:flex flex-col">
        <WhosHiringImage />
        <LinkUpFooter />
      </div>
    </div>
  );
};

export default WithNavBar(MessagingPage);
