import { GoHomeFill } from "react-icons/go";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBell, FaBriefcase, FaUserAlt, FaBookmark } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { BiSliderAlt } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsBarChartLine } from "react-icons/bs";
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
    id: 1,
    title: "Add profile photo",
    key: "profile_photo",
  },
  {
    id: 2,
    title: "Add about",
    key: "about",
  },
  {
    id: 3,
    title: "Add education",
    key: "education",
  },
  {
    id: 4,
    title: "Add experience",
    key: "experience",
  },
  {
    id: 5,
    title: "Add services",
    key: "services",
  },
  {
    id: 6,
    title: "Add career break",
    key: "career_break",
  },
  {
    id: 7,
    title: "Add skills",
    key: "skills",
  },
];

export const SIDEBAR_MENU_ITEMS = [
  {
    icon: BiSliderAlt,
    label: "Preferences",
  },
  {
    icon: FaBookmark,
    label: "My jobs",
  },
  {
    icon: BsBarChartLine,
    label: "My Career Insights",
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
  { text: "Get the LinkedIn app", url: "#" },
  { text: "More", url: "#" },
];

export const JOB_COLLECTIONS = [
  { id: "easy", title: "Easy Apply", icon: HiOutlineDocumentText },
  { id: "remote", title: "Remote", icon: BsChatDotsFill },
  { id: "part-time", title: "Part-time", icon: CgTimelapse },
  { id: "more", title: "More", icon: RiMoreLine },
];

export const JOB_CATEGORIES = [
  "For You",
  "Easy Apply",
  "Remote",
  "Part-time",
  "Hybrid",
  "IT",
  "Sustainability",
  "Government",
  "Healthcare",
  "Biotech",
  "Finance",
  "Construction",
  "HR",
  "Education",
  "Pharma",
  "Defense & Space",
  "Manufacturing",
  "Hospitality",
  "Social Impact",
  "Small Biz",
  "Real Estate",
  "Higher Ed",
  "Logistics",
  "Civil Eng",
  "Human Services",
  "Non-Profit",
  "Career Growth",
  "Media",
  "Food & Bev",
  "Recruiting",
  "Work Life Balance",
  "Marketing",
  "Fashion",
  "Retail",
  "Veterinary Med",
  "Digital Security",
];

export const SAMPLE_JOBS = [
  {
    id: "1",
    title: "Project Manager (Remote)",
    company: "Virtual Worker Now",
    location: "Egypt (Remote)",
    isRemote: true,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: true,
    hasEasyApply: true,
    reviewTime: "4 days",
  },
  {
    id: "2",
    title: "Business Analyst",
    company: "PSA BDP",
    location: "Cairo, Cairo, Egypt (On-site)",
    isRemote: false,
    isSaved: true,
    logo: "/api/placeholder/60/60",
    isPromoted: true,
    hasEasyApply: true,
    alumniCount: 2,
  },
  {
    id: "3",
    title: "Digital Product Manager",
    company: "Vezeeta",
    location: "Cairo, Egypt (On-site)",
    isRemote: false,
    isSaved: true,
    logo: "/api/placeholder/60/60",
    isPromoted: false,
    hasEasyApply: false,
    alumniCount: 21,
    applied: true,
  },
  {
    id: "4",
    title: "Project Manager",
    company: "Tahaluf",
    location: "Riyadh, Riyadh, Saudi Arabia (On-site)",
    isRemote: false,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: false,
    hasEasyApply: true,
    timePosted: "2 hours ago",
    alumniCount: 2,
  },
  {
    id: "5",
    title: "Project Manager Officer",
    company: "DXC Technology",
    location: "Egypt (Remote)",
    isRemote: true,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: false,
    hasEasyApply: false,
    connections: 4,
    applied: true,
    verified: true,
  },
];

export const MORE_JOBS = [
  {
    id: "6",
    title: "Mid Level Software Project Manager",
    company: "Arcsen",
    location: "Cairo, Cairo, Egypt (On-site)",
    isRemote: false,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: false,
    hasEasyApply: true,
    alumniCount: 5,
    postedTime: "5 months ago",
  },
  {
    id: "7",
    title: "Product Manager",
    company: "Clay",
    location: "Egypt (Remote)",
    isRemote: true,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: true,
    hasEasyApply: true,
  },
  {
    id: "8",
    title: "Senior Software Product Owner (Fintech)",
    company: "Arib",
    location: "Qesm 1st Nasser City, Cairo, Egypt (On-site)",
    isRemote: false,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: true,
    hasEasyApply: true,
    responseTime: "1-2 weeks",
  },
  {
    id: "9",
    title: "Product Owner",
    company: "Mondia Group",
    location: "Cairo, Cairo, Egypt (Hybrid)",
    isRemote: false,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: false,
    hasEasyApply: true,
    alumniCount: 14,
    postedTime: "1 month ago",
    workMode: "Hybrid",
  },
  {
    id: "10",
    title: "SAP Agile Master",
    company: "Luxoft",
    location: "Cairo, Egypt (Hybrid)",
    isRemote: false,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: false,
    hasEasyApply: false,
    applied: true,
    responseTime: "4 days",
    workMode: "Hybrid",
    verified: true,
  },
  {
    id: "11",
    title: "Product Manager",
    company: "Azentio",
    location: "Cairo, Egypt (Hybrid)",
    isRemote: false,
    isSaved: false,
    logo: "/api/placeholder/60/60",
    isPromoted: false,
    hasEasyApply: false,
    alumniCount: 6,
    workMode: "Hybrid",
  },
];

export const RECENT_SEARCHES = [
  { query: "project manager", location: "Cairo, Egypt", applyOn: true },
  {
    query: "project manager",
    location: "Riyadh, Saudi Arabia",
    applyOn: true,
    alert: true,
  },
  { query: "agile", location: "Cairo, Egypt", applyOn: false },
];

export const POST_ACTIONS: Record<string, string> = {
  like: "likes this",
  comment: "commented on this",
  repost: "reposted this",
  love: "loves this",
  insightful: "finds this insightful",
  celebrate: "celebrates this",
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
