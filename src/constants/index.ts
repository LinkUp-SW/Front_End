import { GoHomeFill } from "react-icons/go";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBell, FaBriefcase,FaUserAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";

export const LARGE_SCREEN_NAV_ITEMS = [
  {
    path: "/feed",
    icon: GoHomeFill, // Works because ReactNode is the correct type
    title: "Home",
  },
  {
    path: "/my-network",
    icon: FaPeopleGroup, // Works because ReactNode is the correct type
    title: "My Network",
  },
  {
    path: "/jobs",
    icon: FaBriefcase, // Works because ReactNode is the correct type
    title: "Jobs",
  },
  {
    path: "/messaging",
    icon: BsChatDotsFill, // Works because ReactNode is the correct type
    title: "Messaging",
  },
  {
    path: "/notifications",
    icon: FaBell, // Works because ReactNode is the correct type
    title: "Notifications",
  },
];

export const SMALL_SCREEN_NAV_ITEMS = [
  {
    path: "/feed",
    icon: GoHomeFill, // Works because ReactNode is the correct type
    title: "Home",
  },
  {
    path: "/my-network",
    icon: FaPeopleGroup, // Works because ReactNode is the correct type
    title: "My Network",
  },
  {
    path: "#",
    icon: FaUserAlt, // Works because ReactNode is the correct type
    title: "Profile",
  },
  {
    path: "/notifications",
    icon: FaBell, // Works because ReactNode is the correct type
    title: "Notifications",
  },
  {
    path: "/jobs",
    icon: FaBriefcase, // Works because ReactNode is the correct type
    title: "Jobs",
  },
];
