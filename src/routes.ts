// src/routes.ts

import { RouteObject } from 'react-router-dom';
import { LandingPage, FeedPage,UserProfilePage, MyNetworkPage,JobsPage,SeeMorePage,FollowingFollowers } from './pages';
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
    path: '/jobs',
    element: React.createElement(JobsPage),
  },
  {
    path: '/user-profile/:id',
    element: React.createElement(UserProfilePage)
  },
  {
    path: '/collections',
    element: React.createElement(SeeMorePage)
  },
  {
    path: '/my-network',
    element: React.createElement(MyNetworkPage)
  },

  {path:'/followingfollowers',
    element: React.createElement(FollowingFollowers)
    }
  
];

export default routes;
