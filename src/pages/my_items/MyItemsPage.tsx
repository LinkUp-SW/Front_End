import { SavedPostsDashboard, WithNavBar } from "@/components";
import { useLocation } from "react-router-dom";
import {
  LeftSidebar,
  JobsDashboard,
  InterviewTipsPanel,
  Footer,
} from "@/components";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { refetchUserBio } from "@/slices/user_profile/userBioSlice";
import Cookies from "js-cookie";

const token = Cookies.get("linkup_auth_token");
const userId = Cookies.get("linkup_user_id");

const MyItemsPage: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState("saved-jobs");
  const location = useLocation();
  const pathname = location.pathname.split("/")[2];
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (pathname === "saved-jobs" || !pathname) {
      setSelectedPage("saved-jobs");
    } else {
      setSelectedPage("saved-posts");
    }
    if (token && userId) {
      dispatch(refetchUserBio({ token, userId }));
    }
  }, []);

  useEffect(() => {
    if (selectedPage === "saved-posts") {
      window.history.replaceState(null, "", "/my-items/saved-posts");
    } else {
      window.history.replaceState(null, "", "/my-items/saved-jobs");
    }
  }, [selectedPage]);

  return (
    <div className="min-h-screen dark:bg-black">
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <LeftSidebar
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </div>

          {selectedPage === "saved-jobs" ? (
            <>
              <div className="md:col-span-6">
                <JobsDashboard />
              </div>

              <div className="md:col-span-3">
                <InterviewTipsPanel />
              </div>
            </>
          ) : (
            <div className="md:col-span-6">
              <SavedPostsDashboard />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WithNavBar(MyItemsPage);
