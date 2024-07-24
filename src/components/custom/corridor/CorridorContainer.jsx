"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "@/lib/utils";
import { CorridorTimeline } from "@/assets";
import Loader from "../Loader";
import GanttChart from "../GanttChart";
import moment from "moment";
import HeaderContent from "../HeaderContent";

const CorridorContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sectionData, setSectionData] = useState({});
  const [selectedBlock, setSelectedBlock] = useState("AJJ-RU");
  const date = new Date();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post("http://localhost:4000/getcorridorblock", {
          date: date,
          block: selectedBlock,
        });

        const obj = {};
        debugger;
        for (const [date, values] of Object.entries(res.data)) {
          obj[date] = values.map((block) => {
            return {
              id: block.station_id,
              team: block.Station.Station,
              name: block.station_id,
              start: moment(block.start_time).format("HH:mm"),
              end: moment(block.end_time).format("HH:mm"),
            };
          });
        }

        if (res && res.data) {
          const formattedData = formatResponseData(res.data);
          setSectionData(obj);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedBlock]);

  const formatResponseData = (data) => {
    const IST_OFFSET = -(5 * 60 + 30); // Offset in minutes

    let formattedSectionData = {};
    let allStartDates = [];
    let allEndDates = [];

    Object.keys(data).forEach((date) => {
      const tasks = data[date].map((task) => {
        const startUTC = new Date(task.start_time);
        const endUTC = new Date(task.end_time);
        const startIST = new Date(startUTC.getTime() + IST_OFFSET * 60000);
        const endIST = new Date(endUTC.getTime() + IST_OFFSET * 60000);

        return {
          id: `task-${task.station_id}`, // Assuming station_id can serve as a unique identifier
          start: startIST, // Adjusted to IST
          end: endIST, // Adjusted to IST
          name: task.Station.Station, // Use the Station name as the task name
        };
      });
      formattedSectionData[date] = tasks;
      allStartDates.push(...tasks.map((task) => task.start));
      allEndDates.push(...tasks.map((task) => task.end));
    });

    let formattedStartDateBound = new Date(Math.min(...allStartDates));
    let formattedEndDateBound = new Date(Math.max(...allEndDates));

    return {
      sectionData: formattedSectionData,
      startDateBound: formattedStartDateBound,
      endDateBound: formattedEndDateBound.setHours(11, 59, 59, 999),
    };
  };

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
  };

  const blockOptions = ["AJJ-RU", "Another-Block", "More-Blocks"]; // Example options, replace with actual block options

  return (
    <div className="w-4/5 min-h-screen flex flex-col space-y-8 p-24 items-center mx-auto">
      <HeaderContent title='Corridor Timeline' description='The Corridor block timetable provides a detailed schedule of free time
        between every station inside a section to understand when maintenance
        between every station can be held, and this visualization contains the
        corridor block of the next 7 days alone.' img={CorridorTimeline} />
      {/* <div className="">
        <select
          value={selectedBlock}
          onChange={handleBlockChange}
          className="p-2 border rounded"
        >
          {blockOptions.map((block) => (
            <option key={block} value={block}>
              {block}
            </option>
          ))}
        </select>
      </div> */}
      {isLoading ? (
        <div className="w-full flex-1 h-full flex items-center justify-center text-xl font-semibold text-slate-800">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full flex flex-col space-y-24">
            {Object.entries(sectionData).map(([date, tasks], index) => (
              <section key={index} className="flex flex-col space-y-4">
                <span className="text-slate-700 text-xl font-semibold font-sans underline-offset-2 px-2 rounded-md">{`${formatDate(
                  date
                )}:`}</span>
                <GanttChart tasks={tasks} />
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CorridorContainer;
