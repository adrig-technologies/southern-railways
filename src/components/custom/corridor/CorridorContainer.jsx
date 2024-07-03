'use client'

import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import { formatDate } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from 'next/image';
import { CorridorTimeline } from '@/assets';
import Loader from '../Loader';

const CorridorContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sectionData, setSectionData] = useState({});
  const [startDateBound, setStartDateBound] = useState(null);
  const [endDateBound, setEndDateBound] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState('AJJ-RU');
  const date = new Date();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post('http://localhost:4000/getcorridorblock', {
          date: date,
          block: selectedBlock,
        });

        if (res && res.data) {
          const formattedData = formatResponseData(res.data);
          setSectionData(formattedData.sectionData);
          setStartDateBound(formattedData.startDateBound);
          setEndDateBound(formattedData.endDateBound);
          console.log('formattedData:', formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const generateChartData = (tasks) => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }

    const dataTable = [
      [
        { type: 'string', id: 'Station' },
        { type: 'string', id: 'Task ID' },
        { type: 'date', id: 'Start Date' },
        { type: 'date', id: 'End Date' },
      ],
    ];

    tasks.forEach((task) => {
      dataTable.push([task.name, task.id, task.start, task.end]);
    });

    return dataTable;
  };

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
  };

  const blockOptions = ['AJJ-RU', 'Another-Block', 'More-Blocks']; // Example options, replace with actual block options

  return (
    <div className="w-4/5 min-h-screen flex flex-col space-y-8 p-24 items-center mx-auto">
      <div className="w-full flex justify-center items-center space-x-4">
        <div className='w-14 h-14 flex items-center justify-center bg-slate-100 rounded-full shadow-md'><Image src={CorridorTimeline} alt='Corridor Timeline' className='w-full h-full ml-1' /></div>
        <h1 className="text-2xl font-bold font-sans text-slate-800">Corridor Timeline</h1>
      </div>
      <p className='w-full text-center text-md font-sans text-slate-600'>The Corridor Timetable provides a detailed schedule of activities and events occurring within the corridor. It ensures everyone is informed about meetings, collaborative sessions and maintenance.</p>
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
      {
        isLoading ? (
          <div className='w-full flex-1 h-full flex items-center justify-center text-xl font-semibold text-slate-800'>
            <Loader />
            </div>
        ) : (
          <div className='w-full'>
            <Accordion type="multiple" collapsible className="w-full">
            {Object.entries(sectionData).map(([date, tasks], index) => (
              <AccordionItem key={index} value={date}>
              <AccordionTrigger className="text-slate-700 text-md underline-offset-2 hover:bg-slate-50 px-2 rounded-md">{`${formatDate(date)}`}</AccordionTrigger>
              <AccordionContent className="p-2">
              <Chart
                chartType="Timeline"
                options={{
                  timeline: { showRowLabels: true, showBarLabels: false },
                  hAxis: {
                    minValue: startDateBound,
                    maxValue: endDateBound,
                    slantedText: false,
                    format: 'HH:mm:ss',
                    title: 'Time of Day',
                    titleTextStyle: { italic: false },
                  },
                  tooltip: { isHtml: true },
                }}
                data={generateChartData(tasks)}
                width="fit"
                height="250px"
              />
              </AccordionContent>
            </AccordionItem>
          ))}
    </Accordion>
        </div>
        )
      }
    </div>
  );
};

export default CorridorContainer;
