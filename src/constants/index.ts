import { GoHomeFill } from "react-icons/go";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBell, FaBriefcase, FaUserAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { handleOpenModalType } from "../utils";

export const LARGE_SCREEN_NAV_ITEMS = [
  {
    path: "/feed",
    icon: GoHomeFill,
    title: "Home",
  },
  {
    path: "/my-network",
    icon: FaPeopleGroup,
    title: "My Network",
  },
  {
    path: "/jobs",
    icon: FaBriefcase,
    title: "Jobs",
  },
  {
    path: "/messaging",
    icon: BsChatDotsFill,
    title: "Messaging",
  },
  {
    path: "/notifications",
    icon: FaBell,
    title: "Notifications",
  },
];

export const SMALL_SCREEN_NAV_ITEMS = [
  {
    path: "/feed",
    icon: GoHomeFill,
    title: "Home",
  },
  {
    path: "/my-network",
    icon: FaPeopleGroup,
    title: "My Network",
  },
  {
    path: "#",
    icon: FaUserAlt,
    title: "Profile",
  },
  {
    path: "/notifications",
    icon: FaBell,
    title: "Notifications",
  },
  {
    path: "/jobs",
    icon: FaBriefcase,
    title: "Jobs",
  },
];




export const FILTER_OPTIONS = {
  ALL: "All",
  JOB_CHANGES: "Job changes",
  BIRTHDAYS: "Birthdays",
  WORK_ANNIVERSARIES: "Work anniversaries",
  EDUCATION: "Education",
};

export const FILTERS_LIST = Object.values(FILTER_OPTIONS);



export const CORE_PROFILE_SECTIONS = [
  {
    id: 1,
    title: "Add profile photo",
    onClickEvent: handleOpenModalType("profile_photo"),
  },
  {
    id: 2,
    title: "Add about",
    onClickEvent: handleOpenModalType("about"),
  },
  {
    id: 3,
    title: "Add education",
    onClickEvent: handleOpenModalType("education"),
  },
  {
    id: 4,
    title: "Add experience",
    onClickEvent: handleOpenModalType("experience"),
  },
  {
    id: 5,
    title: "Add services",
    onClickEvent: handleOpenModalType("services"),
  },
  {
    id: 6,
    title: "Add career break",
    onClickEvent: handleOpenModalType("career_break"),
  },
  {
    id: 7,
    title: "Add skills",
    onClickEvent: handleOpenModalType("skills"),
  },
];
