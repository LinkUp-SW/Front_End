import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Person {
  id: number;
  name: string;
  title: string;
  mutualConnections: string;
  image: string;
  coverImage: string;
  profileUrl: string;
}

const ConnectWithPeople = () => {
  const initialPeople: Person[] = [
    {
      id: 1,
      name: "Emily Johnson",
      title: "Software Engineer at Microsoft",
      mutualConnections: "John Smith and 12 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Emily-Johnson",
    },
    {
      id: 2,
      name: "Michael Brown",
      title: "Machine Learning Researcher",
      mutualConnections: "Sarah Williams is a mutual connection",
      image:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Michael-Brown",
    },
    {
      id: 3,
      name: "David Wilson",
      title: "Cybersecurity Analyst at IBM",
      mutualConnections: "Jennifer Davis and 8 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/David-Wilson",
    },
    {
      id: 4,
      name: "Jessica Taylor",
      title: "Biomedical Data Engineer",
      mutualConnections: "Robert Anderson and 5 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Jessica-Taylor",
    },
    {
      id: 5,
      name: "Daniel Martinez",
      title: "Full Stack Developer",
      mutualConnections: "Lisa Thompson and 10 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Daniel-Martinez",
    },
    {
      id: 6,
      name: "Sophia Anderson",
      title: "UX/UI Designer",
      mutualConnections: "Christopher Lee and 6 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Sophia-Anderson",
    },
    {
      id: 7,
      name: "Matthew Thomas",
      title: "Electrical Engineer",
      mutualConnections: "Amanda White and 9 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Matthew-Thomas",
    },
    {
      id: 8,
      name: "Olivia Garcia",
      title: "Cloud Architect at AWS",
      mutualConnections: "James Rodriguez is a mutual connection",
      image:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Olivia-Garcia",
    },
    {
      id: 9,
      name: "William Hernandez",
      title: "Data Scientist",
      mutualConnections: "Elizabeth Lopez and 7 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/William-Hernandez",
    },
    {
      id: 10,
      name: "Ava Martinez",
      title: "Product Manager",
      mutualConnections: "Ryan Gonzalez and 4 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Ava-Martinez",
    },
    {
      id: 11,
      name: "Ethan Robinson",
      title: "DevOps Engineer",
      mutualConnections: "Mia Perez and 11 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Ethan-Robinson",
    },
    {
      id: 12,
      name: "Isabella Clark",
      title: "Frontend Developer",
      mutualConnections: "Alexander Lewis and 3 other mutual connections",
      image:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      coverImage:
        "https://thingscareerrelated.com/wp-content/uploads/2021/10/default-background-image.png?w=862",
      profileUrl: "/profile/Isabella-Clark",
    },
  ];

  const [allSuggestions, setAllSuggestions] = useState<Person[]>(initialPeople);

  const removePerson = (id: number) => {
    setAllSuggestions((prev) => prev.filter((p) => p.id !== id));
  };

  const mainViewSuggestions = allSuggestions.slice(0, 6);

  const PersonCard = ({
    person,
    onRemove,
  }: {
    person: Person;
    onRemove: (id: number) => void;
  }) => (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center justify-between w-full max-w-[280px] min-h-[320px] mx-auto">
      <div className="h-20 w-full overflow-hidden rounded-t-lg">
        <img
          src={person.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex justify-center -mt-10">
        <img
          src={person.image}
          alt={person.name}
          className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800"
        />
      </div>
      <div className="text-center mt-2 space-y-0.5">
        <a href={person.profileUrl} className="space-y-0.5">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {person.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {person.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {person.mutualConnections}
          </p>
        </a>
      </div>
      <div className="mt-4 w-full">
        <button
          onClick={() => onRemove(person.id)}
          className="w-full border border-blue-600 text-blue-600 font-medium py-1 rounded-full flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
        >
          <FaUserPlus />
          Connect
        </button>
      </div>
      <button
        onClick={() => onRemove(person.id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
      >
        ✕
      </button>
    </div>
  );

  if (mainViewSuggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-5 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          People you may know based on education
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              Show all
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 bg-white p-6 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-900 dark:text-white">
                People you may know based on education
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {allSuggestions.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onRemove={removePerson}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainViewSuggestions.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            onRemove={removePerson}
          />
        ))}
      </div>
    </div>
  );
};

export default ConnectWithPeople;
