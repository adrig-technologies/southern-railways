import { useState, useEffect } from "react";

const useFetchByStation = (start, end) => {
  const [stationData, setStationData] = useState(null);
  const [isStationFetching, setIsStationFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setIsStationFetching(true);
        // Simulate fetch
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            const data = {
              station: "Thambaram to Beach", 
              week: [
                { date: "2024-07-21", conflictCount: 3, availableSlot: 8 },
                { date: "2024-07-22", conflictCount: 5, availableSlot: 6 },
                { date: "2024-07-23", conflictCount: 2, availableSlot: 7 },
                { date: "2024-07-24", conflictCount: 1, availableSlot: 9 },
                { date: "2024-07-25", conflictCount: 0, availableSlot: 10 },
                { date: "2024-07-26", conflictCount: 4, availableSlot: 5 },
                { date: "2024-07-27", conflictCount: 3, availableSlot: 8 },
              ],
            };
            resolve({ ok: true, json: () => Promise.resolve(data) });
          }, 2000);
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setStationData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsStationFetching(false);
      }
    };

    fetchStationData();
  }, [start, end]);

  return { stationData, isStationFetching, error };
};

export default useFetchByStation;
