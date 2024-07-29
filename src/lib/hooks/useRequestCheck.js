import { useState, useEffect } from "react";

const useRequestCheck = () => {
  const [requestCheck, setRequestCheck] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestCheck = async () => {
      try {
        setIsFetching(true);
        const response = await fetch('http://127.0.0.1:5000/check_request_table');

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

    fetchRequestCheck();
  }, []);

  return { requestCheck, isFetching, error };
};

export default useRequestCheck;