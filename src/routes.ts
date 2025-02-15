// src/routes.ts

import { RouteObject } from 'react-router-dom';
import { HomePage } from './pages';
import React from 'react';

// Define your routes as an array of RouteObject (compatible with React Router v6)
const routes: RouteObject[] = [
    //Add routes and their corresponding needed component page
  {
    path: '/',
    element: React.createElement(HomePage),
  },
];

export default routes;
