import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw'; // Use http instead of rest
import { server } from '../../src/mocks/server'; // Import test server
import {UserList} from '../../src/components';
import React from 'react';
import { beforeAll, afterEach, afterAll, test, expect } from 'vitest';

beforeAll(() => server.listen()); // Start MSW before running tests
afterEach(() => server.resetHandlers()); // Reset handlers after each test
afterAll(() => server.close()); // Close MSW after all tests

test('fetches and displays user data from the API', async () => {
  // Override the mock response for this test
  server.use(
    http.get('/get-users', async () => {
      return HttpResponse.json({
        id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
        firstName: 'John',
        lastName: 'Maverick',
      });
    })
  );

  render(<UserList />);

  // Wait until the user data appears in the DOM
  await waitFor(() => {
    expect(screen.getByText('John Maverick')).toBeInTheDocument();
  }, { timeout: 3000 }); // Increase timeout to 3 seconds
  
});
