import { WithNavBar } from "../../components";
import useFetchData from "../../hooks/useFetchData";
import { getUserInfoByID } from "../../endpoints/userProfile";
import { useParams } from "react-router-dom";
import { getErrorMessage } from "../../utils/errorHandler";

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useFetchData(
    () => (id ? getUserInfoByID(id) : Promise.reject(new Error("ID is undefined"))),
    [id]
  );

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {getErrorMessage(error)}</div>;

  if (!data) return null;

  return (
    <div>
      <h1>User Profile</h1>
      <p>
        {data.firstName} {data.lastName}
      </p>
    </div>
  );
};

export default WithNavBar(UserProfilePage);
