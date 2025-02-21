import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const ThemeListener = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
};

export default ThemeListener;
