// src/routes.ts

import { RouteObject } from 'react-router-dom';
import { LandingPage,FeedPage } from './pages';
import React from 'react';

// Define your routes as an array of RouteObject (compatible with React Router v6)
const routes: RouteObject[] = [
    //Add routes and their corresponding needed component page
  {
    path: '/',
    element: React.createElement(LandingPage),
  },
  {
    path: '/feed',
    element: React.createElement(FeedPage),
  },
];

export default routes;
