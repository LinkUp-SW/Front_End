import Connections from "./components/Connections";
import { WithNavBar } from "../../components";
import NewMessage from "@/pages/messaging/NewMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ConnectionsPage: React.FC = () => {
  const showPopup = useSelector((state: RootState) => state.messaging.popup);
  return (
    <div className="container mx-auto">
      <Connections />
      {showPopup &&(
        <div className="fixed bottom-0 left-1/2 h-[calc(100vh-140px)] transform -translate-x-1/2 w-full max-w-xl z-50">
          <NewMessage />
        </div>
      )}
    </div>
  );
};

export default WithNavBar(ConnectionsPage);
