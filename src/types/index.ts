export interface test {
  name: string;
}
export interface RemoveConnectionData {
  userId: number;
  userName: string;
}

export interface Notification {
  id: string;
  type: "job" | "post" | "hiring" | "course" | "analytics" | "recommendation";
  content: string;
  time: string;
  profileImg?: string;
  action?: string;
  actionLink?: string;
  location?: string;
  count?: number;
  isNew?: boolean;
}

export type PostFilter = "all" | "comments" | "reactions" | "reposts";
export interface Experience {
  _id: string;
  title: string;
  employee_type: string;
  company: string;
  is_current: boolean;
  start_date: Date;
  end_date?: Date;
  location: string;
  description: string;
  location_type: string;
  where_did_you_find_us: string;
  skills: string[];
  media: Media;
}

export interface Skill {
  name: string;
  endorsments: string[];
  used_where: [
    education: string[],
    certificate: string[],
    experience: string[]
  ];
}

export interface Media {
  image: string[];
  video: string[];
}

export enum JobTypeEnum {
  full_time = "Full-time",
  part_time = "Part-time",
  contract = "Contract",
  temporary = "Temporary",
  other = "Other",
  volunteer = "Volunteer",
  internship = "Internship",
}

export interface UserStarterInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  isStudent: boolean;
  jobTitle?: string;
  school?: string;
  schoolStarterYear?: string;
  schoolEndYear?: string;
  is16OrAbove?: boolean;
  employeeType?: string;
  recentCompany?: string;
  birthDate?: Date;
}
