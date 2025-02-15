import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { UserList } from '../../src/components';
import React from 'react';
import { beforeAll, afterEach, afterAll, test, expect } from 'vitest';

// Define the User type
interface User {
  id: string;
  firstName: string;
  lastName: string;
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches and displays user data from the API', async () => {
  server.use(
    http.get('/get-users', async () => {
      // Specify array type for proper response structure
      return HttpResponse.json<User>(
        {
          id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
          firstName: 'John',
          lastName: 'Maverick',
        },
      );
    })
  );

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText('John Maverick')).toBeInTheDocument();
  }, { timeout: 3000 });
});