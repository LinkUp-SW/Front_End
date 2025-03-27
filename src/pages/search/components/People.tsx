import React from "react";

const people = [
  {
    name: "Nada Salem",
    title: "Front end developer",
    location: "Giza",
    mutualConnections: "Ahmed Khattab, Yousef Gilany, and 19 other mutual connections",
    avatar: "https://via.placeholder.com/50",
    isConnected: true,
    industry: "Front end",
  },
  {
    name: "Nada Khaled",
    title: "Front end developer",
    location: "Cairo, Egypt",
    mutualConnections: "Marwan Abdellah, AbdEl-Monem El-Sharkawy, PhD, and 70 other mutual connections",
    avatar: "https://via.placeholder.com/50",
    isConnected: true,
    industry:"Front end",
  },
  {
    name: "Nada Zayed",
    title: "Front end developer",
    location: "Alexandria, Egypt",
    mutualConnections: " Ibrahim Sobh, PhD, and 47 other mutual connections",
    avatar: "https://via.placeholder.com/50",
    isConnected: false,
    industry:"Front end",
  },
];

const NetworkPage: React.FC = () => {
  return (
    
      <div className="flex justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">People</h2>
        
        <div className="space-y-4">
          {people.map((person, index) => (
            <div key={index} className="flex justify-between items-center p-4 border-b last:border-none bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-4">
                <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{person.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{person.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{person.location}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{person.mutualConnections}</p>
                </div>
              </div>
              {person.isConnected ? (
                <button className="px-4 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700">Message</button>
              ) : (
                <button className="px-4 py-2 border rounded-full text-gray-600 border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">Connect</button>
              )}
            </div>
          ))}
        </div>
        <button className="w-full mt-2 py-2  text-gray-500 dark:text-gray-400  border-t pt-2 ">See all people results</button>
      </div>
      </div>
    
   
  );
};

export default NetworkPage;
