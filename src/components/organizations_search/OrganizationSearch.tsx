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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInput = useRef(false);

  useEffect(() => {
    setSearchQuery(selectedOrganization?.name || "");
  }, [selectedOrganization]);

  useEffect(() => {
    if (!isUserInput.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!searchQuery.trim()) {
      setOrganizations([]);
      isUserInput.current = false;
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      fetchOrganizations(searchQuery)
        .then((data) => {
          setOrganizations(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false))
        .finally(() => (isUserInput.current = false));
    }, 500);
  }, [searchQuery, fetchOrganizations]);

  const handleSelect = (organization: Organization) => {
    onSelect(organization);
    setOrganizations([]);
  };

  return (
    <div className="relative">
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

      {(isLoading || organizations.length > 0) && (
        <div className="w-full max-h-fit p-2 bg-white dark:border-gray-400 border dark:bg-gray-800 rounded-lg absolute top-22">
          {isLoading ? (
            <OrganizationSearchSkeleton />
          ) : (
            <ul className="space-y-2">
              {organizations.map((organization) => (
                <li
                  key={organization._id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                  onClick={() => handleSelect(organization)}
                >
                  <img
                    src={organization.logo}
                    alt="organization-logo"
                    className="h-10 w-10 object-contain rounded-lg"
                  />
                  <p>{organization.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const OrganizationSearchSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex items-center gap-2">
        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
);

export default OrganizationSearch;
