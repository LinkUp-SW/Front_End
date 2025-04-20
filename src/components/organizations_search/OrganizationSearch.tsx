import React, { useEffect, useState, useRef } from "react";
import { Organization } from "@/types";
import { FormInput } from "@/components";

interface OrganizationSearchProps {
  label: string;
  selectedOrganization: Organization | null;
  onSelect: (organization: Organization) => void;
  fetchOrganizations: (query: string) => Promise<Organization[]>;
  placeholder: string;
  id: string;
  name: string;
}

const OrganizationSearch: React.FC<OrganizationSearchProps> = ({
  label,
  selectedOrganization,
  onSelect,
  fetchOrganizations,
  placeholder,
  id,
  name,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInput = useRef(false);

  // Sync input with externally selected org
  useEffect(() => {
    setSearchQuery(selectedOrganization?.name || "");
    setHasSearched(false); // reset feedback when externally changed
    setOrganizations([]);
  }, [selectedOrganization]);

  useEffect(() => {
    if (!isUserInput.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    // if user cleared the input, hide everything
    if (!searchQuery.trim()) {
      setOrganizations([]);
      setHasSearched(false);
      setIsLoading(false);
      isUserInput.current = false;
      return;
    }

    setIsLoading(true);
    // mark that we’re about to run a lookup
    setHasSearched(true);

    timerRef.current = setTimeout(() => {
      fetchOrganizations(searchQuery)
        .then((data) => setOrganizations(data))
        .catch(() => {
          setOrganizations([]); // on error, clear
        })
        .finally(() => {
          setIsLoading(false);
          isUserInput.current = false;
        });
    }, 500);
  }, [searchQuery, fetchOrganizations]);

  const handleSelect = (organization: Organization) => {
    onSelect(organization);
    setOrganizations([]);
    setHasSearched(false);
  };

  // Should we render the dropdown?
  const showDropdown =
    isLoading ||
    organizations.length > 0 ||
    (hasSearched && !isLoading && organizations.length === 0);

  return (
    <div className="relative w-full">
      <FormInput
        label={label}
        value={searchQuery}
        onChange={(e) => {
          isUserInput.current = true;
          setSearchQuery(e.target.value);
        }}
        placeholder={placeholder}
        id={id}
        name={name}
      />

      {showDropdown && (
        <div className="w-full max-h-fit p-2 bg-white dark:border-gray-400 border dark:bg-gray-800 rounded-lg absolute top-22 z-50">
          {isLoading ? (
            <OrganizationSearchSkeleton />
          ) : organizations.length > 0 ? (
            <ul className="space-y-2">
              {organizations.map((org) => (
                <li
                  key={org._id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                  onClick={() => handleSelect(org)}
                >
                  <img
                    src={org.logo}
                    alt={`${org.name} logo`}
                    className="h-10 w-10 object-contain rounded-lg"
                  />
                  <p>{org.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            // Friendly “no results” message
            <div className="py-2 text-gray-500 dark:text-gray-400 z-50">
              No results found for “{searchQuery.trim()}”.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrganizationSearchSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex items-center gap-2 z-50">
        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
);

export default OrganizationSearch;
