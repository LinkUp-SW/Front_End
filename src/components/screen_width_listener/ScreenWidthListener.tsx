import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWidth } from "../../slices/screen/screenSlice";

const ScreenWidthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateWidth = () => dispatch(setWidth(window.innerWidth));

    window.addEventListener("resize", updateWidth);
    updateWidth(); // Set initial width

    return () => window.removeEventListener("resize", updateWidth);
  }, [dispatch]);

  return null; // No UI needed
};

export default ScreenWidthListener;
