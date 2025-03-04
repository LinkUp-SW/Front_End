import { useState } from "react";
import { People } from "./Invitations";
import {  FaUserPlus } from "react-icons/fa";

const ConnectWithPeople = () => {
  const [people, setPeople] = useState<People[]>([
    {
      id: 1,
      name: "Sama Mohamed",
      title: "Software Engineer at Microsoft",
      mutualConnections: "Ahmed Khaled and 12 other mutual connections",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      profileUrl: "/profile/Sama-Mohamed",
    },
    {
      id: 2,
      name: "Youssef Afify",
      title: "Machine Learning Researcher",
      mutualConnections: "Mariam Samir is a mutual connection",
      image: "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      profileUrl: "/profile/Youssef-Afify",
    },
    {
      id: 3,
      name: "Amr Doma",
      title: "Cybersecurity Analyst at IBM",
      mutualConnections: "Haneen Mohamed and 8 other mutual connections",
      image: "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      profileUrl: "/profile/Amr-Doma",
    },
    {
      id: 4,
      name: "Habiba Walid",
      title: "Biomedical Data Engineer",
      mutualConnections: "Noor Emad and 5 other mutual connections",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      profileUrl: "/profile/Habiba-Walid",
    },
    
    {
      id: 5,
      name: "Mohanad Tarek",
      title: "Full Stack Developer",
      mutualConnections: "Noha Adel and 10 other mutual connections",
      image: "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      profileUrl: "/profile/Mohanad-Tarek",
    },
    {
      id: 6,
      name: "Salsabil Mostafa",
      title: "UX/UI Designer",
      mutualConnections: "Karim Nabil and 6 other mutual connections",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      profileUrl: "/profile/Salsabil-Mostafa",
    },
    {
      id: 7,
      name: "Mehrati Sameh",
      title: "Electrical Engineer",
      mutualConnections: "Nada Omar and 9 other mutual connections",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      profileUrl: "/profile/Mehrati-Sameh",
    },
    {
      id: 8,
      name: "Mayar Ahmed",
      title: "Cloud Architect at AWS",
      mutualConnections: "Aya Ibrahim is a mutual connection",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
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

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {people.map((person) => (
          <div key={person.id} className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-full flex flex-col">
            
           
            <button
              onClick={() => removePerson(person.id)}
              className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

          
            <div className="flex flex-col items-center text-center flex-grow">
              <a href={person.profileUrl}className="flex flex-col items-center">
                <img src={person.image} alt={person.name} className="w-20 h-20 rounded-full mb-3 mx-auto" />
                <p className="text-gray-900 dark:text-white font-semibold">{person.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{person.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{person.mutualConnections}</p>
              </a>
            </div>

            
            <button
  onClick={() => removePerson(person.id)}
  className="mt-2 w-full border border-blue-600 text-blue-600 font-semibold py-1 rounded-full flex items-center justify-center gap-2 hover:bg-blue-100 transition cursor-pointer"
>
 
  <FaUserPlus />
  Connect
</button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectWithPeople;
