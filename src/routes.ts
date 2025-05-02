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
  MessagingPage,
  InvitationsManagerPage,
  SignInPage,
  SignUpPage,
  LocationPage,
  OrganizationPage,
  EmailVerification,
  ForgetPasswordPage,
  ResetPasswordPage,
  NotFoundPage,
  ConnectionsPage,
  FollowingFollowersPage,
  SearchPage,
  UserSkillsPage,
  UserEducationsPage,
  UserExperiencesPage,
  UserLicensesPage,
  SignInAndSecurityPage,
  ChangePasswordPage,
  MyItemsPage,
  AllPeoplePage,
  CompanyCreationPage,
  ManageCompanyPage,
  CreateJobPage,
  CompanyProfileView
} from "./pages";

import PrimaryEmailPage from "./pages/settings/updateEmail/PrimaryEmailPage";
import AddEmailPage from "./pages/settings/updateEmail/AddEmailPage";
import OTP from "./pages/settings/updateEmail/OTP";

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
    path: "/jobs/see-more",
    element: React.createElement(SeeMorePage),
  },
  {
    path: "/my-network",
    element: React.createElement(MyNetworkPage),
  },

  {
    path: "/following-followers",
    element: React.createElement(FollowingFollowersPage),
  },

  { path: "/connections/:id", element: React.createElement(ConnectionsPage) },
  {
    path: "/feed/posts/:id",
    element: React.createElement(FeedPage, { single: true }),
  },
  {
    path: "/user-profile/:id/posts",
    element: React.createElement(FeedPage, { profile: ":id" }),
  },

  {
    path: "/manage-invitations",
    element: React.createElement(InvitationsManagerPage),
  },

  {
    path: "/my-items/saved-jobs",
    element: React.createElement(MyItemsPage),
  },
  {
    path: "/my-items",
    element: React.createElement(MyItemsPage),
  },
  {
    path: "/my-items/saved-posts",
    element: React.createElement(MyItemsPage),
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
  {
    path: "/signup/organization",
    element: React.createElement(OrganizationPage),
  },
  {
    path: "/email-verification",
    element: React.createElement(EmailVerification),
  },
  {
    path: "/forget-password",
    element: React.createElement(ForgetPasswordPage),
  },
  {
    path: "/reset-password/:token",
    element: React.createElement(ResetPasswordPage),
  },
  {
    path: "*",
    element: React.createElement(NotFoundPage),
  },
  {
    path: "/search",
    element: React.createElement(SearchPage),
  },
  {
    path: "/user-profile/skills/:id",
    element: React.createElement(UserSkillsPage),
  },
  {
    path: "/user-profile/educations/:id",
    element: React.createElement(UserEducationsPage),
  },
  {
    path: "/user-profile/experiences/:id",
    element: React.createElement(UserExperiencesPage),
  },
  {
    path: "/user-profile/licenses/:id",
    element: React.createElement(UserLicensesPage),
  },
  {
    path: "/settings/security",
    element: React.createElement(SignInAndSecurityPage),
  },
  {
    path: "/settings/security/changepassword",
    element: React.createElement(ChangePasswordPage),
  },
  {
    path: "/settings/security/email",
    element: React.createElement(PrimaryEmailPage),
  },
  {
    path: "/settings/security/email/verify",
    element: React.createElement(OTP),
  },
  {
    path: "/settings/security/email/add",
    element: React.createElement(AddEmailPage),
  },
  {
    path: "/search/users",
    element: React.createElement(AllPeoplePage),
  },
  {
    path: "/company-creation",
    element: React.createElement(CompanyCreationPage),
  },
  {
    path: "/company-manage/:companyId",
    element: React.createElement(ManageCompanyPage),
  },
  {
    path: "/company-manage/:companyId/jobs/create",
    element: React.createElement(CreateJobPage),
  },
  {
    path: "/jobs/create",
    element: React.createElement(CreateJobPage),
  },
  {
    path: "/company/:companyId",
    element: React.createElement(CompanyProfileView),
  },

];

export default routes;
