import { getUserSkills } from "@/endpoints/userProfile";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const SkillsSection = () => {
  const authToken = Cookies.get("linkup_auth_token");
  const { id } = useParams();
  const { data } = useFetchData(() =>
    authToken && id ? getUserSkills(authToken, id) : Promise.resolve(null)
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <div>SkillsSection</div>;
};

export default SkillsSection;
