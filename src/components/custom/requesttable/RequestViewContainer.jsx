'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import GanttChart from "../GanttChart";
import moment from "moment";
import Image from 'next/image';
import Loader from '../Loader';
import { RequestTimeline } from "@/assets";

const RequestViewContainer = () => {
  const [sectionData, setSectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const res = await axios.post("http://localhost:4000/getRequests",{
          startDate: moment().subtract(1, "years"),
          endDate:new Date().toISOString(),
        });
        setSectionData(res.data.map(block=>{
          return {
            id:block.Req_ID,
            team:block.Station.Station,
            name:block.Req_ID,
            start:moment(block.startTime).format("HH:mm"),
            end:moment(block.endTime).format("HH:mm")
          }
        }));
        console.log(res.data)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchData();
  }, []);


  return (
    <div className="w-4/5 min-h-screen flex flex-col space-y-8 p-24 items-center mx-auto">
      <div className="w-full flex justify-center items-center space-x-4">
        <div className='w-14 h-14 flex items-center justify-center bg-slate-100 rounded-full shadow-md'><Image src={RequestTimeline} alt='Request Timeline' className='w-full h-full ml-1' /></div>
        <h1 className="text-2xl font-bold font-sans text-slate-800">Request Timeline</h1>
      </div>
      <p className='w-full text-center text-md font-sans text-slate-600'>The Corridor block timetable provides a detailed schedule of free time between every station inside a section to understand when maintenance between every station can be held, and this visualisation contains the corridor block of the next 7 days alone.</p>
      {isLoading ? (
        <div className='w-full flex-1 h-full flex items-center justify-center text-xl font-semibold text-slate-800'>
        <Loader />
        </div>
      ) : (
        <GanttChart tasks={sectionData}/>
      )}
    </div>
  )
}

export default RequestViewContainer;
