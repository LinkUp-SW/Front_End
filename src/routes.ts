// src/routes.ts

import { RouteObject } from 'react-router-dom';
import { LandingPage,FeedPage, UserProfilePage,MessagingPage} from './pages';

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
  {
    path: '/user-profile/:id',
    element: React.createElement(UserProfilePage)
  },
  {
    path:'/messaging',
    element: React.createElement(MessagingPage)
  }
];

export default routes;
