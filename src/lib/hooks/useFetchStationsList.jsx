import { useState, useEffect } from "react";

const useFetchStationsList = () => {
  const [stationsListData, setStationsListData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStationsListData = async () => {
      try {
        // Simulate fetch
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            const data = [{ id: 1, from: "Tambaram", to: "Beach" },
              { id: 2, from: "Beach", to: "Tambaram" }
            ];
            resolve({ ok: true, json: () => Promise.resolve(data) });
          }, 1000);
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setStationsListData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStationsListData();
  }, []);

  return { stationsListData, error };
};

export default useFetchStationsList;
