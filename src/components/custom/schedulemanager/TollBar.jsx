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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import useFetchByStation from "@/lib/hooks/useFetchByStation";
import useFetchStationsList from "@/lib/hooks/useFetchStationsList";

const ToolBar = ({ setScheduleDataByStation }) => {
  const { stationsListData } = useFetchStationsList();
  const [stationsList, setStationsList] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const { stationData, isStationFetching, error } = useFetchByStation(start, end);

  // Effect to update stations list and set default station
  useEffect(() => {
    if (stationsListData && stationsListData.length > 0) {
      setStationsList(stationsListData);
      const firstStation = stationsListData[0];
      setSelectedStation(firstStation.id.toString());
      setStart(firstStation.from);
      setEnd(firstStation.to);
    }
  }, [stationsListData]);

  // Effect to fetch station data when start or end changes
  useEffect(() => {
    if (start && end) {
      // No need to manually call the hook here, it will handle itself based on state changes
    }
  }, [start, end]);

  // Effect to handle fetched data
  useEffect(() => {
    if (stationData) {
      setScheduleDataByStation(stationData);
    }
  }, [stationData, setScheduleDataByStation]);

  // Handle select change
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
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Ad-Hoc</Label>
        </div>
      </div>
      <div>
        <Button className="rounded-3xl bg-primarygreen w-32 font-bold shadow-md shadow-secondary-foreground">
          <span>Optimize</span>
        </Button>
      </div>
    </section>
  );
};

export default ToolBar;
