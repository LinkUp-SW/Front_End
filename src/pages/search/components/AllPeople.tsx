// src/pages/AllPeople/AllPeople.tsx

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { getusers } from "@/endpoints/myNetwork";
import { Person, UsersResponse, Pagination } from "@/endpoints/myNetwork";
import withSidebarAd from "@/components/hoc/withSidebarAd";

const AllPeople: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [people, setPeople] = useState<Person[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5, // Changed to 5 users per page
    pages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [connectionFilter, setConnectionFilter] = useState<"all" | "1st" | "2nd" | "3rd">("all");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("linkup_auth_token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response: UsersResponse = await getusers(
          token,
          query,
          connectionFilter === "all" ? "" : connectionFilter,
          currentPage,
          pagination.limit
        );
        setPeople(response.people);
        setPagination({
          ...response.pagination,
          limit: 5 // Ensure we always display 5 per page
        });
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, query, connectionFilter, currentPage, pagination.limit]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">All People</h2>
        
        {/* Connection Degree Filter */}
        <div className="mb-4 flex space-x-2">
          <button 
            onClick={() => {
              setConnectionFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm ${connectionFilter === "all" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            All
          </button>
          <button 
            onClick={() => {
              setConnectionFilter("1st");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm ${connectionFilter === "1st" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            1st Degree
          </button>
          <button 
            onClick={() => {
              setConnectionFilter("2nd");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm ${connectionFilter === "2nd" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            2nd Degree
          </button>
          <button 
            onClick={() => {
              setConnectionFilter("3rd");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm ${connectionFilter === "3rd" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            3rd Degree
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* People List */}
            <div className="space-y-4">
              {people.length > 0 ? (
                people.map((person, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border-b last:border-none bg-white dark:bg-gray-800">
                    <div className="flex items-center space-x-4">
                      {person.profile_photo ? (
                        <img 
                          src={person.profile_photo} 
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {person.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{person.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{person.headline}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{person.location}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {person.mutual_connections?.count > 0 && 
                            `${person.mutual_connections.count} mutual connection${person.mutual_connections.count > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    {person.connection_degree === "1st" ? (
                      <button className="px-4 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700">
                        Message
                      </button>
                    ) : (
                      <button className="px-4 py-2 border rounded-full text-gray-600 border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
                        Connect
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No people found matching your search criteria
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 mx-1 rounded disabled:opacity-50"
                >
                  &lt; Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  // Show limited page numbers (max 5) around current page
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 mx-1 rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {pagination.pages > 5 && currentPage < pagination.pages - 2 && (
                  <span className="px-3 py-1 mx-1">...</span>
                )}
                
                {pagination.pages > 5 && currentPage < pagination.pages - 2 && (
                  <button
                    onClick={() => paginate(pagination.pages)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === pagination.pages ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {pagination.pages}
                  </button>
                )}
                
                <button 
                  onClick={() => paginate(currentPage < pagination.pages ? currentPage + 1 : pagination.pages)}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 mx-1 rounded disabled:opacity-50"
                >
                  Next &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default withSidebarAd(AllPeople);