import { GoHomeFill } from "react-icons/go";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBell, FaBriefcase, FaUserAlt} from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { CgTimelapse } from "react-icons/cg";
import { RiMoreLine } from "react-icons/ri";

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
    path: `/user-profile`,
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

export const FILTER_OPTIONS_MESSAGES = {
  UNREAD: "Unread",
  MY_CONNECTIONS: "My Connections",
  INMAIL: "InMail",
  STARRED: "Starred",
};

export const FILTERS_LIST_MESSAGES = Object.values(FILTER_OPTIONS_MESSAGES);

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
    id: "add-education-button",
    title: "Add education",
    key: "education",
  },
  {
    id: "add-experience-button",
    title: "Add experience",
    key: "experience",
  },
  {
    id: "add-skills-button",
    title: "Add skills",
    key: "skills",
  },
];

export const RECOMMENDED_PROFILE_SECTIONS = [
  {
    id: "add-license-button",
    title: "Add License",
    key: "license",
  },
  {
    id: "add-resume-button",
    title: "Add Resume",
    key: "resume",
  },
];


export const FOOTER_LINKS = [
  { text: "About", url: "#" },
  { text: "Accessibility", url: "#" },
  { text: "Help Center", url: "#" },
  { text: "Privacy & Terms", url: "#", hasArrow: true },
  { text: "Ad Choices", url: "#" },
  { text: "Advertising", url: "#" },
  { text: "Business Services", url: "#", hasArrow: true },
  { text: "Get the LinkUp app", url: "#" },
  { text: "More", url: "#" },
];

export const JOB_COLLECTIONS = [
  { id: "easy", title: "Easy Apply", icon: HiOutlineDocumentText },
  { id: "remote", title: "Remote", icon: BsChatDotsFill },
  { id: "part-time", title: "Part-time", icon: CgTimelapse },
  { id: "more", title: "More", icon: RiMoreLine },
];


export const POST_ACTIONS: Record<string, string> = {
  like: "likes this",
  love: "loves this",
  insightful: "finds this insightful",
  celebrate: "celebrates this",
  funny: "finds this funny",
  support: "supports this",
  comment: "commented on this",
  repost: "reposted this",

  error: "no action",
};

// Map of Egypt and Middle Eastern countries to their corresponding major cities
export const COUNTRY_CITY_MAP: { [key: string]: string[] } = {
  Egypt: [
    "Cairo",
    "Alexandria",
    "Giza",
    "Shubra El Kheima",
    "Port Said",
    "Suez",
    "Mansoura",
    "Tanta",
    "Asyut",
    "Ismailia",
    "Faiyum",
    "Zagazig",
    "Damietta",
    "Damanhur",
    "Minya",
    "Luxor",
    "Aswan",
  ],
  "Saudi Arabia": [
    "Riyadh",
    "Jeddah",
    "Mecca",
    "Medina",
    "Dammam",
    "Taif",
    "Tabuk",
    "Abha",
    "Khamis Mushait",
    "Khobar",
  ],
  "United Arab Emirates": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Al Ain",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ],
  Qatar: [
    "Doha",
    "Al Rayyan",
    "Al Wakrah",
    "Al Khor",
    "Umm Salal",
    "Mesaieed",
    "Dukhan",
  ],
  Kuwait: [
    "Kuwait City",
    "Salmiya",
    "Hawalli",
    "Al Farwaniya",
    "Al Ahmadi",
    "Jahra",
    "Mubarak Al-Kabeer",
  ],
  Oman: ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur", "Ibra", "Rustaq"],
  Bahrain: ["Manama", "Muharraq", "Riffa", "Isa Town", "Sitra"],
  Jordan: [
    "Amman",
    "Zarqa",
    "Irbid",
    "Aqaba",
    "Salt",
    "Mafraq",
    "Ma'an",
    "Karak",
  ],
  Lebanon: ["Beirut", "Tripoli", "Sidon", "Tyre", "Zahle", "Byblos", "Jounieh"],
  Iraq: [
    "Baghdad",
    "Basra",
    "Mosul",
    "Erbil",
    "Sulaymaniyah",
    "Najaf",
    "Karbala",
    "Kirkuk",
    "Duhok",
  ],
  Syria: [
    "Damascus",
    "Aleppo",
    "Homs",
    "Latakia",
    "Hama",
    "Deir ez-Zor",
    "Idlib",
    "Daraa",
    "Raqqa",
  ],
  Iran: [
    "Tehran",
    "Mashhad",
    "Isfahan",
    "Karaj",
    "Shiraz",
    "Tabriz",
    "Qom",
    "Ahvaz",
    "Kermanshah",
    "Urmia",
    "Rasht",
    "Zahedan",
  ],
  Yemen: [
    "Sana'a",
    "Aden",
    "Taiz",
    "Al Hudaydah",
    "Ibb",
    "Mukalla",
    "Sa'dah",
    "Zabid",
  ],
  Turkey: [
    "Istanbul",
    "Ankara",
    "Izmir",
    "Bursa",
    "Adana",
    "Gaziantep",
    "Konya",
    "Antalya",
    "Kayseri",
    "Mersin",
    "Diyarbakir",
    "Eskişehir",
    "Samsun",
    "Denizli",
    "Trabzon",
    "Erzurum",
    "Malatya",
  ],
};

// Map of Egypt and Middle Eastern countries to their international dialing codes
export const COUNTRY_PHONE_CODE_MAP: { [key: string]: string } = {
  Egypt: "+20",
  "Saudi Arabia": "+966",
  "United Arab Emirates": "+971",
  Qatar: "+974",
  Kuwait: "+965",
  Oman: "+968",
  Bahrain: "+973",
  Jordan: "+962",
  Lebanon: "+961",
  Iraq: "+964",
  Syria: "+963",
  Iran: "+98",
  Yemen: "+967",
  Turkey: "+90",
};

export const defaultProfileImage =
  "https://res.cloudinary.com/dyhnxqs6f/image/upload/v1719229880/meme_k18ky2_c_crop_w_674_h_734_x_0_y_0_u0o1yz.png";
