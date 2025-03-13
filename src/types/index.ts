export interface test{
    name:string
}

export interface Notification {
  id: string;
  type: 'job' | 'post' | 'hiring' | 'course' | 'analytics' | 'recommendation';
  content: string;
  time: string;
  profileImg?: string;
  action?: string;
  actionLink?: string;
  location?: string;
  count?: number;
  isNew?: boolean;
}


// Define post filter types
export type PostFilter = 'all' | 'comments' | 'reactions' | 'reposts';