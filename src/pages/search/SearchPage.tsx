import { WithNavBar } from "../../components";
import { useParams } from "react-router-dom";
import People from "./components/People";
import Jobs from "./components/Jobs";

// Sample Data
const people = [
  {
    name: "Nada Salem",
    title: "Front end developer",
    location: "Giza",
    mutualConnections: "Ahmed Khattab, Yousef Gilany, and 19 other mutual connections",
    avatar: "https://via.placeholder.com/50",
    isConnected: true,
    industry: "Front end",
  },
  {
    name: "Nada Khaled",
    title: "Front end developer",
    location: "Cairo, Egypt",
    mutualConnections: "Marwan Abdellah, AbdEl-Monem El-Sharkawy, PhD, and 70 other mutual connections",
    avatar: "https://via.placeholder.com/50",
    isConnected: true,
    industry: "Front end",
  },
  {
    name: "Nada Zayed",
    title: "Backend Developer",
    location: "Alexandria, Egypt",
    mutualConnections: "Ibrahim Sobh, PhD, and 47 other mutual connections",
    avatar: "https://via.placeholder.com/50",
    isConnected: false,
    industry: "Backend",
  },
];

const jobs = [
  {
    title: "Front end Developer - Internship",
    company: "Tech Solutions",
    location: "Cairo, Egypt (Hybrid)",
    applicants: "<10 Applicants",
    alumni: "23 alumni work here",
    time: "3 days ago",
    logo: "https://via.placeholder.com/50",
  },
  {
    title: "Internship Program - Front end developer - Jumia (Full Time)",
    company: "Jumia Group",
    location: "Cairo, Cairo, Egypt (Hybrid)",
    applicants: "<10 Applicants",
    alumni: "23 alumni work here",
    time: "3 months ago",
    logo: "https://via.placeholder.com/50",
  },
  {
    title: "Front end developer Intern",
    company: "Aleph Group, Inc",
    location: "Cairo, Cairo, Egypt (Hybrid)",
    applicants: "<10 Applicants",
    alumni: "13 alumni work here",
    time: "1 week ago",
    logo: "https://via.placeholder.com/50",
  },
  {
    title: "Backend Developer - Junior",
    company: "Innovatech",
    location: "Alexandria, Egypt (Remote)",
    applicants: "<50 Applicants",
    alumni: "10 alumni work here",
    time: "1 week ago",
    logo: "https://via.placeholder.com/50",
  },
  {
    title: "Front end developer - Part time",
    company: "Aim Consultants LLC",
    location: "Heliopolis, Cairo, Egypt (On-site)",
    applicants: "<10 Applicants",
    alumni: "",
    time: "10 hours ago",
    logo: "https://via.placeholder.com/50",
  },
];

const SearchPage: React.FC = () => {
  const { query } = useParams<{ query: string }>();

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(query?.toLowerCase() || "") ||
      person.industry.toLowerCase().includes(query?.toLowerCase() || "")
  );

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(query?.toLowerCase() || "") ||
      job.company.toLowerCase().includes(query?.toLowerCase() || "")
  );

  return (
    <div className="container mx-auto p-4">
      
      {query ? (
        <>
          <People people={filteredPeople} />
          <Jobs jobs={filteredJobs} />
        </>
      ) : null}
    </div>
  );
};

export default WithNavBar(SearchPage);
