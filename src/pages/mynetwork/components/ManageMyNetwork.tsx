import { 
  FaUsers,
  FaUserPlus,
 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchConnectionsNumber} from "@/endpoints/myNetwork";
import Cookies from "js-cookie";
import useFetchData from "@/hooks/useFetchData";
import { useEffect} from "react";

const ManageMyNetwork = () => {
  const navigate = useNavigate();
 
  const token = Cookies.get("linkup_auth_token");

  const { data } = useFetchData(
    () => (token ? fetchConnectionsNumber(token): Promise.resolve(null)), 
    [token]
  );
  
  


  useEffect(() => {
    console.log(data);
  }, [data]);
    
  
  const networkOptions = [
    {
      label: `Connections ${data?.number_of_connections!== null ? `(${data?.number_of_connections})` : ""}`,
      icon: <FaUsers />,
      route: "/connections",
      
    },
    {
      label: "Following & followers",
      icon: <FaUserPlus />,
      route: "/followingfollowers",
    },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Manage my network
      </h2>

      <ul>
        {networkOptions.map((option,index) => (
           <li
           key={index}
           onClick={() => navigate(option.route)}
           className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"
         >
           <span className="mr-2 text-lg">{option.icon}</span>
           <span className="text-gray-900 dark:text-white">{option.label}</span>
           

         </li>
       ))}
     </ul>

      {/* Promotional Banner */}
      <div className="mt-4 cursor-pointer hidden lg:block">
        <img
          src="./src/assets/see_who's_hiring.jpg"
          alt="Promotional Banner"
          className="rounded-lg shadow-lg w-full object-cover"
        />
      </div>

      {/* Footer Links */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center space-y-2 hidden lg:block">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Help Center</a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">Privacy & Terms</a>
          <a href="#" className="hover:underline">Ad Choices</a>
          <a href="#" className="hover:underline">Advertising</a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">Business Services</a>
          <a href="#" className="hover:underline">Get the LinkUp app</a>
        </div>
        <p className="mt-2 text-xs">LinkUp Corporation © 2025</p>
      </div>
    </div>
  );
};

export default ManageMyNetwork;
