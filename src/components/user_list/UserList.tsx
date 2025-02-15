// src/components/UserList.tsx
import React, { useEffect, useState } from 'react';
import { getHomePageData } from '../../endpoints/home';

const UserList: React.FC = () => {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    getHomePageData().then((data)=>setUser(data))
  }, []);

  if (!user) return <div>Loading...</div>;

  return <div>{user.firstName} {user.lastName}</div>;
};

export default UserList;
