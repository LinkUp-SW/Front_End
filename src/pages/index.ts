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
import SignInAndSecurityPage from "./settings/SignInAndSecurityPage";
import ChangePasswordPage from "./settings/ChangePasswordPage";
import MyItemsPage from "./my_items/MyItemsPage";
import PrimaryEmailPage from "./settings/updateEmail/PrimaryEmailPage";
import OTP from "./settings/updateEmail/OTP";
import AddEmailPage from "./settings/updateEmail/AddEmailPage";
import AllPeoplePage from "./search/AllPeoplePage";
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
  ChangePasswordPage,
  MyItemsPage,
  PrimaryEmailPage,
  OTP,
  AddEmailPage,
  AllPeoplePage,
};