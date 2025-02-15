import { vi } from "vitest";

export const mockFetchResponse = (data: unknown, status = 200) => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(data),
        status,
      } as Response)
    );
  };
  