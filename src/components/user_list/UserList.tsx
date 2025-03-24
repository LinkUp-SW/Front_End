// src/components/UserList.tsx
import React from "react";
import useFetchData from "../../hooks/useFetchData";

const UserList: React.FC = () => {
  const { data, loading, error } = useFetchData(async () => {}, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Oops smth went wrong</div>;

  if (!data) return null;

  return (
    <div>
      {/* {data.firstName} {data.lastName} */}
    </div>
  );
};

export default UserList;
