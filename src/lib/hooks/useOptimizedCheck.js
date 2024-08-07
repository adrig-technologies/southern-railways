import { useState, useEffect } from "react";

const useOptimizedCheck = () => {
  const [optimizedCheck, setOptimizedCheck] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptimizedCheck = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/check_optimized_table`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setOptimizedCheck(result.has_rows);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchOptimizedCheck();
  }, []);

  return { optimizedCheck, isFetching, error };
};

export default useOptimizedCheck;