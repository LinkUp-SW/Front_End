import { useState, useEffect, useCallback, useRef } from "react";
import { FaUserPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { getPeopleYouMayKnow, PeopleYouMayKnow } from "@/endpoints/myNetwork";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface PeopleSectionProps {
  token: string;
  context: string;
  title: string;
}

const PeopleSection = ({ token, context, title }: PeopleSectionProps) => {
  const [mainViewSuggestions, setMainViewSuggestions] = useState<PeopleYouMayKnow[]>([]);
  const [allSuggestions, setAllSuggestions] = useState<PeopleYouMayKnow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const loadInitialPeople = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await getPeopleYouMayKnow(token, context, null, 6);
      setMainViewSuggestions(data.people);
    } catch (error) {
      console.error(`Error fetching initial people (${context}):`, error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePeople = useCallback(async () => {
    if (!token || !hasMore || dialogLoading) return;

    setDialogLoading(true);
    try {
      const data = await getPeopleYouMayKnow(token, context, cursor, 3);
      
      setAllSuggestions(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const newPeople = data.people.filter(p => !existingIds.has(p._id));
        return [...prev, ...newPeople];
      });
      
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error(`Error fetching more people (${context}):`, error);
    } finally {
      setDialogLoading(false);
    }
    console.log("All suggestions:", allSuggestions);
  }, [token, cursor, hasMore, dialogLoading, context]);

  useEffect(() => {
    loadInitialPeople();
  }, [token]);

  const handleDialogOpen = async () => {
    setAllSuggestions([]);
    setCursor(null);
    setHasMore(true);
    await loadMorePeople();
  };

  const lastPersonRef = useCallback(
    (node: HTMLDivElement) => {
      if (dialogLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMorePeople();
          }
        },
        { root: dialogRef.current, threshold: 0.1 }
      );
      
      if (node) observer.current.observe(node);
    },
    [dialogLoading, hasMore, loadMorePeople]
  );

  const removePerson = (id: string) => {
    setMainViewSuggestions((prev) => prev.filter((p) => p._id !== id));
    setAllSuggestions((prev) => prev.filter((p) => p._id !== id));
  };

  const navigateToUser = (user_id: string) => {
    navigate(`/user-profile/${user_id}`);
  };

  const PersonCard = ({
    person,
    onRemove,
    isLast = false,
  }: {
    person: PeopleYouMayKnow;
    onRemove: (id: string) => void;
    isLast?: boolean;
  }) => (
    <div 
      ref={isLast ? lastPersonRef : null}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center justify-between w-full max-w-[280px] min-h-[320px] mx-auto"
    >
      <div 
        className="h-20 w-full overflow-hidden rounded-t-lg cursor-pointer"
        onClick={() => navigateToUser(person.user_id)}
      >
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
      <div 
        className="flex justify-center -mt-10 cursor-pointer"
        onClick={() => navigateToUser(person.user_id)}
      >
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
      <div 
        className="text-center mt-2 space-y-0.5 cursor-pointer"
        onClick={() => navigateToUser(person.user_id)}
      >
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {person.bio.first_name} {person.bio.last_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {person.bio.headline}
          </p>
        </div>
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

        <Dialog onOpenChange={(open) => open && handleDialogOpen()}>
          <DialogTrigger asChild>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              Show all
            </button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-6xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 bg-white p-6 rounded-lg"
            ref={dialogRef}
          >
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                List of people you may know based on {context}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {allSuggestions.map((person, index) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  onRemove={removePerson}
                  isLast={index === allSuggestions.length - 1}
                />
              ))}
            </div>
            {dialogLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {!hasMore && allSuggestions.length > 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No more people to show
              </p>
            )}
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