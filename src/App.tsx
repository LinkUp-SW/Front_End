// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';

const App: React.FC = () => {
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
