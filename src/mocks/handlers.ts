// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

interface User {
  id: string;
  firstName: string;
  lastName: string;
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
];
