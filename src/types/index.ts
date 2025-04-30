export interface test {
  name: string;
}
export interface RemoveConnectionData {
  userId: string;
  userName: string;
}
export interface UnfollowUserType {
  userId: string;
  userName: string;
}

export interface WithdrawInvitationType {
  userId: string;
  userName: string;
}
export interface NotificationSender {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}
export interface Notification {
  id: string;
  sender: NotificationSender;
  createdAt: string;
  content: string;
  referenceId: string;
  type: string;
  isRead: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  unReadCount: number;
}

export interface PostType {
  user: {
    name: string;
    profileImage: string;
    headline?: string;
    followers?: string;
    degree: string;
  };
  post: {
    content: string;
    date: number;
    images?: string[];
    video?: string;
    pdf?: string;
    public: boolean;
    edited?: boolean;
  };
  stats: {
    likes?: number;
    comments?: number;
    celebrate?: number;
    love?: number;
    insightful?: number;
    support?: number;
    funny?: number;
    person?: string;
  };
  action?: {
    name?: string;
    profileImage?: string;
    action?: "like" | "comment" | "repost" | "love";
  };
}

export interface ProfileCardType {
  coverImage: string;
  profileImage: string;
  name: string;
  headline: string;
  location: string;
  university: string;
}

export interface CommentType {
  user: {
    profileImage: string;
    name: string;
    degree: string;
    followers?: string;
    headline?: string;
  };
  comment: {
    text: string;
    image?: string;
    edited?: boolean;
  };
  stats: {
    likes?: number;
    replies?: number;
    celebrate?: number;
    love?: number;
    insightful?: number;
    support?: number;
    funny?: number;
    person?: string;
  };
}

export type PostFilter = "all" | "comments" | "reactions" | "reposts";

export interface Organization {
  _id: string;
  logo: string;
  name: string;
}
export interface SkillResponse{
  _id:string;
  name:string
}

export interface Experience {
  _id?: string;
  title: string;
  employee_type: string;
  organization: Organization;
  is_current: boolean;
  start_date: Date;
  end_date?: Date;
  location: string;
  description: string;
  location_type: string;
  skills: string[];
  media: Media[];
}

export interface Media {
  media: string;
  title: string;
  description: string;
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

export interface UserLoginResponse {
  message: string;
  user: {
    email: string;
    id: string;
    isVerified: boolean;
  };
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
  school?: Organization;
  schoolStartYear?: string;
  schoolEndYear?: string;
  is16OrAbove?: boolean;
  employeeType?: string;
  recentCompany?: Organization;
  birthDate?: Date;
  is_verified: boolean;
}

export interface ContactInfo {
  phone_number: number;
  country_code: string;
  phone_type: string;
  address: string;
  birthday: string; // ISO formatted date string
  website: string;
}

export interface Location {
  country_region: string;
  city: string;
}

export interface Bio {
  contact_info: ContactInfo;
  location: Location;
  first_name: string;
  last_name: string;
  headline: string;
  experience: string[];
  education: string[];
  website: string;
}

export interface UserProfileBio {
  is_me: boolean;
  bio: Bio;
  profile_photo: string;
  cover_photo: string;
  number_of_connections: number;
  contact_info: ContactInfo;
  isSubscribed: boolean;
  email: string;
  follow_primary?: boolean;
  is_in_received_connections?: boolean;
  is_in_sent_connections?: boolean;
  name_of_one_mutual_connection?: string;
  isInConnections?: boolean;
  isConnectByEmail: boolean;
  isAlreadyFollowing?: boolean;
  is_default_profile_photo: boolean;
  education: Organization | null;
  work_experience: Organization | null;
  is_defult_cover_photo: boolean;
  profile_visibility:string;

}

// Add to types.ts
export interface Education {
  _id?: string;
  school: Organization; // Reusing Organization type assuming it has name/logo
  degree: string;
  field_of_study: string;
  start_date: Date;
  end_date: Date;
  grade: string;
  activities_and_socials: string;
  skills: string[];
  description: string;
  media: Media[];
}

export interface About {
  about: string;
  skills: string[];
}

export interface License {
  _id?: string;
  name: string;
  issuing_organization: Organization;
  issue_date: Date;
  expiration_date: Date;
  credintial_id: string;
  credintial_url: string;
  skills: string[];
  media: Media[];
}

export interface SkillForm {
  name: string;
  educations: string[];
  experiences: string[];
  licenses: string[];
}

export interface Skill {
  _id?: string;
  name: string;
  endorsments: Endorsement[];
  educations: Organization[];
  experiences: Organization[];
  licenses: Organization[];
  total_endorsements?: number;
}

export interface Endorsement {
  user_id: string;
  profilePicture: string;
  name: string;
}

export interface SkillUserSections {
  educations: Organization[];
  experiences: Organization[];
  licenses: Organization[];
}

export interface MenuAction {
  name: string;
  action: () => void;
  subtext?: string;
  icon: React.ReactNode;
}

export enum MediaType {
  image = "image",
  images = "images",
  video = "video",
  pdf = "pdf",
  post = "post",
  link = "link",
  none = "none",
}

export interface PostDBObject {
  content: string; // Text content of the post
  mediaType: MediaType; // Type of media (e.g., "image", "video", etc.)
  media: string[]; // Array of media URLs or Base64 strings
  commentsDisabled: string; // Indicates if comments are disabled (e.g., "true" or "false")
  publicPost: boolean; // Whether the post is public or not
  taggedUsers: string[]; // Array of user IDs tagged in the post
}

export interface BioFormData {
  first_name: string;
  last_name: string;
  headline: string;
  website:'';
  location: {
    country_region: string;
    city: string;
  };
  contact_info: {
    phone_number: number;
    address: string;
    birthday: string;
    website: string;
    country_code:string
  };
}
