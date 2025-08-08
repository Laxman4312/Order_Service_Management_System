// src/hooks/api-custom-hooks/useDataFetching.js
import { useState, useCallback } from 'react';

export const useDataFetching = (fetchFunction) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  const fetchData = useCallback(
    async (params = {}) => {
      setIsLoading(true);
      setIsError(null);

      try {
        const result = await fetchFunction(params);

        setData(result);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err?.message || 'An unexpected error occurred';
        setIsError(errorMessage);

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction],
  );

  const refetch = useCallback(
    (params = {}) => {
      return fetchData(params);
    },
    [fetchData],
  );

  const reset = useCallback(() => {
    setData(null);
    setIsError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    isError,
    refetch,
    fetchData,
    reset,
  };
};
