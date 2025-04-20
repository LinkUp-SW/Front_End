import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPeopleYouMayKnow, PeopleYouMayKnow } from "@/endpoints/myNetwork";
import Cookies from "js-cookie";

interface PeopleSectionProps {
  token: string;
  context: string;
  title: string;
}

const PeopleSection = ({ token, context, title }: PeopleSectionProps) => {
  const [mainViewSuggestions, setMainViewSuggestions] = useState<PeopleYouMayKnow[]>([]);
  const [allSuggestions, setAllSuggestions] = useState<PeopleYouMayKnow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPeople = async () => {
    if (!token) return;

    setLoading(true);
    try {
      // Load initial 6 for main view
      const mainViewData = await getPeopleYouMayKnow(token, context, null, 6);
      setMainViewSuggestions(mainViewData.people);

      // Load all for dialog (adjust limit as needed)
      const allData = await getPeopleYouMayKnow(token, context, null, 50);
      setAllSuggestions(allData.people);
    } catch (error) {
      console.error(`Error fetching people you may know (${context}):`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, [token]);

  const removePerson = (id: string) => {
    setMainViewSuggestions((prev) => prev.filter((p) => p._id !== id));
    setAllSuggestions((prev) => prev.filter((p) => p._id !== id));
  };

  const PersonCard = ({
    person,
    onRemove,
  }: {
    person: PeopleYouMayKnow;
    onRemove: (id: string) => void;
  }) => (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center justify-between w-full max-w-[280px] min-h-[320px] mx-auto">
      <div className="h-20 w-full overflow-hidden rounded-t-lg">
        {person.cover_photo ? (
          <img
            src={person.cover_photo}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
      <div className="flex justify-center -mt-10">
        {person.profile_photo ? (
          <img
            src={person.profile_photo}
            alt={`${person.bio.first_name} ${person.bio.last_name}`}
            className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-semibold text-gray-600 dark:text-gray-300">
            {person.bio.first_name.charAt(0)}{person.bio.last_name.charAt(0)}
          </div>
        )}
      </div>
      <div className="text-center mt-2 space-y-0.5">
        <a href={`/profile/${person.user_id}`} className="space-y-0.5">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {person.bio.first_name} {person.bio.last_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {person.bio.headline}
          </p>
        </a>
      </div>
      <div className="mt-4 w-full">
        <button
          onClick={() => onRemove(person._id)}
          className="w-full border border-blue-600 text-blue-600 font-medium py-1 rounded-full flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
        >
          <FaUserPlus />
          Connect
        </button>
      </div>
      <button
        onClick={() => onRemove(person._id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
      >
        ✕
      </button>
    </div>
  );

  if (mainViewSuggestions.length === 0 && !loading) return null;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-5 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
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
                {title}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {allSuggestions.map((person) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  onRemove={removePerson}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-[320px] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainViewSuggestions.map((person) => (
            <PersonCard
              key={person._id}
              person={person}
              onRemove={removePerson}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ConnectWithPeople = () => {
  const token = Cookies.get("linkup_auth_token") || "";

  return (
    <div className="space-y-6">
      <PeopleSection
        token={token}
        context="education"
        title="People you may know based on education"
      />
      <PeopleSection
        token={token}
        context="work_experience"
        title="People you may know based on work experience"
      />
    </div>
  );
};

export default ConnectWithPeople;