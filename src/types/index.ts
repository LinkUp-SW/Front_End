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
