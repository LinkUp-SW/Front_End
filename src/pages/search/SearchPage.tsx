import React, { useEffect, useState } from "react";
import { WithNavBar } from "../../components";
import { useSearchParams } from "react-router-dom";
import People from "./components/People";
import Jobs from "./components/Jobs";
import Posts from "./components/Posts";
import Cookies from "js-cookie";
import { getusers, Person } from "@/endpoints/myNetwork";
import withSidebarAd from "@/components/hoc/withSidebarAd";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const token = Cookies.get("linkup_auth_token");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobsFound, setJobsFound] = useState<boolean | null>(null);
  const [postsFound, setPostsFound] = useState<boolean | null>(null);

  const hasQuery = !!query;

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

  const hasPeople = people.length > 0;
  const hasPosts = postsFound === true;
  const hasJobs = jobsFound === true;
  const hasResults = hasPeople || hasPosts || hasJobs;

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter === activeFilter ? null : filter);
    const element = document.getElementById(filter);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const FilterSidebar = () => (
    <aside className="sticky top-24 h-fit w-full md:w-56 bg-white border rounded-md p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filter Results</h2>
      <nav className="flex flex-col gap-1">
        {hasPeople && (
          <button
            onClick={() => handleFilterClick("people")}
            className={`px-3 py-2 text-left rounded-md transition-all ${
              activeFilter === "people"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
            }`}
          >
            People
          </button>
        )}
        {hasPosts && (
          <button
            onClick={() => handleFilterClick("posts")}
            className={`px-3 py-2 text-left rounded-md transition-all ${
              activeFilter === "posts"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
            }`}
          >
            Posts
          </button>
        )}
        {hasJobs && (
          <button
            onClick={() => handleFilterClick("jobs")}
            className={`px-3 py-2 text-left rounded-md transition-all ${
              activeFilter === "jobs"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
            }`}
          >
            Jobs
          </button>
        )}
      </nav>
    </aside>
  );

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      {hasQuery && hasResults && (
        <div className="hidden md:block w-full md:w-56">
          <FilterSidebar />
        </div>
      )}

      <main className="flex-1 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hasQuery ? ( // Changed from hasResults to hasQuery
          <>
            {hasPeople ? (
              <section id="people">
                <People people={people} setPeople={setPeople} query={query} />
              </section>
            ) : null}

            {/* Always render Posts when there's a query */}
            <section id="posts">
              <Posts query={query} setPostsFound={setPostsFound} />
            </section>

            {/* Always render Jobs when there's a query */}
            <section id="jobs">
              <Jobs query={query} setJobsFound={setJobsFound} />
            </section>
          </>
        ) : (
          <div className="w-full text-center text-gray-500 border rounded-md p-6 shadow-sm">
            <p className="text-lg font-medium">Please enter a search query.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const SearchPageWithSidebarAd = withSidebarAd(SearchPage);
export default WithNavBar(SearchPageWithSidebarAd);
