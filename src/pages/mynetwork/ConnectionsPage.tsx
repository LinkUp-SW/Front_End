import Connections from "./components/Connections";
import { WithNavBar } from "../../components";
const ConnectionsPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <Connections />
    </div>
  );
};

export default WithNavBar(ConnectionsPage);
