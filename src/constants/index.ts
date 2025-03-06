import { GoHomeFill } from "react-icons/go";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBell, FaBriefcase, FaUserAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";

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


