import { useState } from "react";

export interface People {
  id: number;
  name: string;
  title: string;
  mutualConnections: string;
  image: string;
  profileUrl: string;
  coverImage?: string;
}

const Invitations = () => {
  const [invitations, setInvitations] = useState<People[]>([
    {
      id: 1,
      name: "Nada Omar",
      title: "Sophomore Electronics and Electrical Communications Engineering, Cairo University",
      mutualConnections: "Haneen Mohamed and 38 other mutual connections",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg", 
      profileUrl: "/profile/Nada-Omar",
    },
    {
      id: 2,
      name: "Ghada Tarek",
      title: "AI and Data Science Student",
      mutualConnections: "Esraa Elbaz is a mutual connection",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      profileUrl: "/profile/Ghada-Tarek",
    },
    {
      id: 3,
      name: "Malak Ahmed",
      title: "Attended Ain Shams University",
      mutualConnections: "Nour Ahmed and 4 other mutual connections",
      image: "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      profileUrl: "/profile/Malak-Ahmed",
    },
  ]);

  
  const acceptInvitation = (id: number) => {
    setInvitations((prev) => prev.filter((invitation) => invitation.id !== id));
  };

  
  const ignoreInvitation = (id: number) => {
    setInvitations((prev) => prev.filter((invitation) => invitation.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Invitations ({invitations.length})
      </h2>
      <ul className="space-y-4">
        {invitations.map((invite) => (
          <li key={invite.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <a href={invite.profileUrl} className="flex items-center space-x-4 flex-1">
              <img src={invite.image} alt={invite.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{invite.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{invite.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{invite.mutualConnections}</p>
              </div>
            </a>
            <div className="flex space-x-2">
              <button
                onClick={() => ignoreInvitation(invite.id)}
                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                Ignore
              </button>
              <button
                onClick={() => acceptInvitation(invite.id)}
                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Accept
              </button>
            </div>
          </li>
        ))}
      </ul>
      {invitations.length === 0 && <p className="text-gray-500 dark:text-gray-400 mt-4">No pending invitations</p>}
    </div>
  );
};

export default Invitations;

