import '@testing-library/jest-dom';
import { describe, beforeEach, test, expect, vi } from 'vitest';
import axios from 'axios';
import { getNotifications } from '../../src/endpoints/notifications';


// Mock axios module
vi.mock('axios');
// Create a properly typed mock for axios that includes mockResolvedValueOnce
const mockedAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
};

// Override the axios import with our mock
vi.mocked(axios).get = mockedAxios.get;
vi.mocked(axios).post = mockedAxios.post;

describe('getNotifications Endpoint', () => {
  const mockToken = 'test-token';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetches notifications successfully', async () => {
    // Setup mock response with a dynamic structure to be resilient to changes
    // This avoids relying on specific notification structures
    const mockResponse = {
      data: [{ id: '1' }] // Minimal valid response structure
    };
    
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    // Call the function
    const result = await getNotifications(mockToken);

    // Verify the API was called correctly
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/notifications', {
      headers: {
        Authorization: 'Bearer ' + mockToken
      }
    });
    
    // Just verify we get back what the API returns without checking specific fields
    expect(result).toEqual(mockResponse.data);
  });

  test('handles API error properly', async () => {
    // Setup mock rejection with a generic error
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    // Call and verify error handling
    await expect(getNotifications(mockToken)).rejects.toThrow();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  test('handles empty response', async () => {
    // Setup mock empty response
    mockedAxios.get.mockResolvedValueOnce({
      data: []
    });

    // Call the function
    const result = await getNotifications(mockToken);

    // Assertions
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});