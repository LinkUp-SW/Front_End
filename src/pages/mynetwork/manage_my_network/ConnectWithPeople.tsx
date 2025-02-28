import { useState } from "react";
import { People } from "./Invitations";

const ConnectWithPeople = () => {
  const [people, setPeople] = useState<People[]>([
    {
      id: 1,
      name: "Sama Mohamed",
      title: "Software Engineer at Microsoft",
      mutualConnections: "Ahmed Khaled and 12 other mutual connections",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Sama-Mohamed",
    },
    {
      id: 2,
      name: "Youssef Afify",
      title: "Machine Learning Researcher",
      mutualConnections: "Mariam Samir is a mutual connection",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Youssef-Afify",
    },
    {
      id: 3,
      name: "Amr Doma",
      title: "Cybersecurity Analyst at IBM",
      mutualConnections: "Haneen Mohamed and 8 other mutual connections",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Amr-Doma",
    },
    {
      id: 4,
      name: "Habiba Walid",
      title: "Biomedical Data Engineer",
      mutualConnections: "Noor Emad and 5 other mutual connections",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Habiba-Walid",
    },
    
    {
      id: 5,
      name: "Mohanad Tarek",
      title: "Full Stack Developer",
      mutualConnections: "Noha Adel and 10 other mutual connections",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Mohanad-Tarek",
    },
    {
      id: 6,
      name: "Salsabil Mostafa",
      title: "UX/UI Designer",
      mutualConnections: "Karim Nabil and 6 other mutual connections",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Salsabil-Mostafa",
    },
    {
      id: 7,
      name: "Mehrati Sameh",
      title: "Electrical Engineer",
      mutualConnections: "Nada Omar and 9 other mutual connections",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Mehrati-Sameh",
    },
    {
      id: 8,
      name: "Mayar Ahmed",
      title: "Cloud Architect at AWS",
      mutualConnections: "Aya Ibrahim is a mutual connection",
      image: "https://via.placeholder.com/80",
      profileUrl: "/profile/Mayar-Ahmed",
    },
  ]);

  const removePerson = (id: number) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 mt-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 ml-2">
        People you may know 
      </h2>

      //Grid Layout for cards 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {people.map((person) => (
          <div key={person.id} className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-full flex flex-col">
            
            //Ignore Button 
            <button
              onClick={() => removePerson(person.id)}
              className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✕
            </button>

            //Profile Content 
            <div className="flex flex-col items-center text-center flex-grow">
              <a href={person.profileUrl}>
                <img src={person.image} alt={person.name} className="w-20 h-20 rounded-full mb-3" />
                <p className="text-gray-900 dark:text-white font-semibold">{person.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{person.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{person.mutualConnections}</p>
              </a>
            </div>

             //Connect Button 
            <button
  onClick={() => removePerson(person.id)}
  className="mt-2 w-full border border-blue-600 text-blue-600 font-semibold py-1 rounded-full flex items-center justify-center gap-2 hover:bg-blue-100 transition"
>
 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /> </svg>
  Connect
</button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectWithPeople;
