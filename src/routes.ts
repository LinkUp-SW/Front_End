// src/routes.ts

import { RouteObject } from "react-router-dom";
import {
  LandingPage,
  FeedPage,
  UserProfilePage,
  NotificationsPage,
  MyNetworkPage,
  JobsPage,
  SeeMorePage,
  FollowingFollowers,
  Connections,
  MessagingPage,
  InvitationsManagerPage,
  SignInPage,
  SignUpPage,
  LocationPage,
} from "./pages";

import React from "react";

// Define your routes as an array of RouteObject (compatible with React Router v6)
const routes: RouteObject[] = [
  //Add routes and their corresponding needed component page
  {
    path: "/",
    element: React.createElement(LandingPage),
  },
  {
    path: "/feed",
    element: React.createElement(FeedPage),
  },
  {
    path: "/jobs",
    element: React.createElement(JobsPage),
  },
  {
    path: "/user-profile/:id",
    element: React.createElement(UserProfilePage),
  },
  {
    path: "/messaging",
    element: React.createElement(MessagingPage),
  },
  {
    path: "/notifications",
    element: React.createElement(NotificationsPage),
  },
  {
    path: "/collections",
    element: React.createElement(SeeMorePage),
  },
  {
    path: "/my-network",
    element: React.createElement(MyNetworkPage),
  },

  {
    path: "/followingfollowers",
    element: React.createElement(FollowingFollowers),
  },

  { path: "/connections", element: React.createElement(Connections) },

  {
    path: "/manage-invitations",
    element: React.createElement(InvitationsManagerPage),
  },
  {
    path: "/login",
    element: React.createElement(SignInPage),
  },
  {
    path: "/signup",
    element: React.createElement(SignUpPage),
  },
  {
    path: "/signup/location",
    element: React.createElement(LocationPage),
  },
];

export default routes;
