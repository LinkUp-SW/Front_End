import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useInterceptBackNavigation = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // Push the dummy state immediately if it hasn't been pushed yet.
    window.history.pushState({ intercepted: true }, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // Check for our dummy state.
      if (event.state && event.state.intercepted) {
        const confirmLeave = window.confirm(
          "Are you sure you want to leave? Your data will be cleared."
        );
        if (confirmLeave) {
          localStorage.removeItem("user-signup-credentials");
          // Replace the current entry so the user cannot navigate back.
          navigate("/signup", { replace: true });
        } else {
          // Re-push our dummy state if the user cancels.
          window.history.pushState(
            { intercepted: true },
            "",
            window.location.href
          );
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
};


