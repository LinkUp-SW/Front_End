import React, { useEffect, useState } from "react";
import { WithNavBar } from "../../components";
import { useSearchParams } from "react-router-dom";
import People from "./components/People";
import Jobs from "./components/Jobs";
import Cookies from "js-cookie";
import { getusers, Person } from "@/endpoints/myNetwork";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("linkup_auth_token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || !query) {
        setPeople([]);
        return;
      }

      setLoading(true);
      try {
        const response = await getusers(token, query, "", 1, 6);
        setPeople(response.people);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, query]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        query && (
          <>
            {people.length > 0 && <People people={people} setPeople={setPeople} query={query} />}
            <Jobs query={query} />
          </>
        )
      )}
    </div>
  );
};

export default WithNavBar(SearchPage);
