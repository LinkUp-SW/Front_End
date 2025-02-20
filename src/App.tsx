// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import { useSelector } from 'react-redux';
import { RootState } from './store';
const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
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
  );
};

export default App;
