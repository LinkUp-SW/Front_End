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
  MyItemsPage,
  AccountPreferencePage,
  InstructionPage,
  ReasonPage,
  OtherOptionPage,
  AllPeoplePage,
  CompanyCreationPage,
  ManageCompanyPage,
  CreateJobPage,
  CompanyProfileView,
  DashboardPage,
  UsersPage,
  AnalyticsPage,
  ContentModerationPage,
  GoodByePage,
  ChangePasswordPage,
  CloseAccountPage,
  PrimaryEmailPage,
  OTP,
  AddEmailPage,
  VisibilityPage,
  BlockingListPage,
  DisplayPage,
  ConnectionRequest,
  ProfileVisibility,
  SubscriptionBillingPage,
  PaymentStatusPage,
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
    path: "/settings/preference",
    element: React.createElement(AccountPreferencePage),
  },
  // New routes for account closing flow
  {
    path: "/settings/close-account",
    element: React.createElement(InstructionPage),
  },
  {
    path: "/settings/close-account/reason",
    element: React.createElement(ReasonPage),
  },
  {
    path: "/settings/close-account/other-option",
    element: React.createElement(OtherOptionPage),
  },
  {
    path: "/settings/close-account/confirm",
    element: React.createElement(CloseAccountPage),
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

  {
    path: "/settings/visibility",
    element: React.createElement(VisibilityPage),
  },
  {
    path: "/settings/visibility/blocking",
    element: React.createElement(BlockingListPage),
  },
  {
    path: "/admin/dashboard",
    element: React.createElement(DashboardPage),
  },

  {
    path: "/admin/users",
    element: React.createElement(UsersPage),
  },
  {
    path: "/admin/analytics",
    element: React.createElement(AnalyticsPage),
  },
  {
    path: "/admin/content-moderation",
    element: React.createElement(ContentModerationPage),
  },

  {
    path: "/company/:companyId",
    element: React.createElement(CompanyProfileView),
  },
  {
    path: "/goodbye",
    element: React.createElement(GoodByePage),
  },
  {
    path: "/settings/theme",
    element: React.createElement(DisplayPage),
  },
  {
    path: "/settings/visibility/connection-request",
    element: React.createElement(ConnectionRequest),
  },
  {
    path: "/settings/visibility/profile",
    element: React.createElement(ProfileVisibility),
  },
  {
    path: "/settings/subscription-billing",
    element: React.createElement(SubscriptionBillingPage),
  },
  {
    path: "/payment",
    element: React.createElement(PaymentStatusPage),
  },
  {
    path: "/logout",
    element: React.createElement(LandingPage),
  },
];

export default routes;
