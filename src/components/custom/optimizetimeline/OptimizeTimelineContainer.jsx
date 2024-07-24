'use client'

import { OptimizedTimeline } from '@/assets';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Loader from '../Loader';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import moment from "moment";
import GanttChart1 from '../GanttChart1';
import HeaderContent from '../HeaderContent';

const OptimizeTimelineContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sectionData, setSectionData] = useState({});

  function groupByDateWithStationIds(data) {
    const result = {};
  
    for (const stationId in data) {
      data[stationId].forEach(request => {
        if (!result[request.startDate]) {
          result[request.startDate] = [];
        }
        // Include stationId in each request
        const requestWithStationId = { ...request, stationId: parseInt(stationId) };
        result[request.startDate].push(requestWithStationId);
      });
    }
  
    return result;
  }
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:4000/getSchedule');

        const obj = groupByDateWithStationIds(res.data)
        const obj2 = {}
        for (const [date, values] of Object.entries(obj)) {
          obj2[date] = values.map(block => {
                    return {
                      id:block.requestId,
                      team: block.stationId,
                      name:block.requestId,
                      machine: block.machineId,
                      start:moment().startOf('day').add(block.startTime,"minutes").format("HH:mm"),
                      end:moment().startOf('day').add(block.endTime,"minutes").format("HH:mm")
                    }
             })
          }
        if (res && res.data) {
          setSectionData(obj2);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-4/5 min-h-screen flex flex-col space-y-8 p-24 items-center mx-auto">
    <HeaderContent title='Optimized Timeline' description='This optimization of the request are done by multiple scheduling algorithms and we have ensured to make the best use of the time and provide with extra free time for the railways to operate it other services on the days where there is no maintenance.' img={OptimizedTimeline} />
    {
      isLoading ? (
        <div className='w-full flex-1 h-full flex items-center justify-center text-xl font-semibold text-slate-800'>
          <Loader />
          </div>
      ) : (
        <div className='w-full'>
          <div className="w-full flex flex-col space-y-24">
          {Object.entries(sectionData).map(([date, tasks], index) => (
            <section key={index} className='flex flex-col space-y-4'>
            <span className="text-slate-700 text-xl font-semibold font-sans underline-offset-2 px-2 rounded-md">{`${formatDate(date)}:`}</span>
            <GanttChart1 tasks={tasks}/>
            </section>
         ))}
  </div>
      </div>
      )
    }
  </div>
  )
}

export default OptimizeTimelineContainer