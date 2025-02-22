import { useState, useEffect, useCallback } from "react";

const useFetchData = <T>(
  fetchDataFn: () => Promise<T>,
  dependencies: unknown[] = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch function wrapped in useCallback for stability
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDataFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchDataFn]);

  // Effect to fetch data on mount or dependency change
  useEffect(() => {
    fetchData(); // Use the stable fetchData function
  }, [...dependencies]); // Include both fetchData and dependencies

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
