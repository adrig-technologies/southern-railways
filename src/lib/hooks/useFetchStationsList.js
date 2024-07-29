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
            const data = [
              { "id": 1, "from": "AJJ", "to": "RU" },
              { "id": 2, "from": "MAS", "to": "AJJ" },
              { "id": 3, "from": "AJJ", "to": "KPD" },
              { "id": 4, "from": "KPD", "to": "JTJ" },
              { "id": 5, "from": "MAS", "to": "SPE" },
              { "id": 6, "from": "SPE", "to": "GDR" }
          ];
            resolve({ ok: true, json: () => Promise.resolve(data) });
          }, 0);
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
