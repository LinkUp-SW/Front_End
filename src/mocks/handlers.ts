// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

// Interface for notification data
interface Notification {
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

// Mock user data
const users: User[] = [
  {
    id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
    firstName: "John",
    lastName: "Maverick",
  },
  {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    firstName: "Jane",
    lastName: "Doe",
  },
];


// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'hiring',
    content: '<b>Amany Raafat</b> is hiring.',
    time: '4h',
    profileImg: '/api/placeholder/50/50',
    isNew: true
  },
  {
    id: '2',
    type: 'analytics',
    content: 'Your posts got <b>15 impressions</b> last week. View your analytics.',
    time: '4h',
    profileImg: '/api/placeholder/50/50',
    isNew: true
  },
  {
    id: '3',
    type: 'course',
    content: 'New from <b>Free Online Courses with Certificates</b> in Free Online Courses: Boost Your Skills with 100 Free Courses and Certificates on Udemy and Coursera',
    time: '11h',
    profileImg: '/api/placeholder/50/50',
    isNew: true
  },
  {
    id: '4',
    type: 'job',
    content: 'software engineer: <b>30+ opportunities</b> in Cairo, Egypt',
    time: '20h',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: true
  },
  {
    id: '5',
    type: 'recommendation',
    content: '<b>ETL Data Analyst</b> at Siemens Digital Industries Software and <b>9 other recommendations</b> for you.',
    time: '1d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: true
  },
  {
    id: '6',
    type: 'job',
    content: 'frontend developer: <b>15+ opportunities</b> in Dubai, UAE',
    time: '1d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: false
  },
  {
    id: '7',
    type: 'job',
    content: 'product manager: <b>12 opportunities</b> in Riyadh, Saudi Arabia',
    time: '2d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: false
  },
  {
    id: '8',
    type: 'hiring',
    content: '<b>Amira</b> is looking for a <b>UX Designer</b>.',
    time: '3d',
    profileImg: '/api/placeholder/50/50',
    action: 'See post',
    actionLink: '#',
    isNew: false
  },
  {
    id: '9',
    type: 'recommendation',
    content: '<b>Data Scientist</b> at Google and <b>7 other recommendations</b> based on your profile.',
    time: '3d',
    profileImg: '/api/placeholder/50/50',
    action: 'View jobs',
    actionLink: '#',
    isNew: false
  }
];

export const handlers = [
  // Get all users
  http.get("/get-users", async () => {
    console.log("[MSW] Intercepted GET /get-users");
    return HttpResponse.json<User[]>(users);
  }),

  // Get user by ID
  http.get("/get-user/:id", async ({ params }) => {
    console.log("[MSW] Intercepted GET /get-user/:id");

    const { id } = params;
    const user = users.find((user) => user.id === id);

    if (!user) {
      return new HttpResponse(null, { status: 404, statusText: "User Not Found" });
    }
    return HttpResponse.json<User>(user);
  }),
  // New handler for notifications
  http.get("/api/notifications", async () => {
    console.log("[MSW] Intercepted GET /api/notifications");
    return HttpResponse.json<Notification[]>(MOCK_NOTIFICATIONS);
  }),
];
