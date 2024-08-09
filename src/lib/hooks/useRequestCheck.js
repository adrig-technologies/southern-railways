import { useState, useEffect } from "react";

const useRequestCheck = () => {
  const [requestCheck, setRequestCheck] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequestCheck = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/check_request_table`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setRequestCheck(result.has_rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRequestCheck();
  }, []);

  return { requestCheck, isFetching, error, fetchRequestCheck };
};

export default useRequestCheck;