"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useFetchStationsList from "@/lib/hooks/useFetchStationsList";
import useFetchByStation from "@/lib/hooks/useFetchByStation";
import AddHoc from "./AddHoc";
import useOptimizedCheck from "@/lib/hooks/useOptimizedCheck";
import { cn } from "@/lib/utils";
import useIsAdmin from "@/lib/hooks/useIsAdmin";
import { useRouter } from "next/navigation";

const ToolBar = ({ setScheduleDataByStation }) => {
  const { stationsListData } = useFetchStationsList();
  const [stationsList, setStationsList] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const { optimizedCheck, isFetching, error }= useOptimizedCheck();
  const { isAdmin, isLoading } = useIsAdmin();

  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/optimize`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Redirect to /optimized-table after successful API request
      router.push('/optimised-table');
    } catch (error) {
      console.error('Failed to optimize:', error);
      // Optionally, handle the error (e.g., show an error message)
    }
  };

  // Fetch station data whenever start or end changes
  const { stationData } = useFetchByStation(start, end);

  useEffect(() => {
    if (stationsListData && stationsListData.length > 0) {
      setStationsList(stationsListData);
      const firstStation = stationsListData[0];
      setSelectedStation(firstStation.id.toString());
      setStart(firstStation.from);
      setEnd(firstStation.to);
    }
  }, [stationsListData]);

  useEffect(() => {
    if (stationData) {
      setScheduleDataByStation(stationData);
    }
  }, [stationData, setScheduleDataByStation]);

  const handleSelectChange = (value) => {
    setSelectedStation(value);
    const selectedStationObj = stationsList.find(
      (station) => station.id.toString() === value
    );
    if (selectedStationObj) {
      setStart(selectedStationObj.from);
      setEnd(selectedStationObj.to);
    }
  };

  return (
    <section className="w-full flex items-center justify-center py-8 px-6 bg-secondary rounded-xl">    
      <div className="w-full flex items-center space-x-8">
        {stationsList.length > 0 && (
          <Select value={selectedStation} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-96">
              <SelectValue>
                {stationsList.find(
                  (station) => station.id.toString() === selectedStation
                )?.from} -{" "}
                {stationsList.find(
                  (station) => station.id.toString() === selectedStation
                )?.to}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {stationsList.map((station) => (
                  <SelectItem key={station.id} value={station.id.toString()}>
                    {station.from} - {station.to}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <AddHoc />
      </div>
      <div>
        <Button className={cn("rounded-3xl bg-primarygreen mr-28 text-white w-32 font-bold shadow-md shadow-secondary-foreground"
          , (optimizedCheck || !isAdmin) && "hidden"
        )}
        onClick={handleClick}

        >
          <span>Optimize</span>
        </Button>
      </div>
    </section>
  );
};

export default ToolBar;
