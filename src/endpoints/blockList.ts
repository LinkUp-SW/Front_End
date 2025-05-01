// Mock data for blocked users
export interface BlockedUser {
    id: string;
    name: string;
    blockedDate: string;
    image?: string;
  }
  
  export const blockedUsers: BlockedUser[] = [
    {
      id: '1',
      name: 'user1',
      blockedDate: '7 months ago',
      image: '/src/assets/profile1.jpg'
    },
    {
      id: '2',
      name: 'user2',
      blockedDate: '7 months ago',
      image: '/src/assets/profile2.jpg'
    }
  ];