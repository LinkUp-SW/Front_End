// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { ScreenWidthListener, ThemeListener, Toaster } from "./components";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <>
      <ScreenWidthListener />
      <ThemeListener />
      <Router>
        <Routes>
          {routes.map((route, index) => {
            // Destructure the path and element from each route object.
            // Since our routes array is strongly typed, we know each object contains these properties.
            const { path, element } = route;
            return <Route key={index} path={path} element={element} />;
          })}
        </Routes>
      </Router>
      <Toaster position="top-right" richColors theme={theme} />
    </>
  );
};

export default App;
