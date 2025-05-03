//Import the Pages Here
//This File is responsible for importing all the pages in one file to export it and be
//used for consise importing in other places
import LandingPage from "./landing/LandingPage";
import FeedPage from "./feed/FeedPage";
import UserProfilePage from "./user_profile/UserProfilePage";
import MessagingPage from "./messaging/MessagingPage";
import NotificationsPage from "./notifications/NotificationsPage";
import MyNetworkPage from "./mynetwork/MyNetworkPage";
import JobsPage from "./jobs/JobsPage";
import SeeMorePage from "./jobs/SeeMorePage";
import FollowingFollowers from "./mynetwork/components/FollowingFollowers";
import Connections from "./mynetwork/components/Connections";
import InvitationsManagerPage from "./mynetwork/InvitationsManagerPage";
import SignInPage from "./auth/sign_in/SignInPage";
import { SignUpPage, LocationPage, OrganizationPage } from "./auth/sign_up";
import EmailVerification from "./auth/email_verification/EmailVerification";
import ForgetPasswordPage from "./auth/forget_password/ForgetPasswordPage";
import ResetPasswordPage from "./auth/reset_password/ResetPasswordPage";
import NotFoundPage from "./404/NotFoundPage";
import ConnectionsPage from "./mynetwork/ConnectionsPage";
import FollowingFollowersPage from "./mynetwork/FollowingFollowersPage";
import SearchPage from "./search/SearchPage";
import UserSkillsPage from "./user_profile/user_skills/UserSkillsPage";
import UserEducationsPage from "./user_profile/user_educations/UserEducationsPage";
import UserLicensesPage from "./user_profile/user_licenses/UserLicensesPage";
import UserExperiencesPage from "./user_profile/user_experiences/UserExperiencesPage";
import MyItemsPage from "./my_items/MyItemsPage";
import AllPeoplePage from "./search/AllPeoplePage";
import CompanyCreationPage from "./company/CompanyCreationPage";
import ManageCompanyPage from "./company/ManageCompanyPage";
import CreateJobPage from "./company/CreateJobPage";
import AdminPanelSidebar from "./admin/components/AdminPanel";
import DashboardPage from "./admin/DashboardPage";
import SettingsPage from "./admin/SettingsPage";
import UsersPage from "./admin/UsersPage";
import AnalyticsPage from "./admin/AnalyticsPage";
import JobPostingsPage from "./admin/JobPostingsPage";
import ContentModerationPage from "./admin/ContentModerationPage";
import GoodByePage from "./goodbye/GoodByePage";
import {
  SignInAndSecurityPage,
  AccountPreferencePage,
  BlockingListPage,
  VisibilityPage,
  OTP,
  AddEmailPage,
  PrimaryEmailPage,
  DisplayPage,
  InstructionPage,
  CloseAccountPage,
  OtherOptionPage,
  ReasonPage,
  ChangePasswordPage,
  ConnectionRequest,
  ProfileVisibility,
  SubscriptionBillingPage
} from "./settings";

//Export the Imported Pages
export {
  LandingPage,
  FeedPage,
  UserProfilePage,
  JobsPage,
  SeeMorePage,
  MyNetworkPage,
  MessagingPage,
  FollowingFollowers,
  Connections,
  NotificationsPage,
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
  UserLicensesPage,
  UserExperiencesPage,
  SignInAndSecurityPage,
  MyItemsPage,
  AccountPreferencePage,
  InstructionPage,
  ReasonPage,
  OtherOptionPage,
  PrimaryEmailPage,
  OTP,
  AddEmailPage,
  AllPeoplePage,
  CompanyCreationPage,
  ManageCompanyPage,
  CreateJobPage,
  VisibilityPage,
  BlockingListPage,
  AdminPanelSidebar,
  DashboardPage,
  SettingsPage,
  UsersPage,
  AnalyticsPage,
  JobPostingsPage,
  ContentModerationPage,
  GoodByePage,
  DisplayPage,
  CloseAccountPage,
  ChangePasswordPage,
  ConnectionRequest,
  ProfileVisibility,
  SubscriptionBillingPage
};
