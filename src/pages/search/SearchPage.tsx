// src/pages/SearchPage/SearchPage.tsx
import React, { useEffect, useState } from "react";
import { WithNavBar } from "../../components";
import { useSearchParams } from "react-router-dom";
import People from "./components/People";
// import Jobs from "./components/Jobs";
import Cookies from "js-cookie";
import { getusers } from "@/endpoints/myNetwork";
import { Person } from "@/endpoints/myNetwork";

// export interface Job {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   type: string;
//   posted: string;
//   applicants: string;
//   description: string;
//   alumni: string;
//   time: string;
//   logo: string;
// }

// const mockJobs: Job[] = [
//   {
//     id: "1",
//     title: "Software Engineer",
//     company: "Tech Corp",
//     location: "San Francisco, CA",
//     type: "Full-time",
//     posted: "2 days ago",
//     applicants: "45 applicants",
//     description: "We're looking for a skilled software engineer...",
//     alumni: "5 alumni",
//     time: "Full-time",
//     logo: "/path/to/logo.png"
//   },
// ];

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
        const response = await getusers(
          token,
          query,
          "",
          1,
          6
        );
        setPeople(response.people);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, query]);

  // const filteredJobs = mockJobs.filter(
  //   (job) =>
  //     job.title.toLowerCase().includes(query?.toLowerCase() || "") ||
  //     job.company.toLowerCase().includes(query?.toLowerCase() || "")
  // );

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
            {/* <Jobs jobs={filteredJobs} /> */}
          </>
        )
      )}
    </div>
  );
};

export default WithNavBar(SearchPage);