export interface test {
  name: string;
}
export interface RemoveConnectionData {
  userId: number;
  userName: string;
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



export type PostFilter = 'all' | 'comments' | 'reactions' | 'reposts';