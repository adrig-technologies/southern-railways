'use client'

import React, { useEffect, useState } from "react";
import WeekSchedule from './WeekSchedule'
import ToolBar from "./TollBar";
import useFetchByStation from "@/lib/hooks/useFetchByStation";

const ScheduleManager = () => {
  const { isStationFetching, stationData } = useFetchByStation();
  const [scheduleDataByStation, setScheduleDataByStation] = useState(null);

  useEffect(() => {
    setScheduleDataByStation(stationData);
  }, [stationData]);

  return (
    <div className='w-full h-[95vh] flex flex-col items-center space-y-6'>
      <ToolBar setScheduleDataByStation={setScheduleDataByStation} />
      <WeekSchedule isStationFetching={isStationFetching} scheduleDataByStation={scheduleDataByStation} />
    </div>
  );
};

export default ScheduleManager;
